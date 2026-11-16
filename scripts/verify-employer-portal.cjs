// With QA_STAGE_REF this exercises a separate, explicitly configured Supabase project.
// Without it the browser uses synthetic responses to check the UX in isolation.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {randomUUID} = require('node:crypto');
const fs = require('node:fs/promises');
async function run() {
  const {createApp} = await import('../server/app.js');
  const ref = process.env.QA_STAGE_REF;
  const demo = !ref;
  if (!demo) {
    assert.match(ref,/^[a-z0-9]{20}$/);
    assert.equal(process.env.SUPABASE_URL,'https://'+ref+'.supabase.co');
    assert.notEqual(ref,'elgtdvgddukmzqthztbo');
    for (const key of ['SUPABASE_PUBLISHABLE_KEY','QA_COMPANY_EMAIL','QA_COMPANY_PASSWORD','QA_CANDIDATE_EMAIL','QA_CANDIDATE_PASSWORD']) assert.ok(process.env[key],key+' requerido');
    assert.notEqual(process.env.QA_CANDIDATE_EMAIL,process.env.QA_COMPANY_EMAIL);
  }
  const server=createApp({env:demo?{}:{...process.env,GLOVTA_EMPLOYER_ENABLED:'true'}}).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  const browser=await chromium.launch({channel:'msedge'});
  const offers=[], applications=[];
  const title='Analista de procesos · Demo '+randomUUID().slice(0,8);
  const mode = demo ? 'local' : 'evaluacion';
  const evidenceDir = 'output/qa/empresa-'+mode;
  await fs.mkdir(evidenceDir,{recursive:true});
  const browserErrors=[];
  try {
    async function login(role) {
      const page=await browser.newPage();
      page.on('pageerror',error=>browserErrors.push(error.name));
      if (demo) await page.route('**/api/**',async route=>{
        const req=route.request(), path=new URL(req.url()).pathname, method=req.method();
        let data=[];
        if(path.endsWith('/login')) data={access_token:role,refresh_token:role};
        else if(path.endsWith('/profile')) data={full_name:'Cuenta QA'};
        else if(path.endsWith('/employer')) data=role==='COMPANY'?{company_name:'Empresa QA'}:null;
        else if(path.endsWith('/employer/offers')) {data={...req.postDataJSON(),id:randomUUID(),company_name:'Empresa QA'};offers.push(data);}
        else if(path.endsWith('/opportunities')) data=offers;
        else if(path.endsWith('/employer/applications')) data=applications;
        else if(method==='PATCH') {data=applications[0];data.status=req.postDataJSON().status;}
        else if(path.endsWith('/applications')&&method==='POST') {data={...req.postDataJSON(),id:randomUUID(),status:'submitted',opportunities:{title}};applications.push(data);}
        else if(path.endsWith('/applications')) data=role==='CANDIDATE'?applications:[];
        await route.fulfill({json:data});
      });
      await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html#jobs-section');
      await page.getByLabel('Correo electrónico').fill(demo?role+'@example.test':process.env['QA_'+role+'_EMAIL']);
      await page.getByLabel('Contraseña',{exact:true}).fill(demo?'clave-ficticia':process.env['QA_'+role+'_PASSWORD']);
      await page.getByRole('button',{name:'Ingresar',exact:true}).click();
      await page.locator('#jobs-section').waitFor();
      return page;
    }
    const company=await login('COMPANY');
    await company.getByText('Publicar una oportunidad',{exact:true}).click();
    await company.getByLabel('Puesto',{exact:true}).fill(title);
    await company.getByLabel('Ubicación de la oferta').fill('Remoto');
    await company.getByLabel('Descripción de la oferta').fill('Ejercicio académico con datos ficticios.');
    await company.getByRole('button',{name:'Publicar oportunidad'}).click();
    await company.getByText('Oportunidad publicada.',{exact:true}).waitFor();
    let candidate=await login('CANDIDATE');
    const card=candidate.locator('#opportunities article').filter({hasText:title});
    await card.getByText('Adjuntar una presentación').click();
    const note='Presentación QA '+randomUUID().slice(0,8);
    await card.getByLabel('Mensaje para la empresa (opcional)').fill(note);
    await card.getByRole('button',{name:'Postularme'}).click();
    await candidate.getByText('Postulación registrada.',{exact:true}).waitFor();
    assert.ok(await card.getByRole('button',{name:'Postulación enviada'}).isDisabled());
    await candidate.getByRole('button',{name:'Cerrar sesión'}).click();
    await candidate.close();
    await company.locator('#reload').click();
    const received=company.locator('#employer-inbox article').filter({hasText:note});
    await received.getByRole('button',{name:'Pasar a revisión'}).click();
    await received.getByRole('button',{name:'Aceptar',exact:true}).click();
    await received.getByText(title+' · Aceptada').waitFor();
    await company.screenshot({path:evidenceDir+'/empresa-aceptada.png',fullPage:true});
    candidate=await login('CANDIDATE');
    await candidate.getByRole('link',{name:'Mis postulaciones'}).click();
    await candidate.locator('#applications').getByText(title+' · Aceptada').waitFor();
    assert.equal(await candidate.locator('#employer-panel').isVisible(),false);
    await candidate.screenshot({path:evidenceDir+'/candidata-reingreso.png',fullPage:true});
    assert.deepEqual(browserErrors,[],'No debe haber excepciones JavaScript durante el circuito');
    const report={fecha:new Date(),modo:demo?'API simulada':'Supabase Auth de evaluación',ref:ref||null,resultado:'aprobado',oferta:title,evidencias:evidenceDir,excepcionesJavaScript:browserErrors.length,limite:'La simulación local no acredita persistencia ni RLS remotos. El bloqueo visual de duplicados no sustituye la prueba directa de base de datos.'};
    await fs.writeFile('output/qa/empresa-web-'+(demo?'local':'evaluacion')+'.json',JSON.stringify(report,null,2));
    console.log(report.modo+' · PASS publicación, postulación, revisión, aceptación y reingreso');
  } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(error=>{console.error(error.message);process.exitCode=1});
