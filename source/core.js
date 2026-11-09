(function(global){
'use strict';
const municipalities=['Heinävesi','Juuka','Kitee','Kontiolahti','Lieksa','Liperi','Nurmes','Rääkkylä','Tohmajärvi'];
const choices=['Säilytä nykyisellään','Tarkennetaan','Jo toteutettu','Ei enää ajankohtainen','Tilanne pitää selvittää'];
const effectLabels={emissions:'Päästöjen väheneminen',sinks:'Hiilinielujen vahvistuminen',adaptation:'Sopeutuminen',control:'Kunnan vaikutusmahdollisuus',costs:'Kustannusten suuruus',savings:'Taloudelliset hyödyt',other:'Muut hyödyt'};
const normalize=s=>String(s||'').toLocaleLowerCase('fi').replace(/[^a-zåäö0-9]+/g,' ').trim();
function score(a,m){
 const t=normalize(a.title),d=normalize(a.description),keys=m.keywords.map(normalize);
 const titleHits=keys.filter(k=>t.includes(k)),descriptionHits=keys.filter(k=>d.includes(k));
 let value=(titleHits.length?20+Math.min(10,titleHits.length*2):0)+Math.min(5,descriptionHits.length);
 // More specific objects take precedence over broad accompanying vocabulary.
 const rules=[
 [/hankintaohje|hankintojen.*kriteeri/,'procurement'],
 [/varavoima|vesikatko|metsäpalo|helte|helle|ylilämp|säävarautu|liukkauden|tuholais|myrsky.*ohje/,'adaptation'],
 [/lataus|tankkauspiste|tankkausverk/,'charging'],
 [/kaavamäär|maapoliitti|kaavavaihtoeh|kaavahank|kaavoit|kaavaan|kaavassa|kaavakart|maankäyttövaihtoeh|energiatehokkuuskriteer/,'planning'],
 [/hävikk|lautashävik|ylijäämäruo|ylijäämäruu/,'food-waste'],
 [/virtaamanrajoit|wc kalust|vettä säästä|vedenkulut|vesivuoto|käyttöveden lämp/,'water-saving'],
 [/lajittel|kompost|jätteiden kerä|jätelajien|biojät/,'waste-sorting'],
 [/turvepel|viljelij|maatilo|maatilan|maatilalle|maatalou|kotieläintil/,'agriculture'],
 [/suokoh|suoennallist|soiden ojat|ennallistetaan.*suo|turvemaiden.*ennallist|turvemaakoh/,'peat-restoration'],
 [/metsän|metsien|metsäma|metsäsuunn|metsäiset|metsäpal|turvemaamets|hakku|lahopuu|säästöpu|taimiko|taimikon|puulaj|harvennu|kunnostusojit|puuston kasvu|metsitet|metsityk/,'forests'],
 [/huleve|sadepuutar|rankkasade|purojen|pienves|vesistön|pohjaveden|tulvareit/,'water-storm'],
 [/niity|niitto|vieraslaj|kotoperäi|lähiluonto|luontotalk/,'meadow'],
 [/elintarvike|kasvisruo|ruokalist|resept|kouluruo|ruokapalvel|järvikal|lihavalmi|sesonkiruo/,'meals'],
 [/kaluste|tavaralaina|välinelaina|tavaroiden|korjauspalvelu/,'reuse'],
 [/maa ainek|uusiomateriaal|kaivumaat|massatase|purkumateria|betonimurs|reunakivet/,'material-masses'],
 [/sähkösopimu|uusiutuvaa sähköä|energiahankintojen/,'electricity-purchase'],
 [/sähkökattila|lämpölait|lämpökesk|savukaas|biokaasu.*selvitys|kaukolämmön.*(fossiili|turve)|energiantuotannon/,'energy-production'],
 [/öljylämm|maalämp|lämpöpump|lämmitystapamuut/,'heating'],
 [/aurinkosähkö|aurinkopaneel/,'solar'],
 [/led|valaist|valaisim|katuvalo/,'lighting'],
 [/lämmönerist|lisäerist|ikkuna|rakenneliittym|rakennuksen vaippa|routaerist|lämpövuod/,'building-envelope'],
 [/ilmanvaih|talotekni|kiinteistötekni|energiakatsel|energiansäästö|kulutushuip|kulutusseuran|kiinteistöjen lämmitys/,'building-energy'],
 [/pyörä|kävely|jalankul/,'active-travel'],
 [/joukkoliik|asiointikuljet|liityntäkuljet|yhteiskuljet|koulukuljet|tavarakuljet|jakelureit/,'transport-services'],
 [/ajoneuvo|työkone|sähköauto|huoltoauto|yhteiskäyttöauto/,'fleet'],
 [/etätyö|etäasio|etäkokou|asiointipalvelu|sähköiseen allekirjoit/,'remote-services'],
 [/vajaakäytt|käyttöaste|yhteisiin tiloihin|tyhjät kiinteist|tarpeettom.*tilo|kiinteistökannan käyttö/,'space-use'],
 [/ilmastosuunnitel|ilmastobud|talousarvio|ilmastotyöryh|kuntastrateg|ilmastotoimien.*seuran/,'governance']
 ];
 for(const [pattern,id] of rules)if(pattern.test(t)){if(m.id===id)value+=40;else value=Math.min(value,15);break}
 return value;
}
function match(a,models){return models.map(m=>({model:m,score:score(a,m)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score)}
function done(a,r){return r?.choice==='Jo toteutettu'||(!r?.choice&&/^(valmis|toteutettu)$/i.test(a.status||''))}
function needs(a){return !a.owner||!a.schedule||/jatkuva|tarkistettava/i.test(a.schedule)||(!/\b20\d{2}\b/.test(a.schedule))||/^(edistet|kehitet|lisät|huomioidaan)/i.test(a.title)}
function fresh(){return {version:1,year:2027,checked:'',reviews:{},drafts:{},plan:[],own:[],approval:{status:'Luonnos',decision:'',date:''},profile:{resources:'Rajallinen työaika',context:'Maaseutumainen kunta'},updated:''}}
function contextualSteps(a,m,r,year,alternative=false){let steps=JSON.parse(JSON.stringify(alternative?m.alternativeSteps:m.steps));if(!steps?.length)return [];
if(done(a,r)){return [{action:`Tarkistetaan toimenpiteen ”${a.title}” toteutuksen tulokset ja sovitaan seurannasta. Toteutusta ei aloiteta uudelleen.`,result:'Kirjattu toteutustulos ja seurannan vastuuhenkilö.',metric:steps[steps.length-1].metric,resources:'Vastuuhenkilön seuranta-aika.',year,quarter:'Sovitaan',owner:a.owner||'Vahvistettava'},{action:'Verrataan seurantatietoa aiempaan tulokseen ja päätetään, tarvitaanko korjaavia toimia.',result:'Päätös ylläpidosta tai perusteltu uusi jatkotoimi.',metric:steps[steps.length-1].metric,resources:'Seurantatiedot ja mahdollisen jatkotoimen erillinen päätös.',year:year+1,quarter:'Sovitaan',owner:a.owner||'Vahvistettava'}]}
steps=steps.map((s,i)=>({...s,year:i===0?year:year+1,quarter:'Sovitaan',owner:a.owner||'Vahvistettava'}));
if(r?.prepared==='Kyllä'&&steps.length>1){steps.shift();steps[0].year=year;steps.push({action:'Kootaan toteutuksen seurantatiedot ja päätetään, jatketaanko samaa toteutustapaa vai muutetaanko sitä.',result:'Kirjattu seuranta ja päätös jatkosta.',metric:steps[0].metric,resources:'Vastuuhenkilön seuranta-aika.',year:year+1,quarter:'Sovitaan',owner:a.owner||'Vahvistettava'})}
if(a.tasks||/toteuma|toteutett|valmistu/i.test(a.description)||r?.notes){steps[0].action='Tarkistetaan ensin alkuperäiset toteumamerkinnät ja omat lisätiedot. Rajataan työ jäljellä oleviin kohteisiin. '+steps[0].action}
if(r?.funding==='Ei'){steps.forEach(s=>{s.resources+=' Toteutus edellyttää erillistä resurssipäätöstä.'})}
return steps}
function vagueAction(text){return /^(edistet[aä][aä]n|tuetaan|kannustetaan)\b/i.test(String(text).trim());}
function csvCell(v){let s=String(v??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
const costBands=['Ei vielä arvioitu','Ei erillistä määrärahaa','Alle 5 000 €','5 000–19 999 €','20 000–99 999 €','100 000–499 999 €','Vähintään 500 000 €'];
function compactDraft(p){
 const unique=values=>[...new Set(values.filter(Boolean))];
 const steps=p.steps||[],timing=unique(steps.map(s=>[s.year,s.quarter].filter(Boolean).join(" · ")));
 const oldImpact=Object.entries(p.effects||{}).filter(([k])=>['emissions','sinks','adaptation','savings','other'].includes(k)).map(([k,v])=>effectLabels[k]+': '+v).join('\n');
 return {...p,description:p.description??[p.scope,...steps.map(s=>s.action)].filter(Boolean).join('\n\n'),owner:p.owner??unique(steps.map(s=>s.owner)).join(', '),schedule:p.schedule??(timing.length?timing.join('; '):'Sovitaan'),costBand:p.costBand||'Ei vielä arvioitu',metric:p.metric??unique(steps.map(s=>s.metric)).join('; '),impacts:p.impacts??[oldImpact,p.rationale].filter(Boolean).join('\n\n')};
}
function exportRows(state,planName='Oma toimenpidesuunnitelma'){
 const rows=[['Suunnitelma','Suunnitelman tila','Päätös','Päätöspäivä','Päivitetty','Toimenpide','Toimenpiteen kuvaus','Teema','Vastuuhenkilö','Aikataulu','Kustannusarvio','Seuranta','Vaikutukset ja perustelut']];
 for(const item of state.plan){const p=compactDraft(item);rows.push([planName||'Oma toimenpidesuunnitelma',state.approval.status,state.approval.decision,state.approval.date,state.updated,p.title,p.description,p.theme,p.owner||'Nimetään yhteisessä valmistelussa',p.schedule,p.costBand,p.metric,p.impacts]);}return rows;
}
function validateState(s){if(!s||s.version!==1||!Number.isInteger(s.year)||s.year<2000||s.year>2100||!Array.isArray(s.plan)||!Array.isArray(s.own)||!s.reviews||!s.drafts||!s.approval||!['Luonnos','Kunnan vahvistama'].includes(s.approval.status))return false;
if(s.planName!==undefined&&(typeof s.planName!=='string'||s.planName.length>1000))return false;
if(s.plan.length>1000||s.own.length>1000)return false;
const text=v=>typeof v==='string'&&v.length<100000; const id=v=>text(v)&&/^[a-z0-9-]+$/.test(v);
const step=v=>v&&['action','owner','resources','result','metric','quarter'].every(k=>text(v[k]))&&Number.isInteger(v.year)&&v.year>=2000&&v.year<=2101;
const draft=p=>p&&['description','owner','schedule','costBand','metric','impacts','mode'].every(k=>p[k]===undefined||text(p[k]))&&(p.costBand===undefined||costBands.includes(p.costBand))&&id(p.id)&&text(p.title)&&(p.scope===undefined||text(p.scope))&&Array.isArray(p.steps)&&p.steps.length<=30&&p.steps.every(step)&&p.ratings&&Object.values(p.ratings).every(text)&&p.effects&&Object.values(p.effects).every(text);
return s.plan.every(draft)&&Object.values(s.drafts).every(draft)&&s.own.every(a=>a&&id(a.id)&&a.id.startsWith('oma-')&&text(a.title)&&(a.municipality===undefined||text(a.municipality)))&&Object.keys(s.reviews).every(id)&&Object.keys(s.drafts).every(id)&&Object.values(s.reviews).every(r=>r&&typeof r==='object'&&Object.values(r).every(v=>text(v)||typeof v==='boolean'));}
const effectQuestions={
emissions:'Mikä kulutus, ajomatka tai materiaalimäärä vähenee? Mikä on lähtötaso ja millä tiedolla muutos osoitetaan?',
sinks:'Miten puuston, maaperän tai maankäytön hiilivarasto muuttuu? Millä aikavälillä ja mihin asiantuntija-arvioon tieto perustuu?',
adaptation:'Mihin sää- tai ilmastoriskiin vastataan? Ketkä tai mitkä kohteet altistuvat ja miten haitta pienenee?',
control:'Mistä toteuttaja voi päättää itse? Mitkä luvat, omistajat ja kumppanit tarvitaan?',
feasibility:'Onko kohde valittu, vastuu nimetty ja työ mahdollista ajoittaa? Mitkä riippuvuudet voivat viivästyttää sitä?',
costs:'Mitä valmistelu, hankinta, työaika ja ylläpito maksavat? Mihin kustannusarvio perustuu?',
savings:'Mitä käyttö-, hankinta- tai vahinkokuluja voisi jäädä syntymättä? Kenelle hyöty kertyy ja millä aikavälillä?',
other:'Miten luonto, terveys, turvallisuus, saavutettavuus tai paikallinen elinkeinoelämä hyötyvät? Voiko jollekin syntyä haittaa?'};
function bankTheme(theme){const t=normalize(theme);if(/sopeut|varaut/.test(t))return 'Sopeutuminen ja varautuminen';if(/turve|suot/.test(t))return 'Suot ja turvemaat';if(/maankäytt|kaavoitu/.test(t))return 'Maankäyttö ja kaavoitus';if(/mets|hiiliniel/.test(t))return 'Metsät ja hiilinielut';if(/luonto|luonnon|pienves|vesist|vesi ja/.test(t))return 'Luonto ja pienvedet';if(/ruoka|maatalou/.test(t))return 'Ruoka ja maatalous';if(/liiken|liikkumi/.test(t))return 'Liikenne ja liikkuminen';if(/hankin|kiertotal/.test(t))return 'Hankinnat ja kiertotalous';if(/energi|rakennu/.test(t))return 'Energia ja rakennukset';if(/johtami|kasvatu|viestint|osaami|osallisu/.test(t))return 'Ilmastojohtaminen ja osaaminen';return 'Muu teema';}
function uniqueBank(bank){const groups=new Map();for(const a of bank){const k=normalize(a.title);if(groups.has(k))groups.get(k).sourceIds.push(a.id);else groups.set(k,{...a,sourceIds:[a.id]});}return [...groups.values()];}
// Explicit editorial groups: shared implementation, irrespective of building or wording.
// Keep legacy IDs for saved plans; never merge users' own saved descriptions.
function consolidateBank(bank,groups,models){
 const byId=new Map(bank.map(a=>[a.id,a])),byModel=new Map(models.map(m=>[m.id,m])),seen=new Set(),titles=new Set();
 const result=groups.map(g=>{
  if(!g.title||!Array.isArray(g.sourceIds)||!g.sourceIds.includes(g.id)||titles.has(normalize(g.title)))throw Error('Virheellinen yhdistelmä: '+g.id);
  titles.add(normalize(g.title));
  const members=g.sourceIds.map(id=>{if(!byId.has(id)||seen.has(id))throw Error('Puuttuva tai toistuva yhdistelytunniste: '+id);seen.add(id);return byId.get(id)});
  const m=byModel.get(g.modelId);if(!m)throw Error('Puuttuva yhdistelyn malli: '+g.modelId);
  return {id:g.id,title:g.title,description:'',kind:'consolidated',generalized:true,modelId:m.id,theme:m.theme,bankTheme:bankTheme(m.theme),focus:[...m.focus],sourceIds:[...g.sourceIds],searchText:normalize([g.title,...(g.keywords||[]),m.topic,m.theme,...members.map(a=>a.title)].join(' '))};
 });
 if(seen.size!==bank.length)throw Error('Yhdistely ei kata koko aineistoa');
 return result;
}
function applyEditorial(data,editorial){return data.map(a=>{const e=editorial[a.id];if(!e?.title)throw new Error('Puuttuva yleinen toimenpide: '+a.id);return {id:a.id,title:e.title,description:e.description||'',theme:a.theme,source:a.source,isIdea:!!a.isIdea,generalized:true,municipality:'',status:'',owner:'',schedule:'',tasks:''}});}
function buildBank(data,models){return data.map(a=>{const m=match(a,models)[0]?.model;return {...a,kind:a.isIdea?'idea':'source',modelId:m?.id||'',bankTheme:bankTheme(m?.theme||a.theme||'Muu teema'),focus:m?.focus||['unclassified'],searchText:normalize([a.title,a.description,a.tasks,a.theme,m?.topic].join(' '))}}).concat(models.map(m=>({id:'malli-'+m.id,kind:'template',title:m.title,description:m.steps.map(s=>s.action).join(' '),theme:m.theme,bankTheme:bankTheme(m.theme),focus:m.focus,modelId:m.id,source:{file:'Laadittu toteutusmalli: '+m.topic},searchText:normalize([m.title,m.topic,m.theme,...m.keywords,...m.steps.map(s=>s.action)].join(' '))})));}
function bankMatches(a,f){const words=normalize(f.search).split(' ').filter(Boolean);return words.every(w=>a.searchText.includes(w))&&(!f.theme||a.bankTheme===f.theme)&&(!f.effect||a.focus.includes(f.effect));}
function validateBackup(p,bank){if(!p||!['kunnan-ilmastoteot','ilmastosuunnitelman-toimenpidepankki'].includes(p.format)||p.version!==1||!validateState(p.state))return false;const allowed=new Set(bank.map(a=>a.id).concat(p.state.own.map(a=>a.id)));return p.state.plan.every(d=>allowed.has(d.id))&&Object.entries(p.state.drafts).every(([id,d])=>allowed.has(id)&&id===d.id)&&Object.keys(p.state.reviews).every(id=>allowed.has(id));}
const api={costBands,compactDraft,uniqueBank,consolidateBank,applyEditorial,buildBank,bankMatches,validateBackup,effectQuestions,municipalities,choices,effectLabels,normalize,score,match,done,needs,fresh,contextualSteps,csvCell,exportRows,validateState,vagueAction};global.ClimateCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
