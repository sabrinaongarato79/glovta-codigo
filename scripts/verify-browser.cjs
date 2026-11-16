// Run with Playwright available through NODE_PATH or installed locally.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8080';

(async () => {
  const browser = await chromium.launch({ channel: process.env.TEST_BROWSER || 'msedge', headless: true });
  const results = [];
  fs.mkdirSync('output/qa', { recursive: true });
  async function check(name, fn, options = {}) {
    const context = await browser.newContext({ serviceWorkers: 'block', ...options });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try { await fn(page, context); assert.deepEqual(errors, []); results.push({ name, passed: true }); }
    catch (error) { results.push({ name, passed: false, error: error.message }); }
    finally { await context.close(); }
    console.log(`${results.at(-1).passed ? 'PASS' : 'FAIL'} ${name}${results.at(-1).error ? ': ' + results.at(-1).error : ''}`);
  }
  async function open(page, hash = '') { await page.goto(base + '/' + hash); }
  await check('desktop loads assets, jobs and courses', async page => {
    const failures = [];
    page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) failures.push(r.url()); });
    await open(page);
    assert.equal(await page.locator('.job-card').count(), 5);
    assert.equal(await page.locator('.course-card').count(), 4);
    assert.deepEqual(failures, []);
  });
  await check('search and empty result feedback', async page => {
    await open(page, '#oportunidades');
    await page.locator('#jobQuery').fill('Business Analyst');
    await page.locator('#jobQuery').press('Enter');
    assert.equal(await page.locator('.job-card').count(), 1);
    await page.locator('#jobQuery').fill('zzzz-no-match');
    await page.locator('#jobQuery').press('Enter');
    assert.match(await page.locator('#searchStatus').innerText(), /No hubo coincidencias/);
  });
  await check('cart add, deduplicate, persist and remove', async page => {
    await open(page, '#formacion');
    await page.locator('[data-add="sql"]').click();
    assert.equal(await page.locator('#cartCount').innerText(), '1');
    await page.locator('#closeCart').click();
    await page.locator('[data-add="sql"]').click();
    assert.equal(await page.locator('#cartCount').innerText(), '1');
    await page.reload();
    await page.locator('#openCart').click();
    assert.match(await page.locator('#cartTotal').textContent(), /24.900/);
    await page.locator('[data-remove="sql"]').click();
    assert.equal(await page.locator('#cartCount').innerText(), '0');
  });
  await check('passport validates, saves and restores after reload', async page => {
    await open(page, '#personas');
    await page.locator('[data-open="passportDialog"]').first().click();
    await page.locator('#nextStep').click();
    assert.equal(await page.locator('[name="goal"]').isVisible(), true);
    await page.locator('[name="goal"]').fill('Analista QA');
    await page.locator('#nextStep').click();
    await page.locator('[name="skills"]').fill('SQL, testing');
    await page.locator('#nextStep').click();
    await page.locator('#savePassport').click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('glovta-passport')).goal), 'Analista QA');
    await page.reload();
    await page.locator('[data-open="passportDialog"]').first().click();
    assert.equal(await page.locator('[name="goal"]').inputValue(), 'Analista QA');
  });
  await check('contact reaches admin as escaped text', async page => {
    await open(page, '#contacto');
    await page.locator('#contactForm [name="name"]').fill('<img src=x onerror=alert(1)>');
    await page.locator('#contactForm [name="email"]').fill('qa@example.com');
    await page.locator('#contactForm [name="message"]').fill('Consulta de prueba');
    await page.locator('#contactForm button[type="submit"]').click();
    await page.goto(base + '/admin.html');
    assert.equal(await page.locator('#mLeads').innerText(), '1');
    assert.equal(await page.locator('#leadTable img').count(), 0);
    assert.match(await page.locator('#leadTable').innerText(), /<img/);
  });
  await check('Enter advances passport without saving an incomplete journey', async page => {
    await open(page, '#personas');
    await page.locator('[data-open="passportDialog"]').first().click();
    await page.locator('[name="goal"]').fill('QA');
    await page.locator('[name="goal"]').press('Enter');
    assert.equal(await page.evaluate(() => localStorage.getItem('glovta-passport')), null);
    assert.equal(await page.locator('#passportDialog').getAttribute('open'), '');
  });
  await check('appointment persists, blocks duplicate and rejects past date', async page => {
    await open(page, '#agenda');
    await page.locator('#nextMonth').click();
    const date = await page.locator('.calendar-day:not(.is-other):not([disabled])').first().getAttribute('data-date');
    async function fill(dateValue) {
      await page.locator('#appointmentDate').evaluate((el, value) => el.value = value, dateValue);
      await page.locator('#appointmentTime').selectOption('10:00');
      await page.locator('#appointmentForm [name="name"]').fill('QA');
      await page.locator('#appointmentForm [name="email"]').fill('qa@example.com');
      await page.locator('#appointmentForm button[type="submit"]').click();
    }
    await fill(date);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('glovta-appointments')).length), 1);
    await fill(date);
    assert.match(await page.locator('#appointmentStatus').innerText(), /ya figura reservado/);
    await fill('2000-01-01');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('glovta-appointments')).length), 1);
  });
  await check('blocked storage does not break page or falsely confirm a save', async (page, context) => {
    await context.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new DOMException('blocked', 'SecurityError'); };
      Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); };
    });
    await open(page, '#contacto');
    assert.equal(await page.locator('.course-card').count(), 4);
    await page.locator('#contactForm [name="name"]').fill('QA');
    await page.locator('#contactForm [name="email"]').fill('qa@example.com');
    await page.locator('#contactForm [name="message"]').fill('No perder este texto');
    await page.locator('#contactForm button[type="submit"]').click();
    assert.match(await page.locator('#contactStatus').innerText(), /no se pudo guardar/i);
    assert.equal(await page.locator('#contactForm [name="message"]').inputValue(), 'No perder este texto');
    await page.goto(base + '/admin.html');
    assert.equal(await page.locator('#mPassports').innerText(), '0');
  });
  await check('malformed stored data does not break home or admin', async (page, context) => {
    await context.addInitScript(() => {
      localStorage.setItem('glovta-cart', '{invalid');
      localStorage.setItem('glovta-leads', '[null,42,"bad",{}]');
      localStorage.setItem('glovta-appointments', '[null,42,"bad",{}]');
      localStorage.setItem('glovta-passport', 'null');
    });
    await open(page);
    assert.equal(await page.locator('#cartCount').innerText(), '0');
    await page.goto(base + '/admin.html');
    assert.equal(await page.locator('#mPassports').innerText(), '0');
    assert.equal(await page.locator('#mLeads').innerText(), '0');
  });
  await check('full storage preserves contact fields and existing records', async (page, context) => {
    await context.addInitScript(() => {
      Storage.prototype.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); };
    });
    await open(page, '#contacto');
    await page.locator('#contactForm [name="name"]').fill('QA');
    await page.locator('#contactForm [name="email"]').fill('qa@example.com');
    await page.locator('#contactForm [name="message"]').fill('Conservar');
    await page.locator('#contactForm button[type="submit"]').click();
    assert.match(await page.locator('#contactStatus').innerText(), /no se pudo guardar/i);
    assert.equal(await page.locator('#contactForm [name="message"]').inputValue(), 'Conservar');
    assert.equal(await page.evaluate(() => localStorage.getItem('glovta-leads')), null);
  });
  await check('mobile menu, contrast and layout', async page => {
    await open(page);
    await page.locator('#mobileMenu').click();
    await page.locator('#mainNav a[href="#agenda"]').click();
    assert.equal(await page.locator('#mobileMenu').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('#agenda details').getAttribute('open'), '');
    await page.locator('#contrastToggle').click();
    await page.reload();
    assert.equal(await page.locator('#contrastToggle').getAttribute('aria-pressed'), 'true');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.evaluate(() => {
      localStorage.setItem('glovta-leads', JSON.stringify([{ name: 'Persona de prueba', email: 'correo.largo.de.evaluacion@example.com', service: 'Automatización de procesos', status: 'nuevo' }]));
      localStorage.setItem('glovta-appointments', JSON.stringify([{ name: 'Persona de prueba', email: 'qa@example.com', date: '2030-01-01', time: '10:00', type: 'Asesoría laboral', mode: 'Google Meet', status: 'reservada' }]));
    });
    await page.goto(base + '/admin.html');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  }, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await check('service worker installs and offline home loads', async (page, context) => {
    await open(page);
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await context.setOffline(true);
    await page.reload();
    assert.equal(await page.locator('.course-card').count(), 4);
    await page.goto(base + '/admin.html');
    assert.equal(await page.locator('#mLeads').innerText(), '0');
    const cached = await page.evaluate(async () => (await Promise.all((await caches.keys()).map(async name => (await (await caches.open(name)).keys()).map(r => r.url)))).flat());
    assert.equal(cached.some(url => new URL(url).pathname.startsWith('/api')), false);
  }, { serviceWorkers: 'allow' });
  await check('screenshots and tablet layout', async page => {
    await open(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: 'output/qa/desktop.png' });
    await page.setViewportSize({ width: 768, height: 1024 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'output/qa/mobile.png' });
  });
  await browser.close();
  fs.mkdirSync('output/qa', { recursive: true });
  fs.writeFileSync(`output/qa/browser-results-${process.env.TEST_BROWSER || 'msedge'}.json`, JSON.stringify({ date: new Date().toISOString(), browser: process.env.TEST_BROWSER || 'msedge', results }, null, 2));
  process.exitCode = results.some(r => !r.passed) ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
