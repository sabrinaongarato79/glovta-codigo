const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const {chromium} = require('playwright');

async function verify() {
  const {createApp} = await import('../server/app.js');
  const server = createApp({env:{}}).listen(0,'127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  let browser;
  try {
    browser = await chromium.launch({channel:'msedge'});
    const page = await browser.newPage({viewport:{width:390,height:844}});
    await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(),'Saltar al contenido');
    await page.keyboard.press('Enter');
    const email = page.getByLabel('Correo electrónico');
    await email.focus();
    await page.keyboard.type('qa@example.invalid');
    await page.keyboard.press('Tab');
    await page.keyboard.type('clave-ficticia');
    const submit = page.getByRole('button',{name:'Ingresar',exact:true});
    await page.route('**/api/auth/login',route => route.abort('internetdisconnected'));
    await submit.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('#status').textContent && !document.querySelector('#login button[type=submit]').disabled);
    const message = await page.locator('#status').textContent();
    const correct = message.includes('conexión');
    await page.screenshot({path:'output/qa/acceso-red-'+(correct?'despues':'antes')+'.png'});
    assert.ok(correct,message);
    assert.equal(await email.inputValue(),'qa@example.invalid');
    assert.ok(await submit.isEnabled());
    const navigation = await page.evaluate(()=>performance.getEntriesByType('navigation')[0].duration);
    await fs.writeFile('output/qa/acceso-red.json',JSON.stringify({fecha:new Date(),escenario:'Edge local, fallo de red inducido',ancho:390,mensaje:message,cargaLocalMs:navigation,correoConservado:true,reintentoDisponible:true},null,2));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
verify().catch(error=>{console.error(error.message);process.exitCode=1;});
