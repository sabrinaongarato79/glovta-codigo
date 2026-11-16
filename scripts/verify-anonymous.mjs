import {createClient} from '@supabase/supabase-js';
import {writeFile,mkdir} from 'node:fs/promises';
const client=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const report={at:new Date().toISOString(),kind:'Supabase real: acceso anónimo, sin consultar datos personales',checks:[]};
for(const table of ['profile_experiences','profile_education','profile_languages','profile_skills']){
 const {data,error,status}=await client.from(table).select('id').limit(1);
 const blocked=error?(status===401||status===403):Array.isArray(data)&&data.length===0;
 report.checks.push({table,status,blocked,errorCode:error?.code??null});console.log(table+': HTTP '+status+', sin filas accesibles: '+blocked);
 if(!blocked)process.exitCode=1;
}
await mkdir('output/qa',{recursive:true});await writeFile('output/qa/anonymous-real.json',JSON.stringify(report,null,2));
