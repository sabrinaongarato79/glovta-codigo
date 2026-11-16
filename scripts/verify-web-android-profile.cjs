const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const {parseEnv}=require('node:util');
const dir='output/android-evaluacion';
const checkpoint=dir+'/perfil-web-checkpoint.json';
const headline='Validacion web Android QA';

async function main(){
  const env=parseEnv(await fs.readFile('.env.qa','utf8'));
  assert.equal(env.SUPABASE_URL,'https://yecgzorcxkokanuxgwki.supabase.co');
  assert.equal(env.QA_STAGE_REF,'yecgzorcxkokanuxgwki');
  assert.ok(process.env.QA_CANDIDATE_PASSWORD,'Ingresar la clave QA mediante el entorno local.');
  const {createApp}=await import('../server/app.js');
  const server=createApp({env:{...env,GLOVTA_EMPLOYER_ENABLED:'true'}}).listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  let browser;
  const report={fecha:new Date().toISOString(),ref:env.QA_STAGE_REF,modo:'Edge local con Supabase QA real',checks:[]};
  const pass=(id,details)=>report.checks.push({id,estado:'APROBADO',details});
  try{
    browser=await chromium.launch({channel:'msedge',headless:true});
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html');
    await page.keyboard.press('Tab');
    assert.match(await page.locator(':focus').textContent(),/Saltar al contenido/);
    await page.keyboard.press('Enter');
    const email=page.getByLabel('Correo electrónico');
    for(let i=0;i<20&&!await email.evaluate(el=>el===document.activeElement);i++)await page.keyboard.press('Tab');
    assert.ok(await email.evaluate(el=>el===document.activeElement));
    await page.keyboard.type('candidata.qa@example.com');
    await page.keyboard.press('Tab');
    assert.ok(await page.getByLabel('Contraseña',{exact:true}).evaluate(el=>el===document.activeElement));
    await page.keyboard.type(process.env.QA_CANDIDATE_PASSWORD);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('id'),'toggle-password');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(),'Ingresar');
    await page.keyboard.press('Enter');
    await page.locator('#workspace').waitFor({state:'visible',timeout:20000});
    await page.waitForFunction(()=>document.querySelector('#profile [name="full_name"]').value==='Cuenta de prueba RLS B');
    pass('WEB-TECLADO-01','Salto de contenido, foco por Tab e inicio de sesion con teclado.');
    assert.equal(await page.locator('#status').getAttribute('role'),'status');
    assert.equal(await page.locator('#status').getAttribute('aria-live'),'polite');
    pass('WEB-MENSAJES-01','Region de estado expuesta en DOM; anuncio con lector NO PROBADO.');
    await page.locator('.section-nav').getByRole('link',{name:'Mi perfil',exact:true}).click();
    const field=page.getByLabel('Titular profesional');
    if(process.argv.includes('--restore')){
      const old=JSON.parse(await fs.readFile(checkpoint,'utf8'));
      assert.equal(old.email,'candidata.qa@example.com');
      // Do not overwrite an intervening edit by the user.
      assert.equal(await field.inputValue(),headline,'El titular cambio desde la prueba; revisar antes de restaurar.');
      await field.fill(old.headline);
    }else{
      try{
        const old=JSON.parse(await fs.readFile(checkpoint,'utf8'));
        assert.equal(old.email,'candidata.qa@example.com');
        assert.equal(await field.inputValue(),old.headline,'Checkpoint existente con cambios pendientes; restaurar primero.');
      }catch(e){
        if(e.code!=='ENOENT')throw e;
        await fs.writeFile(checkpoint,JSON.stringify({email:'candidata.qa@example.com',headline:await field.inputValue()},null,2));
      }
      await field.fill(headline);
    }
    const saved=page.waitForResponse(r=>r.url().endsWith('/api/profile')&&r.request().method()==='PUT');
    await page.getByRole('button',{name:'Guardar perfil',exact:true}).click();
    const response=await saved;
    assert.equal(response.status(),200);
    const expected=process.argv.includes('--restore')?JSON.parse(await fs.readFile(checkpoint,'utf8')).headline:headline;
    assert.equal((await response.json()).headline,expected,'El servidor debe devolver el titular guardado.');
    pass('WEB-PERFIL-01',process.argv.includes('--restore')?'Titular original restaurado desde UI web.':'Titular ficticio guardado desde UI web.');
    await page.screenshot({path:dir+(process.argv.includes('--restore')?'/web-restaurado.png':'/web-titular-qa.png'),fullPage:true});
    report.android='NO PROBADO por este script; requiere lectura en telefono.';
    report.lectorDePantalla='NO PROBADO';
    report.estado='APROBADO';
  }catch(error){report.estado='FALLA';report.error=String(error.message).replaceAll(process.env.QA_CANDIDATE_PASSWORD,'[OCULTO]');process.exitCode=1;}
  finally{
    await fs.writeFile(dir+(process.argv.includes('--restore')?'/web-android-restauracion.json':'/web-android-guardado.json'),JSON.stringify(report,null,2));
    if(browser)await browser.close();
    await new Promise(r=>server.close(r));
  }
  console.log(JSON.stringify(report));
}
main().catch(()=>{console.error('Prueba no iniciada. Revisar configuracion local y dependencia Playwright.');process.exitCode=1;});
