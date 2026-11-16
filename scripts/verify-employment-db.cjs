// Dependencies for QA only: embedded-postgres and pg, available through NODE_PATH.
const assert = require('node:assert/strict');
const {randomUUID,randomBytes} = require('node:crypto');
const {readFile,writeFile,mkdtemp} = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {Client} = require('pg');

async function verify() {
  const {default: EmbeddedPostgres} = await import(pathToFileURL(require.resolve('embedded-postgres')).href);
  const dir = await mkdtemp(path.join(os.tmpdir(),'glovta-employment-'));
  const port = 24000 + Math.floor(Math.random()*12000);
  const password = () => randomBytes(24).toString('hex');
  const db = new EmbeddedPostgres({databaseDir:dir,port,password:password(),authMethod:'scram-sha-256',persistent:true,onLog:()=>{}});
  const clients = [];
  const checks = [];
  async function connect(account) {
    const client = new Client({host:'127.0.0.1',database:'postgres',port,...account});
    await client.connect();
    clients.push(client);
    return client;
  }
  await db.initialise();
  await db.start();
  try {
    const admin = db.getPgClient();
    await admin.connect();
    clients.push(admin);
    await admin.query(`create role authenticated; create role anon; create schema auth;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select session_user::text::uuid $$;
      grant usage on schema auth to authenticated;`);
    for(const file of ['202609300001_mvp_core','202611050001_professional_profile','202611060001_employer_workflow']) {
      await admin.query(await readFile('supabase/migrations/'+file+'.sql','utf8'));
    }
    const accounts = [];
    for (const name of ['Empresa QA','Candidata QA','Otra empresa QA','Segundo candidato QA']) {
      const account = {user:randomUUID(),password:password()};
      accounts.push(account);
      // Both SQL literals are generated locally from fixed UUID / hex alphabets.
      await admin.query('create role "'+account.user+'" login password \''+account.password+'\' in role authenticated');
      await admin.query('insert into auth.users values ($1)',[account.user]);
      if(['Empresa QA','Otra empresa QA'].includes(name)) await admin.query('insert into employer_accounts values ($1,$2)',[account.user,name]);
    }
    const employer = await connect(accounts[0]);
    const candidate = await connect(accounts[1]);
    const outsider = await connect(accounts[2]);
    const publish = "insert into opportunities(employer_id,company_name,title,description,status) values(auth.uid(),$1,'Analista de procesos · Demo Glovta','Evaluación académica con datos sintéticos','published') returning id";
    const offer = (await employer.query(publish,['Empresa QA'])).rows[0].id;
    checks.push('La empresa habilitada publica su oferta');
    await assert.rejects(candidate.query(publish,['Empresa QA']),{code:'42501'});
    await assert.rejects(outsider.query(publish,['Empresa QA']),{code:'42501'});
    checks.push('Publicación denegada a candidato y empresa que suplanta a otra');
    assert.equal((await candidate.query('select title from opportunities where id=$1',[offer])).rowCount,1);
    await candidate.query("insert into profiles(id,full_name) values(auth.uid(),'Candidata QA')");
    const submit = 'insert into applications(candidate_id,opportunity_id) values(auth.uid(),$1) returning id,status';
    const application = (await candidate.query(submit,[offer])).rows[0];
    assert.equal(application.status,'submitted');
    await assert.rejects(candidate.query(submit,[offer]),{code:'23505'});
    checks.push('La candidata encuentra la oferta, se postula una vez y el duplicado se rechaza');
    await candidate.end(); clients.splice(clients.indexOf(candidate),1);
    const again = await connect(accounts[1]);
    const lookup = 'select status from applications where id=$1';
    assert.equal((await again.query(lookup,[application.id])).rows[0].status,'submitted');
    checks.push('Una nueva conexión autenticada recupera la postulación');
    const change = 'update applications set status=$1 where id=$2 returning status';
    assert.equal((await outsider.query(lookup,[application.id])).rowCount,0);
    assert.equal((await outsider.query(change,['reviewing',application.id])).rowCount,0);
    assert.equal((await again.query(change,['accepted',application.id])).rowCount,0);
    checks.push('Otra empresa carece de lectura y edición; la candidata no decide el estado');
    await assert.rejects(employer.query(change,['accepted',application.id]),{code:'23514'});
    for (const state of ['reviewing','accepted']) {
      assert.equal((await employer.query(change,[state,application.id])).rowCount,1);
      assert.equal((await again.query(lookup,[application.id])).rows[0].status,state);
    }
    await assert.rejects(employer.query(change,['rejected',application.id]),{code:'23514'});
    checks.push('La empresa revisa y acepta; la candidata ve el estado y se bloquean saltos y reaperturas');
    const secondCandidate = await connect(accounts[3]);
    await secondCandidate.query("insert into profiles(id,full_name) values(auth.uid(),'Segundo candidato QA')");
    const started = performance.now();
    for (const [publisher, company] of [[employer,'Empresa QA'],[outsider,'Otra empresa QA']]) {
      for (let i=0;i<10;i++) {
        const vacancy = (await publisher.query(publish,[company])).rows[0].id;
        for (const applicant of [again,secondCandidate]) {
          const submission = (await applicant.query(submit,[vacancy])).rows[0];
          if (i%3 !== 0) await publisher.query(change,['reviewing',submission.id]);
          if (i%3 === 2) await publisher.query(change,['rejected',submission.id]);
          const peer = applicant === again ? secondCandidate : again;
          assert.equal((await peer.query(lookup,[submission.id])).rowCount,0);
          const expected = ['submitted','reviewing','rejected'][i%3];
          assert.equal((await applicant.query(lookup,[submission.id])).rows[0].status,expected);
        }
      }
    }
    const batchMs = Math.round(performance.now()-started);
    checks.push('Lote sintético secuencial: 2 empresas, 2 candidatos, 20 ofertas y 40 postulaciones aisladas con tres estados');
    const version = (await admin.query('show server_version')).rows[0].server_version;
    await writeFile('output/qa/empleabilidad-postgres.json',JSON.stringify({fecha:new Date(),version,entorno:'PostgreSQL local, cuatro identidades SCRAM; auth.uid() adaptado a session_user',batchMs,checks},null,2));
    console.log('PASS PostgreSQL '+version+': '+checks.length+' grupos de verificaciones');
  } finally {
    await Promise.allSettled(clients.map(client=>client.end()));
    await db.stop();
  }
}
verify().catch(error=>{console.error(error.message);process.exitCode=1});
