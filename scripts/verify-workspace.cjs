const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');

async function verify() {
  const { createApp } = await import('../server/app.js');
  const server = createApp({env:{}}).listen(0,'127.0.0.1');
  await new Promise(resolve => server.once('listening',resolve));
  const browser = await chromium.launch({channel:'msedge'});
  const reports = [];
  const longPassport = process.argv.includes('--passport-extenso');
  try {
    for (const width of longPassport ? [1280] : [390,768,1280]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      const failures = [];
      const applications = [];
      let profile = {full_name:'Perfil QA',headline:'Analista',bio:'Trayectoria de prueba',location:'Córdoba'};
      page.on('console', msg => { if (msg.type() === 'error') failures.push(msg.text()); });
      page.on('pageerror', err => failures.push(err.message));
      await page.route('**/api/**', async route => {
        const req = route.request();
        const path = new URL(req.url()).pathname;
        let body = [];
        if (longPassport && path.endsWith('/profile-sections/experiences')) {
          body = Array.from({length:32}, (_,index)=>({
            id:String(index+1), position:'Proyecto QA '+String(index+1).padStart(2,'0'),
            organization:'Laboratorio de tesis', experience_type:'academic',
            achievements:'Diseño, ejecución y documentación de pruebas de integración.'
          }));
        }
        if (path.endsWith('/login')) body = {access_token:'qa',refresh_token:'qa'};
        if (path.endsWith('/profile')) {
          if (req.method() === 'PUT') profile = req.postDataJSON();
          body = profile;
        }
        if (path.endsWith('/opportunities')) body = [{id:'qa-job',title:'Analista QA',company_name:'Empresa de prueba',location:'Remoto',description:'Validación de software.'}];
        if (path.endsWith('/applications')) {
          if (req.method() === 'POST') applications.push({...req.postDataJSON(),status:'submitted'});
          body = applications;
        }
        await route.fulfill({json:body});
      });
      await page.goto('http://127.0.0.1:'+server.address().port+'/portal.html');
      await page.getByLabel('Correo electrónico').fill('qa@example.com');
      await page.getByLabel('Contraseña',{exact:true}).fill('qa-password');
      await page.getByRole('button',{name:'Ingresar',exact:true}).click();
      await page.getByText('Datos actualizados.',{exact:true}).waitFor();
      if (process.env.AXE_SCRIPT) await page.addScriptTag({path:process.env.AXE_SCRIPT});
      const inspected = [];
      async function inspect(view) {
        assert.equal(await page.locator('nav.section-nav [aria-current="page"]').count(),1);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        if (process.env.AXE_SCRIPT) {
          const issues = await page.evaluate(async () => (await axe.run(document,{
            runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}
          })).violations.map(v=>({rule:v.id,targets:v.nodes.map(n=>n.target)})));
          assert.deepEqual(issues,[],view+' '+width+'px: '+JSON.stringify(issues));
        }
        inspected.push(view);
      }
      await inspect('Mi espacio');
      await page.getByRole('link',{name:'Mi perfil',exact:true}).click();
      await page.getByRole('link',{name:'Preferencias',exact:true}).click();
      await page.getByLabel('Objetivo laboral').fill('Diseñar pruebas accesibles');
      await page.getByRole('button',{name:'Guardar perfil'}).click();
      await page.getByText('Perfil guardado en el servicio.').waitFor();
      assert.equal(profile.full_name,'Perfil QA');
      await inspect('Preferencias');
      await page.getByRole('link',{name:'Career Passport',exact:true}).click();
      await page.locator('#goal-value').getByText('Diseñar pruebas accesibles').waitFor();
      await inspect('Passport');
      if(width===1280) {
        if (longPassport) {
          await page.locator('#passport-sections').getByText('Proyecto QA 32',{exact:false}).first().waitFor();
          await page.pdf({path:'output/qa/passport-extenso.pdf',format:'A4'});
          console.log('PDF exportado con 32 proyectos de prueba');
          return;
        }
        await page.pdf({path:'output/qa/passport-prueba.pdf',format:'A4'});
      }
      await page.getByRole('link',{name:'Oportunidades',exact:true}).click();
      const search = page.getByRole('searchbox');
      await search.fill('sin coincidencias');
      await page.locator('#search-empty').waitFor();
      await search.fill('remoto');
      await page.getByRole('button',{name:'Postularme'}).click();
      await page.getByText('Postulación registrada.').waitFor();
      assert.equal(applications.length,1);
      assert.ok(await page.getByRole('button',{name:'Postulación enviada'}).isDisabled());
      await inspect('Oportunidades');
      await page.getByRole('link',{name:'Mis postulaciones'}).click();
      await page.getByText('Analista QA · Enviada').waitFor();
      await inspect('Mis postulaciones');
      await page.goBack();
      await search.waitFor();
      assert.equal(await search.inputValue(),'remoto');
      assert.deepEqual(failures,[]);
      reports.push({width,inspected,consoleErrors:failures,axe:Boolean(process.env.AXE_SCRIPT)});
      await page.close();
      console.log('PASS recorrido completo '+width+'px');
    }
    await fs.writeFile('output/qa/espacio-profesional.json',JSON.stringify({api:'simulada',reports},null,2));
  } finally {
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
verify().catch(error=>{console.error(error);process.exitCode=1});
