const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const {createApp}=await import('../server/app.js');
 const server=createApp({env:{}}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{for(const width of [390,768,1280]){
 const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const rows={experiences:[],education:[],languages:[],skills:[]};let number=0;let failSkills=false;
 await page.route('**/api/**',async route=>{
  const req=route.request(),path=new URL(req.url()).pathname,method=req.method();let body=[];
  if(path.endsWith('/login'))body={access_token:'test',refresh_token:'test'};
  else if(path.endsWith('/profile'))body={full_name:'Lucía Ferrer',headline:'Análisis de sistemas y procesos',location:'Buenos Aires, Argentina',bio:'Transformo entrevistas con usuarios en requisitos que el equipo puede implementar y probar. En mi último proyecto diseñé el circuito de seguimiento de postulaciones.'};
  else if(path.includes('/profile-sections/')){
   // Parse explicit route segments, independent of URL host.
   const parts=path.split('/');const key=parts[3],record=parts[4];
   if(key==='skills' && method==='GET' && failSkills){failSkills=false;return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Fallo temporal QA'})})}
   if(method==='POST'){body={...req.postDataJSON(),id:String(++number)};rows[key].push(body)}
   else if(method==='PUT'){body={...req.postDataJSON(),id:record};rows[key]=rows[key].map(r=>r.id===record?body:r)}
   else if(method==='DELETE'){rows[key]=rows[key].filter(r=>r.id!==record);body={id:record}}
   else body=rows[key];
  }
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
 });
 const login=async(expected='Datos actualizados.')=>{await page.getByLabel('Correo electrónico').fill('qa@example.com');await page.getByLabel('Contraseña',{exact:true}).fill('qa-password');await page.getByRole('button',{name:'Ingresar',exact:true}).click();await page.getByText(expected,{exact:true}).waitFor()};
 await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html');
 assert.equal(await page.locator('#profile-heading').isVisible(),false);assert.equal(await page.getByLabel('Correo electrónico').inputValue(),'');await login();
 const navigate=async hash=>{await page.evaluate(h=>{location.hash=h},hash);await page.waitForFunction(h=>!document.getElementById(h).hidden,hash)};
 assert.equal(await page.locator('#overview').isVisible(),true);
 assert.equal(await page.locator('#passport').isVisible(),false);
 assert.equal(await page.locator('#total-progress').getAttribute('value'),'4');
 await page.locator('.section-nav a[href="#profile"]').focus();await page.keyboard.press('Enter');await page.locator('#profile').waitFor();
 const cases=[['experiences','Puesto o proyecto','Seguimiento de postulaciones','Empresa u organización','Equipo de proyecto académico'],['education','Título o curso','Análisis de Sistemas','Institución','Escuela Da Vinci'],['languages','Idioma','Inglés'],['skills','Habilidad','Modelado de datos']];
 for(const [key,label,value,other,otherValue]of cases){
  await navigate('section-'+key);const panel=page.locator('#section-'+key);await panel.locator('summary').click();await panel.getByLabel(label,{exact:true}).fill(value);if(other)await panel.getByLabel(other,{exact:true}).fill(otherValue);
  await panel.getByRole('button',{name:'Guardar registro'}).click();await page.getByText('Información profesional guardada.',{exact:true}).waitFor();
  assert.equal(await page.locator('#passport-'+key).getByText(new RegExp(value)).count(),1);
  await panel.getByRole('button',{name:'Editar',exact:true}).click();await panel.getByLabel(label,{exact:true}).fill(value+' editada');await panel.getByRole('button',{name:'Guardar registro'}).click();await page.getByText('Información profesional guardada.',{exact:true}).waitFor();
  assert.equal(rows[key][0][Object.keys(rows[key][0])[0]],value+' editada');
 }
 // Saving another section must preserve an unfinished experience.
 await navigate('section-experiences');await page.locator('#section-experiences summary').click();await page.locator('#section-experiences').getByLabel('Puesto o proyecto').fill('Borrador sin guardar');
 await navigate('section-skills');await page.locator('#section-skills').getByRole('button',{name:'Editar',exact:true}).click();await page.locator('#section-skills').getByRole('button',{name:'Guardar registro'}).click();await page.getByText('Información profesional guardada.',{exact:true}).waitFor();
 assert.equal(await page.locator('#section-experiences').getByLabel('Puesto o proyecto').inputValue(),'Borrador sin guardar');
 await page.screenshot({path:'output/qa/sections-filled-'+width+'.png',fullPage:true});
 await page.getByRole('button',{name:'Cerrar sesión'}).click();assert.equal(await page.locator('#passport-sections').textContent(),'');await login();
 for(const [key] of cases)assert.match(await page.locator('#passport-'+key).textContent(),/editada/);
 for(const [key,label,value] of cases){
  await navigate('section-'+key);const panel=page.locator('#section-'+key);await panel.getByRole('button',{name:'Editar',exact:true}).click();await panel.getByLabel(label,{exact:true}).fill(value);
  if(key==='experiences')await panel.locator('[name="experience_type"]').selectOption('academic');
  if(key==='languages')await panel.locator('[name="proficiency"]').selectOption('advanced');
  await panel.getByRole('button',{name:'Guardar registro'}).click();await page.getByText('Información profesional guardada.',{exact:true}).waitFor();
 }
 await navigate('passport');const passport=page.locator('#passport');
 assert.equal(await page.locator('#completion').getAttribute('value'),'100');
 assert.equal(await page.locator('#total-progress').getAttribute('value'),'7');
 assert.equal(await passport.locator('.skill-chip').textContent(),'Modelado de datos');
 assert.equal(await page.locator('#professional-sections').isVisible(),false);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await passport.screenshot({path:'output/qa/career-passport-'+width+'.png',animations:'disabled'});
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('#profile').isVisible(),false);assert.equal(await passport.isVisible(),true);
 await page.emulateMedia({media:'screen'});
 page.on('dialog',dialog=>dialog.accept());
 for(const [key] of cases){await navigate('section-'+key);await page.locator('#section-'+key).getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByText('Registro eliminado.',{exact:true}).waitFor();assert.equal(rows[key].length,0)}
 await page.getByRole('button',{name:'Cerrar sesión'}).click();failSkills=true;await login('Algunas secciones no pudieron cargarse. Usá Reintentar en la sección correspondiente.');
 assert.equal(await page.locator('#section-experiences summary').count(),1);
 await navigate('section-skills');await page.locator('#section-skills').getByRole('button',{name:'Reintentar'}).click();await page.getByText('Sección actualizada.',{exact:true}).waitFor();
 assert.equal(await page.locator('#section-skills summary').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
 await page.screenshot({path:'output/qa/sections-'+width+'.png',fullPage:true});await page.close();console.log('PASS '+width+'px: CRUD 4 módulos, reingreso, passport, borradores, logout. API simulada.');
 }}finally{await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
