export function installEmployerRoutes(app, {auth, enabled, result, fail}) {
  app.get('/api/employer', auth, async (req,res) => {
    if (!enabled) return res.json(null);
    result(res, await req.db.from('employer_accounts').select('company_name').eq('user_id',req.user.id).maybeSingle());
  });
  app.use('/api/employer', auth, async (req,res,next) => {
    if (!enabled) throw fail(404,'Módulo de empresas pendiente de habilitación.');
    const membership = await req.db.from('employer_accounts').select('company_name').eq('user_id',req.user.id).maybeSingle();
    if (membership.error) return result(res,membership);
    if (!membership.data) throw fail(403,'Se requiere una cuenta de empresa habilitada.');
    req.company = membership.data.company_name;
    next();
  });
  app.post('/api/employer/offers', async (req,res) => {
    const fields = {};
    const limits = {title:200,location:200,description:10000};
    if (!req.body || Object.keys(req.body).some(key => !Object.hasOwn(limits,key))) throw fail(400,'Revisá los campos de la oferta.');
    for (const [key,max] of Object.entries(limits)) {
      const value = req.body[key] ?? '';
      if (typeof value !== 'string' || value.length > max || (key !== 'location' && !value.trim())) throw fail(400,'Revisá el título y la descripción.');
      fields[key] = value.trim();
    }
    result(res, await req.db.from('opportunities').insert({...fields,company_name:req.company,employer_id:req.user.id,status:'published'}).select('id,title').single(),201);
  });
  app.get('/api/employer/applications', async (req,res) => {
    result(res, await req.db.from('applications').select('id,status,cover_note,opportunities!inner(title,employer_id)').eq('opportunities.employer_id',req.user.id).order('created_at',{ascending:false}).limit(100));
  });
  app.patch('/api/employer/applications/:id', async (req,res) => {
    const status = req.body?.status;
    if (!['reviewing','accepted','rejected'].includes(status) || !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(req.params.id)) throw fail(400,'Revisá la solicitud.');
    const previous = status === 'reviewing' ? 'submitted' : 'reviewing';
    const updated = await req.db.from('applications').update({status}).eq('id',req.params.id).eq('status',previous).select('id,status').maybeSingle();
    if (!updated.error && !updated.data) throw fail(409,'La postulación cambió o está fuera de tu alcance.');
    result(res,updated);
  });
}
