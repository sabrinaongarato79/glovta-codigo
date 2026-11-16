import { installSectionRoutes } from './profile-sections.js';
import { installAuthRoutes } from './auth.js';
import { installEmployerRoutes } from './employer.js';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fail = (status, message) => Object.assign(new Error(message), { status });

export function createApp({ env = process.env, clientFactory = createClient } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use(express.json({ limit: '16kb' }));
  const configured = Boolean(env.SUPABASE_URL && env.SUPABASE_PUBLISHABLE_KEY);
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', supabaseConfigured: configured }));
  app.use('/api', (req, _res, next) => {
    if (!configured) return next(fail(503, 'Supabase todavía no está configurado.'));
    req.db = clientFactory(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: req.headers.authorization ? { Authorization: req.headers.authorization } : {} }
    });
    next();
  });
  installAuthRoutes(app);
  async function auth(req, _res, next) {
    const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization || '');
    if (!match) throw fail(401, 'Iniciá sesión para continuar.');
    const { data, error } = await req.db.auth.getUser(match[1]);
    if (error || !data?.user) throw fail(401, 'La sesión no es válida.');
    req.user = data.user;
    next();
  }
  function result(res, response, status = 200) {
    if (response.error) {
      if (response.error.code === '23505') throw fail(409, 'Ya existe una postulación para esta oportunidad.');
      if (response.error.code === '42501') throw fail(403, 'No tenés permiso para realizar esta operación.');
      if (response.error.code === '23503') throw fail(422, 'Completá tu perfil y seleccioná una oportunidad vigente.');
      throw fail(502, 'No se pudo completar la operación en Supabase.');
    }
    res.status(status).json(response.data);
  }
  app.get('/api/opportunities', async (req, res) => {
    result(res, await req.db.from('opportunities').select('id,title,company_name,description,location,closes_at').eq('status', 'published').order('created_at', { ascending: false }).limit(100));
  });
  app.get('/api/profile', auth, async (req, res) => {
    result(res, await req.db.from('profiles').select('*').eq('id', req.user.id).maybeSingle());
  });
  app.put('/api/profile', auth, async (req, res) => {
    const body = req.body;
    if (!body || Array.isArray(body) || typeof body !== 'object') throw fail(400, 'Perfil inválido.');
    const limits = { full_name: 150, headline: 200, location: 150, bio: 3000 };
    const preferences = { career_goal: 1000, work_mode: 20, work_schedule: 20, sectors: 500, opportunity_types: 500 };
    if (Object.keys(body).some(key => !Object.hasOwn(limits, key) && !Object.hasOwn(preferences, key))) throw fail(400, 'El perfil contiene campos no permitidos.');
    const profile = { id: req.user.id };
    for (const [field, limit] of Object.entries(limits)) {
      const value = body[field] ?? '';
      if (typeof value !== 'string' || value.length > limit) throw fail(400, `Campo inválido: ${field}.`);
      profile[field] = value.trim();
    }
    for (const [field, limit] of Object.entries(preferences)) {
      if (!Object.hasOwn(body, field)) continue;
      if (typeof body[field] !== 'string' || body[field].length > limit) throw fail(400, 'Preferencia inválida.');
      profile[field] = body[field].trim();
    }
    if (Object.hasOwn(profile, 'work_mode') && !['', 'remote', 'hybrid', 'onsite', 'flexible'].includes(profile.work_mode)) throw fail(400, 'Modalidad inválida.');
    if (Object.hasOwn(profile, 'work_schedule') && !['', 'full_time', 'part_time', 'flexible'].includes(profile.work_schedule)) throw fail(400, 'Jornada inválida.');
    if (!profile.full_name) throw fail(400, 'Ingresá tu nombre.');
    // Use explicit insert/update: SQL grants intentionally exclude updating the id.
    const existing = await req.db.from('profiles').select('id').eq('id', req.user.id).maybeSingle();
    if (existing.error) return result(res, existing);
    const { id, ...fields } = profile;
    const query = existing.data
      ? req.db.from('profiles').update(fields).eq('id', id)
      : req.db.from('profiles').insert(profile);
    result(res, await query.select().single());
  });
  app.get('/api/applications', auth, async (req, res) => {
    result(res, await req.db.from('applications').select('*').eq('candidate_id', req.user.id).order('created_at', { ascending: false }).limit(100));
  });
  app.post('/api/applications', auth, async (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key => !['opportunity_id', 'cover_note'].includes(key)) || typeof body.opportunity_id !== 'string' || !uuid.test(body.opportunity_id) || typeof (body.cover_note ?? '') !== 'string' || (body.cover_note || '').length > 3000) throw fail(400, 'Postulación inválida.');
    result(res, await req.db.from('applications').insert({ candidate_id: req.user.id, opportunity_id: body.opportunity_id, cover_note: body.cover_note || '' }).select().single(), 201);
  });
  installSectionRoutes(app, auth);
  installEmployerRoutes(app,{auth,enabled:env.GLOVTA_EMPLOYER_ENABLED === 'true',result,fail});
  app.use('/api', (_req, _res, next) => next(fail(404, 'Ruta no encontrada.')));
  // Only approved public assets are served; .env, SQL and server files stay private.
  app.use('/assets', express.static(path.join(root, 'assets'), { dotfiles: 'deny' }));
  for (const file of ['index.html', 'admin.html', 'app.js', 'storage.js', 'styles.css', 'sw.js', 'manifest.webmanifest', 'portal.html', 'portal.js', 'portal.css', 'recuperar.html', 'recuperar.js', 'profile-model.js']) {
    app.get(file === 'index.html' ? ['/', '/index.html'] : `/${file}`, (_req, res) => res.sendFile(path.join(root, file)));
  }
  app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    res.status(status).json({ error: status === 413 ? 'El contenido es demasiado grande.' : status === 400 ? 'Revisá los datos enviados.' : status >= 500 && status !== 503 && status !== 502 ? 'Error interno del servidor.' : error.message });
  });
  return app;
}




