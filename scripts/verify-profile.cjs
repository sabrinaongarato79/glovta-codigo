const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const {createApp}=await import('../server/app.js');
 const server=createApp({env:{}}).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
 for(const width of [390,1280]){
 const page=await browser.newPage({viewport:{width,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/**',route=>{
 const path=new URL(route.request().url()).pathname;
 const body=path.endsWith('/login')?{access_token:'test',refresh_token:'test'}:path.endsWith('/profile')?{full_name:'Perfil de prueba',headline:'Analista de sistemas',location:'Buenos Aires',bio:'Desarrollo soluciones digitales con foco en las personas.'}:[];
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html');
 await page.getByLabel('Correo electrónico').fill('test@example.com');
 await page.getByLabel('Contraseña',{exact:true}).fill('test-password');
 await page.getByRole('button',{name:'Ingresar',exact:true}).click();
 await page.getByText('Datos actualizados.',{exact:true}).waitFor();
 assert.equal(await page.locator('#completion').getAttribute('value'),'100');
 await page.locator('.section-nav a[href="#profile"]').click();await page.getByLabel('Ubicación general').fill('');
 assert.equal(await page.locator('#completion').getAttribute('value'),'100');
 await page.getByLabel('Ubicación general').fill('Buenos Aires');
 await page.getByRole('button',{name:'Guardar perfil',exact:true}).click();
 await page.getByText('Perfil guardado en el servicio.',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'output/qa/profile-'+width+'.png',fullPage:true});
 await page.close();
 console.log('PASS perfil '+width+'px, progreso basado en datos guardados, guardado simulado, sin errores JS');
 }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
