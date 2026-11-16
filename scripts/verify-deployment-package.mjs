import {readFile,writeFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';

const {target}=JSON.parse(await readFile('output/deploy/latest-evaluation.json','utf8'));
const env=parseEnv(await readFile('.env.qa','utf8'));
assert.equal(env.SUPABASE_URL,'https://yecgzorcxkokanuxgwki.supabase.co');
const report={fecha:new Date().toISOString(),target,proyecto:'yecgzorcxkokanuxgwki',checks:[],publicado:false,
  limite:'Servidor HTTP local con paquete aislado. No acredita build remoto Vercel ni recorrido autenticado publico.'};
async function run(suffix,variables,checks){
  Object.assign(process.env,variables);
  const {default:handler}=await import(pathToFileURL(join(target,'api/index.js')).href+'?'+suffix);
  const server=createServer(handler).listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  try{
    for(const [path,status] of checks){
      const res=await fetch('http://127.0.0.1:'+server.address().port+path);
      assert.equal(res.status,status,path);
      if(path==='/api/health'&&status===200)assert.equal((await res.json()).supabaseConfigured,true);
      else await res.text();
      report.checks.push({caso:suffix,ruta:path,status,estado:'APROBADO'});
    }
  }finally{await new Promise(r=>server.close(r));}
}
try{
  await run('evaluacion',{...env,GLOVTA_EMPLOYER_ENABLED:'true'},[
    ['/portal.html',200],['/portal.js',200],['/portal.css',200],['/',200],
    ['/api/health',200],['/api/employer',401],['/api/profile',401],
    ['/.env',404],['/.env.qa',404],['/server/app.js',404],['/package.json',404],['/api/no-existe',404]
  ]);
  await run('rechaza-otro-proyecto',{SUPABASE_URL:'https://otro-proyecto.supabase.co'},[['/api/health',503]]);
  await run('rechaza-clave-no-publicable',{...env,SUPABASE_PUBLISHABLE_KEY:'invalida'},[['/api/health',503]]);
  report.estado='APROBADO';
}catch(error){report.estado='FALLA';report.error=error.message;process.exitCode=1;}
await writeFile('output/deploy/verificacion-paquete.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
