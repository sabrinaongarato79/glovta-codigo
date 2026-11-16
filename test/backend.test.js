import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';

async function run(options, callback) {
  const server = createApp(options).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try { await callback(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
test('local health works and unavailable Supabase returns 503', async () => {
  await run({ env: {} }, async base => {
    assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { status: 'ok', supabaseConfigured: false });
    assert.equal((await fetch(`${base}/api/opportunities`)).status, 503);
    assert.equal((await fetch(base)).status, 200);
    for (const file of ['.env', 'server/app.js', 'supabase/migrations/202609300001_mvp_core.sql']) assert.equal((await fetch(`${base}/${file}`)).status, 404);
  });
});
const env = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'test-key' };
test('profile rejects inherited property names and malformed request bodies', async () => {
  await run({ env, clientFactory: () => ({ auth: { getUser: async () => ({ data: { user: { id: 'verified-user' } } }) }, from: () => { throw new Error('Database must not be called'); } }) }, async base => {
    for (const body of [{ full_name: 'Test', constructor: 'bad' }, { full_name: 'Test', toString: 'bad' }, [], 'invalid']) {
      const response = await fetch(`${base}/api/profile`, { method: 'PUT', headers: { Authorization: 'Bearer token', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      assert.equal(response.status, 400);
    }
  });
});
test('private routes reject absent and invalid sessions', async () => {
  await run({ env, clientFactory: () => ({ auth: { getUser: async () => ({ error: {}, data: {} }) } }) }, async base => {
    assert.equal((await fetch(`${base}/api/profile`)).status, 401);
    assert.equal((await fetch(`${base}/api/profile`, { headers: { Authorization: 'Bearer invalid' } })).status, 401);
  });
});
test('postulations use verified identity and pass bearer token to database', async () => {
  let inserted, options;
  await run({ env, clientFactory: (_url, _key, opts) => {
    options = opts;
    return { auth: { getUser: async () => ({ data: { user: { id: 'verified-user' } } }) }, from: () => ({ insert: row => {
      inserted = row;
      return { select: () => ({ single: async () => ({ data: row }) }) };
    } }) };
  } }, async base => {
    const body = { opportunity_id: '12345678-1234-1234-1234-123456789abc', cover_note: 'Hola' };
    const post = data => fetch(`${base}/api/applications`, { method: 'POST', headers: { Authorization: 'Bearer verified-token', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    assert.equal((await post({ ...body, candidate_id: 'other-user' })).status, 400);
    assert.equal((await post({ ...body, status: 'accepted' })).status, 400);
    assert.equal((await post(body)).status, 201);
    assert.equal(inserted.candidate_id, 'verified-user');
    assert.equal(options.global.headers.Authorization, 'Bearer verified-token');
  });
});
test('database duplicate and permission errors are handled without leaking details', async () => {
  for (const [code, expected] of [['23505', 409], ['42501', 403], ['unexpected', 502]]) {
    await run({ env, clientFactory: () => ({ from: () => ({ select: () => ({ eq: () => ({ order: () => ({ limit: async () => ({ error: { code, message: 'secret internal detail' } }) }) }) }) }) }) }, async base => {
      const response = await fetch(`${base}/api/opportunities`);
      assert.equal(response.status, expected);
      assert.equal((await response.text()).includes('secret internal detail'), false);
    });
  }
});

test('API rejects malformed JSON and oversized bodies without exposing parser details', async () => {
  await run({ env: {} }, async base => {
    for (const [body, status] of [['{"broken":', 400], [JSON.stringify({ bio: 'x'.repeat(17000) }), 413]]) {
      const response = await fetch(`${base}/api/profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
      assert.equal(response.status, status);
      assert.equal((await response.text()).includes('SyntaxError'), false);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
  });
});

test('profile updates cannot change owner and enforce field boundaries', async () => {
  const calls = [];
  const clientFactory = () => ({
    auth: { getUser: async () => ({ data: { user: { id: 'owner' } } }) },
    from: () => ({
      select: () => ({ eq: (key, value) => { calls.push({ key, value }); return { maybeSingle: async () => ({ data: { id: 'owner' } }) }; } }),
      update: fields => ({ eq: (key, value) => { calls.push({ fields, key, value }); return { select: () => ({ single: async () => ({ data: { id: value, ...fields } }) }) }; } })
    })
  });
  await run({ env, clientFactory }, async base => {
    const put = body => fetch(`${base}/api/profile`, { method: 'PUT', headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    for (const body of [{ full_name: ' ' }, { full_name: 'x'.repeat(151) }, { full_name: 'QA', bio: 'x'.repeat(3001) }, { full_name: 'QA', id: 'other' }]) assert.equal((await put(body)).status, 400);
    assert.equal(calls.length, 0);
    const response = await put({ full_name: ' QA ', bio: 'x'.repeat(3000) });
    assert.equal(response.status, 200);
    const saved = await response.json();
    assert.equal(saved.full_name, 'QA');
    assert.equal(saved.id, 'owner');
    assert.equal(calls[1].value, 'owner');
    assert.equal(Object.hasOwn(calls[1].fields, 'id'), false);
  });
});

test('invalid applications never reach the database', async () => {
  await run({ env, clientFactory: () => ({ auth: { getUser: async () => ({ data: { user: { id: 'owner' } } }) }, from: () => { throw new Error('Must not access DB'); } }) }, async base => {
    const valid = '12345678-1234-1234-1234-123456789abc';
    for (const body of [{}, [], { opportunity_id: 'bad' }, { opportunity_id: valid, cover_note: 123 }, { opportunity_id: valid, cover_note: 'x'.repeat(3001) }]) {
      const response = await fetch(`${base}/api/applications`, { method: 'POST', headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      assert.equal(response.status, 400);
    }
  });
});
test('login validates inputs and never returns provider internals', async () => {
  let calls = 0;
  await run({ env, clientFactory: () => ({ auth: { signInWithPassword: async () => { calls++; return { error: { status: 400, code: 'invalid_credentials', message: 'private detail' } }; } } }) }, async base => {
    const post = body => fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal((await post({ email: 'bad', password: 'abc' })).status, 400);
    assert.equal(calls, 0);
    const result = await post({ email: 'qa@example.com', password: 'wrong' });
    assert.equal(result.status, 401);
    assert.equal((await result.text()).includes('private detail'), false);
  });
});
test('login and refresh return only session contract', async () => {
  const session = { access_token: 'access', refresh_token: 'refresh', expires_in: 3600, provider_token: 'private' };
  await run({ env, clientFactory: () => ({ auth: {
    signInWithPassword: async () => ({ data: { session } }),
    refreshSession: async ({ refresh_token }) => {
      assert.equal(refresh_token, 'refresh');
      return { data: { session } };
    }
  } }) }, async base => {
    for (const [path, body] of [['login', { email: 'qa@example.com', password: 'password' }], ['refresh', { refresh_token: 'refresh' }]]) {
      const result = await fetch(base + '/api/auth/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      assert.equal(result.status, 200);
      assert.deepEqual(await result.json(), { access_token: 'access', refresh_token: 'refresh', expires_in: 3600 });
      assert.equal(result.headers.get('cache-control'), 'no-store');
    }
  });
});
test('portal files are served and missing auth configuration fails explicitly', async () => {
  await run({ env: {} }, async base => {
    for (const path of ['/portal.html', '/portal.js', '/portal.css']) assert.equal((await fetch(base + path)).status, 200);
    assert.equal((await fetch(base + '/api/auth/login', { method: 'POST' })).status, 503);
  });
});

test('password update requires a verified session and rejects invalid inputs', async () => {
  let updates = 0;
  const clientFactory = () => ({ auth: {
    setSession: async ({access_token}) => access_token === 'valid' ? { data: {user:{id:'owner'}} } : {error:{}},
    updateUser: async () => { updates++; return {data:{user:{id:'owner'}}}; }
  }});
  await run({env,clientFactory}, async base => {
    const post = body => fetch(base+'/api/auth/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    assert.equal((await post({})).status,400);
    assert.equal((await post({access_token:'invalid',refresh_token:'refresh',password:'A-new-long-password'})).status,401);
    assert.equal(updates,0);
    assert.equal((await post({access_token:'valid',refresh_token:'refresh',password:'A-new-long-password'})).status,200);
    assert.equal(updates,1);
  });
});
test('preferences validate enums and preserve omitted fields for old clients', async () => {
  let saved;
  const clientFactory = () => ({
    auth: {getUser:async()=>({data:{user:{id:'owner'}}})},
    from:()=>({
      select:()=>({eq:()=>({maybeSingle:async()=>({data:{id:'owner'}})})}),
      update:fields=>{saved=fields;return {eq:()=>({select:()=>({single:async()=>({data:{id:'owner',...fields}})})})};}
    })
  });
  await run({env,clientFactory},async base=>{
    const put=body=>fetch(base+'/api/profile',{method:'PUT',headers:{Authorization:'Bearer valid','Content-Type':'application/json'},body:JSON.stringify(body)});
    for(const fields of [{work_mode:'admin'},{work_schedule:'always'},{career_goal:'x'.repeat(1001)},{sectors:[]}]){
      assert.equal((await put({full_name:'QA',...fields})).status,400);
    }
    assert.equal((await put({full_name:'QA',career_goal:' Mi objetivo ',work_mode:'remote',work_schedule:'part_time'})).status,200);
    assert.equal(saved.career_goal,'Mi objetivo');
    assert.equal(saved.work_mode,'remote');
    assert.equal((await put({full_name:'QA'})).status,200);
    assert.equal(Object.hasOwn(saved,'work_mode'),false);
  });
});
test('registration validates passwords, ignores supplied roles and keeps existing accounts private', async () => {
  let sent;
  const clientFactory = () => ({auth:{signUp:async input => {
    sent = input;
    return {error:{code:'user_already_exists'}};
  }}});
  await run({env,clientFactory},async base => {
    const post = body => fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    assert.equal((await post({email:'a@example.com',password:'short'})).status,400);
    assert.equal(sent,undefined);
    const result = await post({email:' a@example.com ',password:'test-only-12345',role:'admin'});
    assert.equal(result.status,202);
    assert.deepEqual(sent,{email:'a@example.com',password:'test-only-12345'});
    assert.deepEqual(Object.keys(await result.json()),['message']);
  });
});
