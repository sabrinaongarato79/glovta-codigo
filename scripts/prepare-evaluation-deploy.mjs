import { mkdir, readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const target = join(root, 'output', 'deploy', 'glovta-evaluacion-' + Date.now());
const files = ['index.html','admin.html','app.js','storage.js','styles.css','sw.js',
  'manifest.webmanifest','portal.html','portal.js','portal.css','recuperar.html',
  'recuperar.js','profile-model.js','package.json','package-lock.json',
  'server/app.js','server/auth.js','server/employer.js','server/profile-sections.js'];
for (const item of await readdir(join(root, 'assets'), { withFileTypes:true })) {
  if (item.isFile() && /\.(svg|png|jpg|webp|ico)$/.test(item.name)) files.push('assets/' + item.name);
}
await mkdir(target, { recursive:true });
const manifest = [];
for (const file of files) {
  const bytes = await readFile(join(root, file));
  if (/sb_secret_|service_role|elgtdvgddukmzqthztbo/.test(bytes.toString('utf8'))) {
    throw new Error('Revisar archivo antes de publicar: ' + file);
  }
  await mkdir(join(target, file, '..'), {recursive:true});
  await copyFile(join(root,file),join(target,file));
  manifest.push({file,sha256:createHash('sha256').update(bytes).digest('hex')});
}
await mkdir(join(target,'api'));
await writeFile(join(target,'api/index.js'), `import { createApp } from '../server/app.js';
const expected = 'https://yecgzorcxkokanuxgwki.supabase.co';
const env = process.env;
const valid = env.SUPABASE_URL === expected &&
  /^sb_publishable_[A-Za-z0-9_-]+$/.test(env.SUPABASE_PUBLISHABLE_KEY || '') &&
  env.GLOVTA_EMPLOYER_ENABLED === 'true';
const handler = valid ? createApp({env}) : (_req,res) => {
  res.statusCode = 503;
  res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify({error:'Entorno de evaluacion no configurado correctamente.'}));
};
export default handler;
`);
await writeFile(join(target,'vercel.json'),JSON.stringify({
  version:2,
  builds:[{src:'api/index.js',use:'@vercel/node',config:{includeFiles:['server/**','assets/**','*.html','*.js','*.css','*.webmanifest']}}],
  routes:[{src:'/(.*)',dest:'/api/index.js'}]
},null,2));
await writeFile(join(target,'.vercelignore'),'.env\n.env.*\nnode_modules\n.git\n');
await writeFile(join(target,'serve.mjs'), `import {createServer} from 'node:http';
import handler from './api/index.js';
createServer(handler).listen(Number(process.env.PORT || 8080),process.env.HOST || '127.0.0.1');
`);
const pkg=JSON.parse(await readFile(join(target,'package.json'),'utf8'));
pkg.scripts={start:'node serve.mjs'};
pkg.engines={node:'22.x'};
await writeFile(join(target,'package.json'),JSON.stringify(pkg,null,2));
await writeFile(join(target,'LEEME.md'),`# Publicacion de Glovta Evaluacion

Paquete para un proyecto de alojamiento NUEVO, sin reemplazar la presentacion actual.
Incluye web y API existentes. No incluye Android, datos ni migraciones.

Variables del panel de alojamiento:
- SUPABASE_URL=https://yecgzorcxkokanuxgwki.supabase.co
- SUPABASE_PUBLISHABLE_KEY: copiar la clave publicable de evaluacion.
- GLOVTA_EMPLOYER_ENABLED=true

No cargar claves administrativas ni contrasenas en estas variables.
El adaptador devuelve 503 si la configuracion no apunta exactamente a evaluacion.

Vercel: configurar Framework Preset Other, Node 22, sin Build Command ni Output Directory personalizados.
Revisar el plan de la cuenta y sus condiciones antes de desplegar. Este paquete no contrata servicios.
No publicar hasta revisar el paquete y disponer de acceso autorizado a la cuenta.

Prueba local: npm ci, variables en el proceso y npm start.
Comprobar /portal.html (200), /api/health (200 y supabaseConfigured true),
/api/employer (401 sin sesion) y /.env (404). Luego probar el circuito autenticado.
La prueba local no acredita el empaquetado remoto ni que la URL publica funcione.
`);
await writeFile(join(target,'manifest-source.json'),JSON.stringify({fecha:new Date().toISOString(),files:manifest},null,2));
await writeFile(join(root,'output/deploy/latest-evaluation.json'),JSON.stringify({target},null,2));
console.log(JSON.stringify({target,sourceFiles:files.length,publicado:false}));
