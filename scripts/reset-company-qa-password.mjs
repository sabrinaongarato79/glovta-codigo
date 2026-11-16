import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {pathToFileURL} from 'node:url';
import {createClient} from '@supabase/supabase-js';

const REF = 'yecgzorcxkokanuxgwki';
const ACCOUNTS = {
  empresa: {id:'62758382-6ac6-4adb-8941-2a74f675be8d', email:'empresa.qa@example.com'},
  candidata: {id:'abb2b370-685c-4025-a6e0-617ffcc7aa31', email:'candidata.qa@example.com'}
};

export async function resetCompanyPassword(config, input, makeClient = createClient) {
  const account = input.account ?? 'empresa';
  if (!Object.hasOwn(ACCOUNTS, account)) throw new Error('Cuenta QA no permitida.');
  const {id:ID, email:EMAIL} = ACCOUNTS[account];
  if (config.QA_STAGE_REF !== REF || config.SUPABASE_URL !== `https://${REF}.supabase.co`)
    throw new Error('Entorno incorrecto. Solo se permite glovta-evaluacion.');
  if (typeof input.key !== 'string' || !(input.key.startsWith('sb_secret_') || input.key.startsWith('eyJ')))
    throw new Error('Se necesita la clave administrativa de evaluacion, no la publicable.');
  if (input.key.startsWith('eyJ')) {
    let claims;
    try { claims = JSON.parse(Buffer.from(input.key.split('.')[1], 'base64url')); } catch {}
    if (claims?.role !== 'service_role' || claims?.ref !== REF)
      throw new Error('La clave service_role no pertenece al entorno de evaluacion.');
  }
  if (typeof input.password !== 'string' || input.password.length < 12 || input.password !== input.confirm)
    throw new Error('Las claves nuevas deben coincidir y tener al menos 12 caracteres.');
  const client = makeClient(config.SUPABASE_URL, input.key, {
    auth: {persistSession:false, autoRefreshToken:false, detectSessionInUrl:false}
  });
  const found = await client.auth.admin.getUserById(ID);
  if (found.error) throw new Error('No se pudo verificar la cuenta. Revisa la clave administrativa de evaluacion y la conexion.');
  if (found.data?.user?.id !== ID || found.data.user.email !== EMAIL)
    throw new Error('La cuenta no coincide. No se modifico ninguna clave.');
  const updated = await client.auth.admin.updateUserById(ID, {password:input.password});
  if (updated.error) throw new Error('Supabase no confirmo el cambio. Revisa la politica de contrasenas y la conexion antes de reintentar.');
  if (updated.data?.user?.id !== ID)
    throw new Error('Respuesta inesperada. Verifica la cuenta antes de reintentar.');
  return 'PASS: nueva clave guardada para '+EMAIL+' en glovta-evaluacion. Cuenta conservada.';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const config = parseEnv(await readFile(new URL('../.env.qa', import.meta.url), 'utf8'));
    let raw = '';
    for await (const chunk of process.stdin) raw += chunk;
    let input;
    try { input = JSON.parse(raw); } catch { throw new Error('Ejecuta el archivo PowerShell de recuperacion.'); }
    raw = '';
    try { console.log(await resetCompanyPassword(config, input)); }
    finally { input.key = input.password = input.confirm = ''; }
  } catch (error) {
    // Never print SDK responses, tokens, request bodies or network error objects.
    console.error(error?.name === 'TypeError' ? 'No se pudo conectar. Revisa tu conexion.' : error.message);
    process.exitCode = 1;
  }
}
