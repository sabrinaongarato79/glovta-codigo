import {readFile, mkdir} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
import {parseEnv} from 'node:util';
import {spawn} from 'node:child_process';

function run(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [file], {env: process.env, stdio:'inherit'});
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error('Ensayo interrumpido en ' + file)));
  });
}

try {
  const config = parseEnv(await readFile(new URL('../.env.qa', import.meta.url), 'utf8'));
  if (config.QA_STAGE_REF !== 'yecgzorcxkokanuxgwki' ||
      config.SUPABASE_URL !== 'https://yecgzorcxkokanuxgwki.supabase.co' ||
      !config.SUPABASE_PUBLISHABLE_KEY?.startsWith('sb_publishable_')) {
    throw new Error('Completá la clave publicable de glovta-evaluacion en .env.qa.');
  }
  for (const name of ['QA_STAGE_REF','SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY']) {
    process.env[name] = config[name];
  }
  process.env.QA_COMPANY_EMAIL = 'empresa.qa@example.com';
  process.env.QA_CANDIDATE_EMAIL = 'candidata.qa@example.com';
  if (!process.env.QA_COMPANY_PASSWORD || !process.env.QA_CANDIDATE_PASSWORD) {
    throw new Error('Ingresá las contraseñas desde scripts/run-evaluation.ps1.');
  }
  process.env.QA_EMAIL_A = process.env.QA_COMPANY_EMAIL;
  process.env.QA_EMAIL_B = process.env.QA_CANDIDATE_EMAIL;
  process.env.QA_PASSWORD_A = process.env.QA_COMPANY_PASSWORD;
  process.env.QA_PASSWORD_B = process.env.QA_CANDIDATE_PASSWORD;
  // Read-only preflight: fail before inserting fixtures if roles are not ready.
  const ids = [];
  for (const role of ['COMPANY', 'CANDIDATE']) {
    const client = createClient(config.SUPABASE_URL, config.SUPABASE_PUBLISHABLE_KEY,
      {auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    try {
      const login = await client.auth.signInWithPassword({
        email:process.env['QA_'+role+'_EMAIL'], password:process.env['QA_'+role+'_PASSWORD']
      });
      if (login.error) {
        // Show only known diagnostic labels, never raw responses or credentials.
        const explanations = {
          invalid_credentials: 'Supabase rechazo el correo o la contrasena (invalid_credentials).',
          email_not_confirmed: 'El correo no esta confirmado (email_not_confirmed).',
          over_request_rate_limit: 'Demasiados intentos; espera antes de volver a probar.',
          user_banned: 'La cuenta esta bloqueada.',
          weak_password: 'La contrasena no cumple la politica de seguridad.'
        };
        const status = Number.isInteger(login.error.status) ? login.error.status : 'sin respuesta';
        const detail = explanations[login.error.code] ||
          (login.error.name === 'AuthRetryableFetchError'
            ? 'Fallo de conexion o servicio de autenticacion. No cambies la contrasena por este error.'
            : 'Error de autenticacion sin clasificar; conservar este resultado para revision.');
        throw new Error('Detalle QA '+role+' (HTTP '+status+'): '+detail);
      }
      console.log('PASS inicio de sesion QA '+role+'.');
      ids.push(login.data.user.id);
      const membership = await client.from('employer_accounts').select('user_id,company_name');
      if (membership.error) throw new Error('No se pudo consultar el rol empresarial de QA.');
      if (role === 'COMPANY' && (membership.data.length !== 1 || membership.data[0].user_id !== login.data.user.id))
        throw new Error('Falta habilitar empresa.qa@example.com con docs/HABILITAR_EMPRESA_QA.sql en evaluación.');
      if (role === 'CANDIDATE' && membership.data.length !== 0)
        throw new Error('La candidata tiene acceso inesperado a membresías empresariales. Detener y revisar RLS.');
    } finally { await client.auth.signOut({scope:'local'}); }
  }
  if (ids[0] === ids[1]) throw new Error('Las cuentas QA deben ser independientes.');
  console.log('PASS prevalidación: dos cuentas autenticadas y roles diferenciados.');
  await mkdir('output/qa', {recursive:true});
  await run('scripts/verify-rls.mjs');
  await run('scripts/verify-employer-portal.cjs');
  console.log('Pruebas autenticadas de trayectoria y recorrido empresarial completadas.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
