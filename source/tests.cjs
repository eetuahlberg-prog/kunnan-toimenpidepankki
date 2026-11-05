const assert=require('node:assert/strict'),C=require('./core.js'),data=require('./data.json'),models=require('./models.json'),sources=require('./sources.json');
const counts={Heinävesi:42,Juuka:74,Kitee:41,Kontiolahti:54,Lieksa:77,Liperi:33,Nurmes:78,Rääkkylä:49,Tohmajärvi:49};
assert.equal(data.length,497);assert.equal(new Set(data.map(a=>a.id)).size,497);
for(const [m,n] of Object.entries(counts))assert.equal(data.filter(a=>a.municipality===m).length,n,m);
assert(data.filter(a=>a.municipality==='Liperi').every(a=>a.status==='Tarkistettava'));
assert(data.every(a=>a.title&&a.source.file));
assert(models.length>=18);for(const m of models){assert(m.steps.length>=2);assert(m.alternativeSteps.length>=2);assert(m.sources.every(id=>sources.some(s=>s.id===id)),m.id);}
const energy={id:'test',title:'Kunnan kiinteistöjen energiatehokkuus',description:'Energiakatselmukset ja lämmitysjärjestelmät.',status:'Toteutuksessa',owner:'Tekninen toimi',tasks:''};
const model=C.match(energy,models)[0]?.model;assert(model);let steps=C.contextualSteps(energy,model,{},2027);assert.equal(steps[0].year,2027);assert.equal(steps.at(-1).year,2028);assert(steps.every(s=>s.owner==='Tekninen toimi'));
let completed=C.contextualSteps({...energy,status:'Valmis'},model,{},2027);assert(completed[0].action.includes('ei aloiteta uudelleen'));
let prepared=C.contextualSteps(energy,model,{prepared:'Kyllä'},2027);assert.notEqual(prepared[0].action,steps[0].action);
let recorded=C.contextualSteps({...energy,tasks:'Katselmukset tehty.'},model,{},2027);assert(recorded[0].action.includes('toteumamerkinnät'));
assert.equal(C.csvCell('=1+2'),'"\'=1+2"');assert.equal(C.csvCell('a;"b"'),'"a;""b"""');
const state=C.fresh();assert(C.validateState(state));assert(!C.validateState({...state,year:'2027'}));assert(!C.validateState({...state,plan:[{}]}));
const p={id:'test',title:'Testi',steps,ratings:{emissions:'Kohtalainen'},effects:{emissions:'Ei määrällistä arviota'},originalTitle:energy.title,originalSource:'Testiaineisto',theme:'Energia',phase:'Suunnitteilla',budget:'Selvitettävä',basis:'Testi',sourceText:'Testi',rationale:'Kohteet valitaan.'};state.plan.push(p);state.drafts.test=p;assert(C.validateState(state));
const back=JSON.parse(JSON.stringify({format:'kunnan-ilmastoteot',version:1,municipality:'Heinävesi',state}));assert.deepEqual(back.state,state);assert.equal(C.exportRows(state,'Heinävesi').length,steps.length+1);assert(C.exportRows(state,'Heinävesi').slice(1).every(r=>r[0]==='Heinävesi'));
const other=C.fresh();assert.equal(other.plan.length,0);
console.log('PASS: 497 records / 9 municipalities, source links, contextual proposals, completed/prepared branches, CSV safety, backup roundtrip and state validation.');

for (const [title,modelId] of [['Sähköautojen latauspisteet','charging'],['Etäasioinnin edistäminen','remote-services'],['Metsäpalojen torjunta','adaptation'],['Energiatehokkuuskriteerien käyttö','planning']]) {assert.equal(C.match(data.find(a=>a.title===title),models)[0].model.id,modelId,title)}
console.log('PASS: specific title routing for charging, remote services, forest fire preparedness and planning.');

assert.equal(models.length,30);
for(const m of models){
 assert(!C.vagueAction(m.title),m.id);
 assert(m.focus.length&&m.focus.every(k=>['emissions','sinks','adaptation','nature','enabling'].includes(k)),m.id);
 assert(Object.keys(C.effectLabels).every(k=>typeof m.effects[k]==='string'&&m.effects[k].length>10),m.id);
 assert(m.steps.every(s=>!C.vagueAction(s.action)),m.id);
}
for(const text of ['Edistetään energiatehokkuutta','Tuetaan ilmastotyötä','Kannustetaan pyöräilyyn'])assert(C.vagueAction(text),text);
assert(!C.vagueAction('Korjataan koulun pyöräpysäköinti'));
p.scope='Koulun ilmanvaihdon käyttöajat';
const exported=C.exportRows(state,'Heinävesi');
assert(exported.slice(1).every(r=>r[exported[0].indexOf('Kohde ja rajaus')]===p.scope));
assert.equal(JSON.parse(JSON.stringify(state)).plan[0].scope,p.scope);
console.log('PASS: 30 concrete bank models, effect categories, vague wording check, scope in CSV and backup.');

const bank=C.buildBank(data,models);
assert.equal(bank.length,527);assert.equal(new Set(bank.map(a=>a.id)).size,527);
assert(data.every(a=>bank.some(b=>b.id===a.id&&b.title===a.title&&b.description===a.description)));
assert.equal(bank.filter(a=>a.kind==='source').length,497);
assert.equal(bank.filter(a=>a.kind==='template').length,30);
assert(bank.some(a=>C.bankMatches(a,{search:'ruokahävik',theme:'',effect:''})));
assert(bank.filter(a=>C.bankMatches(a,{effect:'unclassified'})).length>0);
const sourceDone=bank.find(a=>a.status==='Valmis'&&a.modelId);
const sourceModel=models.find(m=>m.id===sourceDone.modelId);
const inspired=C.contextualSteps({title:sourceDone.title,status:'',owner:'',description:'',tasks:''},sourceModel,{},2027);
assert(!inspired[0].action.includes('ei aloiteta uudelleen'));
assert.equal(inspired[0].owner,'Vahvistettava');
const unified=C.fresh();unified.planName='Oma suunnitelma';
const own={id:'oma-test',title:'Nimetty työ'};unified.own.push(own);assert(C.validateState(unified));
const backup={format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:unified};
assert(C.validateBackup(backup,bank));
const bad=JSON.parse(JSON.stringify(backup));bad.state.drafts.foreign={...p,id:'foreign'};assert(!C.validateBackup(bad,bank));
assert.equal(C.exportRows(unified)[0][0],'Suunnitelma');
console.log('PASS: full 527-entry bank, original text preserved, search, unclassified actions, source status isolation and unified backups.');

const supplemental=require('./supplemental.json'),audit=require('./import-audit.json');
const expanded=C.buildBank(data.concat(supplemental),models);
assert.equal(expanded.length,977);
assert.equal(new Set(expanded.map(a=>a.id)).size,977);
assert.equal(expanded.filter(a=>a.kind==='source').length,895);
assert.equal(expanded.filter(a=>a.kind==='idea').length,52);
assert.equal(audit.additionalInput,audit.imported+audit.excluded+audit.merged);
assert(audit.records.filter(r=>r.decision==='excluded').every(r=>!supplemental.some(a=>a.original.id===r.originalId)));
assert(supplemental.every(a=>a.original&&a.source.file&&a.id==='extra-'+a.original.id.toLowerCase()));
assert(supplemental.every(a=>!a.status&&!a.owner&&!a.schedule));
for(const needle of ['Kannonkosken','Hinku-kuntien','Asikkalan','Iisalmen','Pielaveden'])assert(supplemental.some(a=>a.original.source.includes(needle)),needle);
assert(expanded.some(a=>C.bankMatches(a,{search:'varavoimatesti'})));
assert(expanded.some(a=>C.bankMatches(a,{search:'sadepuutarha'})));
assert(expanded.every(a=>a.bankTheme&&a.focus.length));
const enriched=C.fresh(),newId=supplemental[0].id;enriched.plan=[{...p,id:newId}];enriched.drafts[newId]=enriched.plan[0];
assert(C.validateBackup({format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:enriched},expanded));
const oldBank=C.buildBank(data,models),oldId=oldBank[0].id,legacy=C.fresh();legacy.plan=[{...p,id:oldId}];
assert(C.validateBackup({format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:legacy},expanded));
const cleanExport=C.exportRows(enriched);assert(!cleanExport[0].includes('Lähde'));assert(!cleanExport[0].includes('Alkuperäinen kirjaus'));assert(!JSON.stringify(cleanExport).includes('Testiaineisto'));
console.log('PASS: expanded 977-entry corpus, source/idea distinction, import audit, original backup compatibility and source-free plan export.');

assert.equal(C.match(supplemental.find(a=>a.id==='extra-tp0929'),models)[0].model.id,'water-storm');
assert.equal(C.match(supplemental.find(a=>a.id==='extra-tp0918'),models)[0].model.id,'adaptation');
assert(!supplemental.some(a=>/\)\s*\d+\s*$/.test(a.title)));
