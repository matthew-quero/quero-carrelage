const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/quote-form.js'),'utf8');
function setup(fetch){
 const fields=Object.fromEntries(Object.entries({nom:'  Client Test  ',tel:'06 00 00 00 00',email:'client@example.invalid',commune:'Plouagat',projet:'Sol intérieur',message:'  Une demande de test  '}).map(([name,value])=>[name,{value,removeAttribute(){},setAttribute(){},focus(){}}]));
 const button={textContent:'Envoyer ma demande ↗',disabled:false},status={dataset:{},textContent:'',focus(){}},attrs={};let submit,resets=0;const timers=new Map();let serial=0;
 const form={elements:fields,querySelector:()=>button,reportValidity:()=>true,addEventListener:(type,f)=>submit=f,setAttribute:(k,v)=>attrs[k]=v,removeAttribute:k=>delete attrs[k],reset(){resets++;for(const f of Object.values(fields))f.value=''}};
 class Data{constructor(){this.values=Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value]))}get(k){return this.values[k]}}
 const config={apiUrl:'https://arazo.fr/api/demandes',artisanId:'5074220b-3e4e-4577-831f-5a0304227a37'};
 const calls=[];
 vm.runInNewContext(source,{window:{QUERO_CONFIG:{arazo:{form:config}}},document:{querySelector:s=>s==='#quote-form'?form:status},FormData:Data,URL,AbortController,setTimeout:f=>(timers.set(++serial,f),serial),clearTimeout:id=>timers.delete(id),fetch:(...args)=>(calls.push(args),fetch(...args))});
 return{fields,button,status,attrs,timers,config,calls,form,get resets(){return resets},send:()=>submit({preventDefault(){}})};
}
(async()=>{
 const ok=setup(async()=>({ok:true,status:201}));await ok.send();
 assert.equal(ok.calls.length,1);const [url,request]=ok.calls[0];assert.equal(url,'https://arazo.fr/api/demandes');assert.equal(request.method,'POST');assert.equal(request.credentials,'omit');
 const body=JSON.parse(request.body);assert.deepEqual(body,{artisan:'5074220b-3e4e-4577-831f-5a0304227a37',nom:'Client Test',telephone:'0600000000',email:'client@example.invalid',ville:'Plouagat',type_travaux:'Sol intérieur',message:'Une demande de test'});
 assert.equal(ok.resets,1);assert.equal(ok.status.dataset.state,'success');assert.equal(ok.button.disabled,false);assert.equal(ok.button.textContent,'Envoyer ma demande ↗');assert.equal(ok.attrs['aria-busy'],undefined);assert.equal(ok.timers.size,0);
 const optional=setup(async()=>({ok:true,status:201}));optional.fields.tel.value='';await optional.send();assert(!JSON.parse(optional.calls[0][1].body).telephone);
 for(const [key,value]of [['email',''],['nom',' '],['tel','xyz']]){const t=setup(()=>{throw Error('Unexpected request')});t.fields[key].value=value;await t.send();assert.equal(t.calls.length,0);assert.equal(t.status.dataset.state,'error');assert.equal(t.resets,0)}
 for(const response of [{ok:false,status:400,json:async()=>({erreur:'<b>Erreur de validation</b>'})},{ok:false,status:500,json:async()=>{throw Error('HTML response')}},{ok:false,status:429,json:async()=>({})}]){
  const t=setup(async()=>response);await t.send();assert.equal(t.status.dataset.state,'error');assert.equal(t.resets,0);assert.equal(t.fields.email.value,'client@example.invalid');assert.equal(t.button.disabled,false);
  if(response.status===400)assert.equal(t.status.textContent,'<b>Erreur de validation</b>');
 }
 const network=setup(async()=>{throw Error('network failure')});await network.send();assert.equal(network.status.dataset.state,'error');assert.equal(network.resets,0);
 let release;const busy=setup(()=>new Promise(r=>release=r));const first=busy.send();assert(busy.button.disabled);await busy.send();assert.equal(busy.calls.length,1);release({ok:true,status:201});await first;assert.equal(busy.resets,1);
 let accepted;const edited=setup(()=>new Promise(r=>accepted=r));const inFlight=edited.send();edited.fields.message.value='Nouveau texte';accepted({ok:true,status:201});await inFlight;assert.equal(edited.resets,0);assert.equal(edited.fields.message.value,'Nouveau texte');
 const timeout=setup((_,request)=>new Promise((resolve,reject)=>request.signal.addEventListener('abort',()=>reject(Error('aborted')))));const pending=timeout.send();[...timeout.timers.values()][0]();await pending;assert.equal(timeout.status.dataset.state,'error');assert.equal(timeout.resets,0);assert.equal(timeout.button.disabled,false);
 const invalid=setup(()=>{throw Error('Unexpected request')});invalid.config.apiUrl='http://arazo.fr/api/demandes';await invalid.send();assert.equal(invalid.calls.length,0);assert.equal(invalid.status.dataset.state,'error');
 console.log('PASS: payload, optional phone, required fields, API errors/HTML/429, network failure, timeout, duplicate submits, in-flight edits and cleanup');
})().catch(error=>{console.error(error);process.exitCode=1});
