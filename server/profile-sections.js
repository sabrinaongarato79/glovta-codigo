import { profileSections, validateSection } from '../profile-model.js';
export function installSectionRoutes(app, auth) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  app.use('/api/profile-sections/:section', auth, (req, res, next) => {
    if (!Object.hasOwn(profileSections, req.params.section)) return res.status(404).json({error:'Sección desconocida.'});
    next();
  });
  function reply(res, result, status = 200) {
    if (result.error) {
      const code = result.error.code;
      return res.status(code === '23505' ? 409 : code === '23503' ? 422 : code === '42501' ? 403 : 502)
        .json({error: code === '23505' ? 'Ese registro ya existe.' : code === '23503' ? 'Guardá primero tu presentación personal.' : 'No se pudo completar la operación.'});
    }
    if (!result.data) return res.status(404).json({error:'Registro no disponible.'});
    res.status(status).json(result.data);
  }
  app.get('/api/profile-sections/:section', async (req,res) => {
    reply(res, await req.db.from(profileSections[req.params.section].table).select('*').eq('profile_id',req.user.id).order('created_at'));
  });
  app.post('/api/profile-sections/:section', async (req,res) => {
    let fields;
    try { fields = validateSection(req.params.section, req.body); }
    catch(error) { return res.status(400).json({error:error.message}); }
    reply(res, await req.db.from(profileSections[req.params.section].table).insert({...fields,profile_id:req.user.id}).select().single(),201);
  });
  app.put('/api/profile-sections/:section/:id', async (req,res) => {
    if (!uuid.test(req.params.id)) return res.status(400).json({error:'Identificador inválido.'});
    let fields;
    try { fields=validateSection(req.params.section,req.body); }
    catch(error) { return res.status(400).json({error:error.message}); }
    reply(res,await req.db.from(profileSections[req.params.section].table).update(fields).eq('profile_id',req.user.id).eq('id',req.params.id).select().maybeSingle());
  });
  app.delete('/api/profile-sections/:section/:id', async (req,res) => {
    if (!uuid.test(req.params.id)) return res.status(400).json({error:'Identificador inválido.'});
    reply(res,await req.db.from(profileSections[req.params.section].table).delete().eq('profile_id',req.user.id).eq('id',req.params.id).select('id').maybeSingle());
  });
}
