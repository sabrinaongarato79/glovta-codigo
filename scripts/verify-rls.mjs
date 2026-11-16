// Real Supabase tests. Requires two dedicated QA accounts with or without an existing profile.
// Uses public key + user sessions only. Never logs credentials or tokens.
import {createClient} from '@supabase/supabase-js';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
const keys=['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','QA_EMAIL_A','QA_PASSWORD_A','QA_EMAIL_B','QA_PASSWORD_B'];
if(keys.some(k=>!process.env[k])) {console.error('NO EJECUTADO: faltan configuración o dos cuentas QA. Usá scripts/verify-rls.ps1.');process.exit(2)}
const report={startedAt:new Date().toISOString(),kind:'Supabase real, clave pública y sesiones de dos usuarios',checks:[],status:'running'};
const reportPath = process.env.QA_STAGE_REF === 'yecgzorcxkokanuxgwki'
  ? 'output/qa/rls-evaluacion.json' : 'output/qa/rls-real.json';
const options={auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}};
const make=()=>createClient(process.env.SUPABASE_URL,process.env.SUPABASE_PUBLISHABLE_KEY,options);
const accounts=[],created=[];
const fixtures={profile_experiences:{position:'Prueba QA',organization:'Glovta QA',experience_type:'academic'},profile_education:{title:'Prueba QA',institution:'Glovta QA',education_type:'academic'},profile_languages:{language:'Idioma QA',proficiency:'basic'},profile_skills:{name:'Habilidad QA',category:'technical'}};
function ok(result, label) {
  if (result.error) {
    const reasons = {
      invalid_credentials: 'Revisá el correo y la contraseña de Glovta.',
      email_not_confirmed: 'El correo todavía requiere confirmación en Supabase.',
      over_request_rate_limit: 'Supabase pide esperar antes de volver a intentar.'
    };
    const code = String(result.error.code || '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 48);
    const status = Number(result.error.status) || 0;
    throw new Error(label + '. ' + (reasons[code] || 'Revisá la conexión y el estado del servicio.') + ' (' + (code || 'sin código') + ', HTTP ' + status + ')');
  }
  return result.data;
}
function pass(name){report.checks.push({name,result:'PASS'});console.log('PASS '+name)}
try {
 for(const name of ['A','B']){
  const client=make();const auth=ok(await client.auth.signInWithPassword({email:process.env['QA_EMAIL_'+name],password:process.env['QA_PASSWORD_'+name]}),'Inicio de sesión QA '+name);
  accounts.push({client,id:auth.user.id,name});
 }
 assert.notEqual(accounts[0].id,accounts[1].id,'Deben ser dos usuarios diferentes');
 pass('Dos cuentas diferentes autenticadas');
 for (const account of accounts) {
   const profile = ok(await account.client.from('profiles').select('id')
     .eq('id', account.id).maybeSingle(), 'Consultar perfil QA');
   if (!profile) {
     ok(await account.client.from('profiles').insert({
       id: account.id, full_name: 'Cuenta de prueba RLS ' + account.name
     }), 'Crear perfil QA');
   }
 }
 for(const [table,fixture]of Object.entries(fixtures)){
  for(const owner of accounts){
   const other=accounts.find(a=>a!==owner),client=owner.client;
   const field = Object.keys(fixture)[0];
   const marker = 'QA ' + crypto.randomUUID();
   const row=ok(await client.from(table).insert({...fixture,[field]:marker,profile_id:owner.id}).select().single(),table+' crear propio');created.push({client,table,id:row.id});
   assert.equal(ok(await client.from(table).select('*').eq('id',row.id),table+' leer propio').length,1);
   assert.equal(ok(await other.client.from(table).select('*').eq('id',row.id),table+' lectura ajena').length,0);
   const spoofValue = marker + ' ajeno';
   const spoof = await other.client.from(table).insert({...fixture,[field]:spoofValue,profile_id:owner.id});
   if (!spoof.error) {
     const unexpected = ok(await client.from(table).select('id').eq('profile_id',owner.id).eq(field,spoofValue).single(),'Localizar registro QA');
     created.push({client,table,id:unexpected.id});
   }
   assert.equal(spoof.error?.code,'42501',table+' INSERT ajeno debe rechazarse por permisos');
   const value = marker + ' editada';
   assert.equal(ok(await other.client.from(table).update({[field]:value}).eq('id',row.id).select(),table+' UPDATE ajeno').length,0);
   assert.equal(ok(await other.client.from(table).delete().eq('id',row.id).select(),table+' DELETE ajeno').length,0);
   assert.ok((await client.from(table).update({profile_id:other.id}).eq('id',row.id)).error,table+' propietario protegido');
   const changed=ok(await client.from(table).update({[field]:value}).eq('id',row.id).select().single(),table+' editar propio');assert.equal(changed[field],value);
   const fresh=make();ok(await fresh.auth.signInWithPassword({email:process.env['QA_EMAIL_'+owner.name],password:process.env['QA_PASSWORD_'+owner.name]}),'Reingreso QA');
   assert.equal(ok(await fresh.from(table).select('*').eq('id',row.id).single(),table+' persistencia tras reingreso')[field],value);
   if(table==='profile_languages'||table==='profile_skills') {
    const duplicate = await client.from(table).insert({...fixture,[field]:value.toUpperCase(),profile_id:owner.id}).select('id').single();
    if (duplicate.data?.id) created.push({client,table,id:duplicate.data.id});
    assert.equal(duplicate.error?.code,'23505','Duplicado normalizado rechazado');
   }
   ok(await client.from(table).delete().eq('id',row.id),table+' eliminar propio');
   assert.equal(ok(await client.from(table).select('*').eq('id',row.id),table+' confirmar borrado').length,0);
   pass(table+' / '+owner.name+': CRUD, persistencia y aislamiento SELECT/INSERT/UPDATE/DELETE');
  }
  const anonymous=await make().from(table).select('*');assert.ok(anonymous.error||anonymous.data.length===0);pass(table+': sin acceso anónimo');
 }
 report.status='passed';
} catch(error){report.status='failed';report.failure=error.message;console.error('FAIL '+error.message);process.exitCode=1}
finally{
 // Only remove record IDs created by this run. Leave labelled QA profiles, no real data touched.
 for(const row of created){const result=await row.client.from(row.table).delete().eq('id',row.id);if(result.error){report.status='failed';report.checks.push({name:'Limpieza '+row.table,result:'FAIL'});process.exitCode=1}}
 report.finishedAt=new Date().toISOString();await mkdir('output/qa',{recursive:true});await writeFile(reportPath,JSON.stringify(report,null,2));
 console.log('Informe: '+reportPath+'. Los perfiles QA se conservan identificados como pruebas.');
}
