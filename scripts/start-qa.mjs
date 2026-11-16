import { readFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { createApp } from '../server/app.js';

// Only the dedicated QA file may supply the target. Ignore inherited production settings.
try {
  const config = parseEnv(await readFile(new URL('../.env.qa', import.meta.url), 'utf8'));
  const ref = config.QA_STAGE_REF ?? '';
  if (!/^[a-z0-9]{20}$/.test(ref) || ref === 'elgtdvgddukmzqthztbo' ||
      config.SUPABASE_URL !== 'https://' + ref + '.supabase.co' ||
      !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.SUPABASE_PUBLISHABLE_KEY ?? '')) {
    throw new Error('Revisá la referencia de evaluación, su URL y su clave publicable en .env.qa.');
  }
  if (process.argv.includes('--check')) {
    console.log('Configuración local válida para ' + ref + '. La conexión aún requiere prueba.');
  } else {
    const env = { ...config, GLOVTA_EMPLOYER_ENABLED: 'true' };
    createApp({env}).listen(8081, '127.0.0.1', () =>
      console.log('Glovta evaluación: http://127.0.0.1:8081/portal.html (' + ref + ')'))
      .on('error', error => { console.error(error.message); process.exitCode = 1; });
  }
} catch (error) {
  console.error(error.code === 'ENOENT' ? 'Primero configurá el archivo local .env.qa.' : error.message);
  process.exitCode = 1;
}
