const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const context = await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  const page = await context.newPage();
  const results=[];
  page.setDefaultTimeout(10000);
  async function check(name,fn){try{await fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:e.message});}console.log(JSON.stringify(results.at(-1)));}
  await page.goto('http://127.0.0.1:8080');
  await check('Cart has accessible name, keyboard containment, Escape and focus return',async()=>{
    await page.locator('#openCart').click();
    assert.equal(await page.getByRole('dialog',{name:'Tu selección'}).isVisible(),true);
    assert.equal(await page.locator('#checkoutDemo').isDisabled(),true);
    for(let i=0;i<5;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('#cart')),true);}
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'openCart');
  });
  await check('Empty search has no unrelated jobs and can reset',async()=>{
    await page.goto('http://127.0.0.1:8080/#oportunidades');
    await page.locator('#jobQuery').fill('zzzz');await page.locator('#jobQuery').press('Enter');
    assert.equal(await page.locator('.job-card').count(),0);
    await page.locator('[data-reset-search]').click();assert.equal(await page.locator('.job-card').count(),5);
  });
  await check('Profile steps move focus and retain success feedback',async()=>{
    await page.goto('http://127.0.0.1:8080/#personas');
    await page.locator('[data-open="passportDialog"]').first().click();
    assert.equal(await page.getByRole('dialog',{name:'Tu perfil profesional.'}).isVisible(),true);
    await page.locator('[name="goal"]').fill('Analista');await page.locator('#nextStep').click();
    assert.equal(await page.evaluate(()=>document.activeElement.name),'skills');
    await page.locator('#nextStep').click();await page.locator('#savePassport').click();
    assert.match(await page.locator('#passportStatus').textContent(),/Perfil guardado/);
    await page.waitForTimeout(800);assert.equal(await page.locator('#passportDialog').isVisible(),true);
    await page.keyboard.press('Escape');
  });
  await check('Expanded layout fits 320px and desktop text at 200 percent',async()=>{
    for(const [width,scale] of [[320,1],[1440,2]]){
      await page.setViewportSize({width,height:900});
      await page.evaluate(s=>{document.documentElement.style.setProperty('--font-scale',s);document.querySelectorAll('details').forEach(d=>d.open=true);},String(scale));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}px / ${scale}`);
    }
  });
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{document.documentElement.style.setProperty('--font-scale','1');document.activeElement.blur();window.scrollTo(0,0);});
  await page.screenshot({path:'output/qa/ux-expanded.png',fullPage:true});
  fs.writeFileSync('output/qa/ux-results.json',JSON.stringify({date:new Date().toISOString(),results},null,2));
  await browser.close();if(results.some(r=>!r.passed))process.exitCode=1;
})();
