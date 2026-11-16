const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const { createApp } = await import('../server/app.js');
 const server = createApp({env:{}}).listen(0,'127.0.0.1');
 await new Promise(resolve => server.once('listening',resolve));
 const browser = await chromium.launch({channel:'msedge',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html');
  await page.getByLabel('Correo electrónico').fill('qa@example.com');
  await page.getByLabel('Contraseña',{exact:true}).fill('test-password');
  await page.getByRole('button',{name:'Ingresar',exact:true}).click();
  await page.getByRole('status').filter({hasText:'Supabase todavía no está configurado.'}).waitFor();
  assert.equal(await page.getByLabel('Contraseña',{exact:true}).inputValue(),'');
  const statusBox = await page.getByRole('status').boundingBox();
  assert.ok(statusBox.y >= 0 && statusBox.y + statusBox.height <= 844, 'El error debe quedar dentro de la pantalla');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:'output/qa/portal-mobile.png',fullPage:true});
  console.log('PASS: configuración ausente, contraseña borrada, layout móvil sin desborde');
 } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);process.exitCode=1});

