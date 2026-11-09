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
const back=JSON.parse(JSON.stringify({format:'kunnan-ilmastoteot',version:1,municipality:'Heinävesi',state}));assert.deepEqual(back.state,state);assert.equal(C.exportRows(state,'Heinävesi').length,state.plan.length+1);assert(C.exportRows(state,'Heinävesi').slice(1).every(r=>r[0]==='Heinävesi'));
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
assert(exported.slice(1).every(r=>r[exported[0].indexOf('Toimenpiteen kuvaus')].includes(p.scope))); 
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

const editorial=require('./editorial.json');
const raw=data.concat(supplemental),rawBefore=JSON.stringify(raw),clean=C.applyEditorial(raw,editorial),ready=C.buildBank(clean,models),catalog=C.uniqueBank(ready);
assert.equal(Object.keys(editorial).length,947);assert.equal(clean.length,947);assert.equal(ready.length,977);assert.equal(catalog.length,499);
assert.equal(catalog.flatMap(a=>a.sourceIds).length,977);assert.equal(new Set(catalog.map(a=>C.normalize(a.title))).size,catalog.length);
assert.equal(JSON.stringify(raw),rawBefore);
for(const a of clean){assert(a.generalized);assert(!a.status&&!a.owner&&!a.schedule&&!a.tasks&&!a.municipality);assert(!C.vagueAction(a.title),a.title);}
const forbidden=/AGCO|Haukkala|Heinäve|Kannonkosk|Syväjärv|Meripuisto|Sorrila|Urjalan|Porin|Laukeela|Merimasku|Ylpön|Mistelin|Ruutana|Pälkäne|Seinäjo|Tampere|Rauma|Kokkola|Porvoo|Utajärv|Ylä.Savo|Vuohiniem|Peltomä|Kiikeli|Piispala|ResQ|Biovaaka|Planect/i;
assert(!forbidden.test(JSON.stringify(clean.map(a=>[a.title,a.description]))));
assert(ready.every(a=>!C.bankMatches(a,{search:'AGCO Power Arena'})));
assert(ready.every(a=>!C.bankMatches(a,{search:'Haukkala'})));
assert(ready.every(a=>!C.vagueAction(a.title)));
const arenaId=raw.find(a=>a.title.includes('AGCO Power Arena')).id,arena=ready.find(a=>a.id===arenaId);
assert(arena.title.startsWith('Asetetaan liikuntahallin'));assert.equal(arena.modelId,'procurement');assert(!arena.description.includes('rakennettiin'));
for(const [part,id] of [['kunnostusojitukset','forests'],['virtaamanrajoittimet','water-saving'],['varavoima kuormitettuna','adaptation'],['aurinkosähköjärjestelmä','solar']])assert.equal(ready.find(a=>a.title.includes(part)).modelId,id,part);
assert(C.validateBackup({format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:enriched},ready));
assert.throws(()=>C.applyEditorial(raw,{}),/Puuttuva/);
console.log('PASS: all 947 editorial mappings, 977 stable IDs, 499 distinct visible titles, original data intact, no local names or vague titles, corrected domain routing and backup compatibility.');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'dist/index.html'),'utf8');
const payload=JSON.parse(html.split('window.CLIMATE_DATA=')[1].split(';\n(function')[0]);
assert.deepEqual(payload.data.concat(payload.supplemental),clean);
assert.equal(C.uniqueBank(C.buildBank(payload.data.concat(payload.supplemental),payload.models)).length,499);
assert(!html.includes('max-width:1200px'));
const generalizedExport=C.exportRows({...enriched,plan:[{...enriched.plan[0],id:arena.id,title:arena.title,originalTitle:arena.title}]});
assert(generalizedExport.slice(1).every(row=>row.includes(arena.title)));
console.log('PASS: bundled display data equals reviewed text and full-width build has no former page cap.');

const P=require('./proposal.js');
assert.equal(Object.keys(P.books).length,30);
for(const a of catalog){
 const d=P.makeDraft(a,2027),s=C.fresh();s.plan=[d];s.drafts[a.id]=d;
 assert(d.description.includes(a.title.replace(/[.!?]+$/,'')),a.id);
 assert(d.metric.length>20&&d.impacts.length>20,a.id);
 assert.equal(d.owner,'');assert.equal(d.costBand,'Ei vielä arvioitu');
 assert(C.validateBackup({format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:s},ready),a.id);
 assert.notEqual(P.proposal(a,'pilot').description,P.proposal(a,'joint').description);
 assert.notEqual(P.proposal(a,'expand').description,P.proposal(a,'joint').description);
}
const snapshot=JSON.stringify(p),merged=C.compactDraft(p);
assert.equal(JSON.stringify(p),snapshot);
assert(merged.description.includes(p.scope));
for(const s of p.steps){assert(merged.description.includes(s.action));assert(merged.schedule.includes(String(s.year)));if(s.quarter)assert(merged.schedule.includes(s.quarter));}
const explicit=C.compactDraft({...p,description:'Oma muokattu kuvaus',owner:'Vastuuhenkilö',schedule:'Syksy 2030',metric:'Oma mittari',impacts:'Oma arvio',costBand:'Alle 5 000 €'});
for(const [k,v] of Object.entries({description:'Oma muokattu kuvaus',owner:'Vastuuhenkilö',schedule:'Syksy 2030',metric:'Oma mittari',impacts:'Oma arvio',costBand:'Alle 5 000 €'}))assert.equal(explicit[k],v);
assert.equal(C.compactDraft({...p,description:''}).description,'');
const v06=C.fresh(),newDraft=P.makeDraft(catalog[0],2027);newDraft.costBand='20 000–99 999 €';newDraft.owner='Kunnan nimetty vastuuhenkilö';v06.plan=[newDraft];v06.drafts[newDraft.id]=newDraft;
assert(C.validateBackup(JSON.parse(JSON.stringify({format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:v06})),ready));
const invalid=JSON.parse(JSON.stringify(v06));invalid.plan[0].costBand='Arvattu hinta';assert(!C.validateState(invalid));
const rows=C.exportRows(v06);assert.equal(rows.length,2);
for(const [header,key] of [['Toimenpiteen kuvaus','description'],['Vastuuhenkilö','owner'],['Kustannusarvio','costBand'],['Vaikutukset ja perustelut','impacts']])assert.equal(rows[1][rows[0].indexOf(header)],newDraft[key]);
assert(!rows[0].some(x=>/resurssi|tulos|toistettavuus|lähde/i.test(x)));
const app=fs.readFileSync(require('node:path').join(__dirname,'app.js'),'utf8');
assert.deepEqual([...new Set([...app.matchAll(/data-draft-field="([^"]+)"/g)].map(m=>m[1]))].sort(),['title','description','owner','schedule','costBand','metric','impacts'].sort());
for(const old of ['Mitä tehdään','Kuka vastaa','Mitä tarvitaan','Mitä syntyy','Toistettavuus kahdessa vuodessa'])assert(!app.includes(old),old);
assert(html.includes('data:image/jpeg;base64,'));assert(!html.includes('__HERO__'));assert(!html.includes('__FONT__'));
console.log('PASS: 499 prefilled proposals, three scopes, 30 guidance topics, seven-field form, legacy text and quarters preserved, custom edits preserved, new backup roundtrip and one-row CSV.');

const grouping=require('./consolidation.json'),groupAudit=require('./consolidation-audit.json');
const bankBeforeGrouping=JSON.stringify(ready),consolidated=C.consolidateBank(ready,grouping,models);
assert.equal(consolidated.length,239);
assert.equal(JSON.stringify(ready),bankBeforeGrouping);
assert.deepEqual(consolidated.flatMap(a=>a.sourceIds).sort(),ready.map(a=>a.id).sort());
assert.equal(new Set(consolidated.map(a=>a.id)).size,239);
assert.equal(new Set(consolidated.map(a=>C.normalize(a.title))).size,239);
assert(consolidated.every(a=>!C.vagueAction(a.title)&&!a.description));
assert(consolidated.every(a=>!/(koulukiinteist|päiväkodin|vuokratalon|jäähallin|kunnanviraston)/i.test(a.title)));
const groupFor=id=>consolidated.find(a=>a.sourceIds.includes(id));
// Different wording and building types must resolve to the same actual measure.
for(const [pattern,title] of [[/^Asennetaan .*aurinkosähkö|^Asennetaan .*aurinkosähköä/,'Asennetaan aurinkopaneelit'],[/^Lisäeristetään|^Uusitaan palvelurakennuksen lämmöneristys/,'Lisäeristetään rakennuksia'],[/^Vaihdetaan .*LED|^Vaihdetaan .*säädettävään LED/,'Vaihdetaan valaistus LED-valaisimiin'],[/^Asennetaan .*maalämpö|^Asennetaan .*lämpöpumppu/,'Asennetaan lämpöpumput']]){
 const matches=catalog.filter(a=>pattern.test(a.title));assert(matches.length>=3,title);
 for(const a of matches)assert.equal(groupFor(a.id).title,title,a.title);
 assert.equal(consolidated.filter(a=>a.title===title).length,1);
}
const solarGroup=consolidated.find(a=>a.title==='Asennetaan aurinkopaneelit');
assert.equal(solarGroup.modelId,'solar');
assert.equal(consolidated.filter(a=>C.bankMatches(a,{search:'aurinkosähköjärjestelmä'})).length,1);
assert(consolidated.some(a=>C.bankMatches(a,{search:'lisäeristys'})));
assert.notEqual(consolidated.find(a=>a.title==='Järjestetään aurinkopaneelien yhteishankinta').id,solarGroup.id);
assert.notEqual(consolidated.find(a=>a.title==='Kaavoitetaan aurinkovoimalle soveltuvat alueet').id,solarGroup.id);
for(const a of consolidated){const s=C.fresh();s.plan=[P.makeDraft(a,2027)];assert(C.validateBackup({format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:s},ready));}
// A legacy record hidden by consolidation remains valid and unchanged in a saved plan.
const solarAlias=solarGroup.sourceIds.find(id=>id!==solarGroup.id),saved=C.fresh();
saved.plan=[{...P.makeDraft(ready.find(a=>a.id===solarAlias),2027),title:'Oma jo sovittu aurinkohanke',description:'Omat rajaukset säilyvät.'}];
const savedBefore=JSON.stringify(saved);
assert(C.validateBackup({format:'ilmastosuunnitelman-toimenpidepankki',version:1,state:saved},ready));
assert.equal(C.exportRows(saved)[1][6],'Omat rajaukset säilyvät.');assert.equal(JSON.stringify(saved),savedBefore);
assert.throws(()=>C.consolidateBank(ready,grouping.slice(1),models),/ei kata/);
const duplicate=JSON.parse(JSON.stringify(grouping));duplicate[1].sourceIds.push(duplicate[0].sourceIds[0]);assert.throws(()=>C.consolidateBank(ready,duplicate,models),/toistuva/);
assert.deepEqual(payload.consolidation,grouping);
assert.equal(C.consolidateBank(C.buildBank(payload.data.concat(payload.supplemental),payload.models),payload.consolidation,payload.models).length,239);
assert.equal(groupAudit.groups.length,239);assert.equal(groupAudit.groups.flatMap(g=>g.sourceIds).length,977);
assert(app.includes('catalog=C.consolidateBank(bank,consolidation,models)'));
console.log('PASS: 239 semantic groups cover all 977 IDs, solar/insulation/LED/heat-pump variants merge, different purposes stay separate, search finds unified actions, saved legacy plans stay intact and missing/duplicate group memberships fail.');
