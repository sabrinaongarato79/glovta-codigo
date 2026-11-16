const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
async function main(){
 const {createApp}=await import('../server/app.js');
 const server=createApp({env:{}}).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage();
 const report={fecha:new Date().toISOString(),entorno:'Edge local; errores de red inducidos, sin Supabase',checks:[]};
 const check=async(id,fn)=>{try{await fn();report.checks.push({id,estado:'APROBADO'});}catch(e){report.checks.push({id,estado:'FALLA',detalle:e.message});}};
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html');
  await check('WEB-REFLOW-320',async()=>{
   await page.setViewportSize({width:320,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:'output/android-evaluacion/web-320.png',fullPage:true});
  });
  await check('WEB-ZOOM-CSS-200',async()=>{
   await page.setViewportSize({width:1280,height:900});
   await page.evaluate(()=>document.body.style.zoom='2');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:'output/android-evaluacion/web-zoom-200.png',fullPage:true});
   await page.evaluate(()=>document.body.style.zoom='1');
  });
  await check('WEB-FOCO-VISIBLE',async()=>{
   await page.reload();await page.keyboard.press('Tab');
   assert.equal(await page.locator(':focus').textContent(),'Saltar al contenido');
   const style=await page.locator(':focus').evaluate(el=>({width:getComputedStyle(el).outlineWidth,style:getComputedStyle(el).outlineStyle,top:el.getBoundingClientRect().top}));
   assert.notEqual(style.style,'none');assert.ok(parseFloat(style.width)>=2);assert.ok(style.top>=0);
  });
  await check('WEB-ERROR-RED-Y-REINTENTO',async()=>{
   await page.getByLabel('Correo electrónico').fill('qa@example.invalid');
   await page.getByLabel('Contraseña',{exact:true}).fill('ficticia-solo-para-simulacion');
   await page.route('**/api/auth/login',r=>r.abort('internetdisconnected'));
   await page.getByRole('button',{name:'Ingresar',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('conexión'));
   assert.ok(await page.getByRole('button',{name:'Ingresar',exact:true}).isEnabled());
   assert.equal(await page.locator('#status').getAttribute('aria-live'),'polite');
   await page.screenshot({path:'output/android-evaluacion/web-red-inducida.png',fullPage:true});
  });
 }finally{
  report.limites='No es auditoria WCAG completa. Zoom CSS no sustituye texto del sistema. No se ejecutaron NVDA ni TalkBack. La prueba de red es simulada.';
  await fs.writeFile('output/android-evaluacion/accesibilidad-web-esencial.json',JSON.stringify(report,null,2));
  await browser.close();await new Promise(r=>server.close(r));
 }
 console.log(JSON.stringify(report));
 if(report.checks.some(c=>c.estado==='FALLA'))process.exitCode=1;
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
