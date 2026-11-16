import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server/app.js';
import {profileSections,validateSection} from '../profile-model.js';
const examples={experiences:{position:'Analista',organization:'QA',experience_type:'academic'},education:{title:'Sistemas',institution:'QA',education_type:'academic'},languages:{language:'Español',proficiency:'native'},skills:{name:'SQL',category:'technical'}};
const id='11111111-1111-4111-8111-111111111111';
for(const section of Object.keys(examples)) {
 test(section+': validates required, types, lengths and protected fields',()=>{
  const valid=examples[section];
  assert.deepEqual(Object.keys(validateSection(section,valid)),Object.keys(profileSections[section].fields));
  for(const body of [null,[],{}, {...valid,id},{...valid,profile_id:'other'},{...valid,created_at:'today'},{...valid,constructor:'bad'}]) assert.throws(()=>validateSection(section,body));
  for(const [key,[,type]] of Object.entries(profileSections[section].fields)) {
   if(typeof type==='number') assert.throws(()=>validateSection(section,{...valid,[key]:'x'.repeat(type+1)}));
   if(Array.isArray(type)) assert.throws(()=>validateSection(section,{...valid,[key]:'admin'}));
  }
 });
 test(section+': API CRUD uses verified owner, scopes mutations and handles missing records',async()=>{
  let fields,op,filters=[],result={data:{id}};
  const query={select(){return this},eq(k,v){filters.push([k,v]);return this},order(){return Promise.resolve(result)},single(){return Promise.resolve(result)},maybeSingle(){return Promise.resolve(result)}};
  const db={auth:{getUser:async()=>({data:{user:{id:'owner'}}})},from(table){assert.equal(table,profileSections[section].table);return {select(){op='get';return query},insert(v){op='insert';fields=v;return query},update(v){op='update';fields=v;return query},delete(){op='delete';return query}}}};
  const server=createApp({env:{SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'test'},clientFactory:()=>db}).listen(0,'127.0.0.1');
  await new Promise(r=>server.once('listening',r));
  const base='http://127.0.0.1:'+server.address().port+'/api/profile-sections/'+section;
  const request=(method,suffix='',body)=>fetch(base+suffix,{method,headers:{Authorization:'Bearer valid','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  try {
   assert.equal((await fetch(base)).status,401);
   assert.equal((await request('POST','',{...examples[section],profile_id:'other'})).status,400);
   assert.equal((await request('POST','',examples[section])).status,201);assert.equal(fields.profile_id,'owner');
   filters=[];assert.equal((await request('GET')).status,200);assert.deepEqual(filters,[['profile_id','owner']]);
   for(const method of ['PUT','DELETE']) {
    filters=[];assert.equal((await request(method,'/'+id,method==='PUT'?examples[section]:undefined)).status,200);
    assert.deepEqual(filters,[['profile_id','owner'],['id',id]]);
    if(method==='PUT') assert.equal(Object.hasOwn(fields,'profile_id'),false);
    assert.equal((await request(method,'/invalid',examples[section])).status,400);
    result={data:null};assert.equal((await request(method,'/'+id,method==='PUT'?examples[section]:undefined)).status,404);result={data:{id}};
   }
   result={error:{code:'23505',message:'private'}};const response=await request('POST','',examples[section]);assert.equal(response.status,409);assert.equal((await response.text()).includes('private'),false);
  }finally{await new Promise(r=>server.close(r));}
 });
}
test('dates reject invalid calendar dates, reversed ranges and current with end date',()=>{
 for(const section of ['experiences','education']) for(const dates of [{start_date:'2026-02-30'},{end_date:'2026-01-01'},{start_date:'2026-02-01',end_date:'2026-01-01'},{start_date:'2026-01-01',end_date:'2026-02-01',is_current:true},{is_current:'yes'}]) assert.throws(()=>validateSection(section,{...examples[section],...dates}));
 assert.doesNotThrow(()=>validateSection('experiences',{...examples.experiences,start_date:'2024-02-29',is_current:true}));
 assert.throws(()=>validateSection('constructor',{}));
});
