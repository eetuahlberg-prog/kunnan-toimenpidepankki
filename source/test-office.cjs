const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const C=require('./core.js'),P=require('./proposal.js'),O=require('./office-export.js');
const bank=C.buildBank(C.applyEditorial(require('./data.json').concat(require('./supplemental.json')),require('./editorial.json')),require('./models.json'));
const catalog=C.consolidateBank(bank,require('./consolidation.json'),require('./models.json'));
const state=C.fresh();state.planName='Kunnan ilmastotoimet 2027–2028';
state.plan=catalog.filter(a=>['Asennetaan aurinkopaneelit','Lisäeristetään rakennuksia'].includes(a.title)).map(a=>P.makeDraft(a,2027));
state.plan[0].owner='Aino Ääkkönen & tiimi';state.plan[0].costBand='20 000–99 999 €';state.plan[0].description+='\nKohde sovitaan valmistelussa. Säilytä merkinnät <5 % ja A & B.';
state.plan[1].owner='=SUM(1,2)';
const original=JSON.stringify(state);
assert.throws(()=>O.create('docx',C.fresh(),C),/Lisää ensin/);
const approved=JSON.parse(original);approved.approval.status='Kunnan vahvistama';assert.throws(()=>O.create('docx',approved,C),/päätösviite/);
const cases={sample:state,stress:JSON.parse(original)};
cases.stress.planName='Pitkä suunnitelman nimi '.repeat(35);
cases.stress.plan=[{...cases.stress.plan[0],title:'Erittäin pitkä toimenpiteen nimi '.repeat(25),description:('Pitkä kuvaus, säilyvä sisältö ja ääkköset äöå. WWWWWWWW '.repeat(150))+'\n\n'+'W'.repeat(500)+'\n'+'Rivi\n'.repeat(80),impacts:'Vaikutuksen arvio ja epävarmuus. '.repeat(100)}];
const out=path.resolve(__dirname,'..','qa-office');fs.mkdirSync(out,{recursive:true});
for(const [name,s] of Object.entries(cases)){
 const m=O.prepare(s,C);fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(m));
 for(const format of ['docx','xlsx','pptx']){
  const result=O.create(format,s,C);
  assert(result.data instanceof Uint8Array&&result.data[0]===80&&result.data[1]===75);
  assert(result.mime.includes('openxmlformats'));assert(result.name.endsWith('.'+format));
  fs.writeFileSync(path.join(out,name+'.'+format),result.data);
 }
 const slides=O.slidesFor(m);assert(slides.length>=3);
 for(const slide of slides){
  assert(slide.lines.length<=13);
  for(const line of slide.lines)assert(Array.from(line.text).reduce((n,c)=>n+O.charWidth(c),0)*18*(line.bold?1.1:1)<864,line.text);
  for(const title of slide.title.split('\n'))assert(Array.from(title).reduce((n,c)=>n+O.charWidth(c),0)*30*1.1<864,title);
 }
}
assert.equal(JSON.stringify(state),original);
const css=fs.readFileSync(path.join(__dirname,'app.css'),'utf8');
assert(css.includes('font-family:Ubuntu'));assert(css.includes('#climate-app label,#climate-app .bank-toolbar label,#climate-app legend{color:var(--ink)}'));
assert(css.includes('input::placeholder'));assert(!css.includes('opacity:.45'));
const html=fs.readFileSync(path.join(__dirname,'dist/index.html'),'utf8');
for(const label of ['Word (.docx)','Excel (.xlsx)','PowerPoint (.pptx)'])assert(html.includes(label),label);
assert(html.includes('global.ClimateOffice=api'));assert(html.includes('data:font/woff;base64,'));
console.log('PASS: three native Office export formats, empty/approval guards, non-mutating export, long-content pagination, Ubuntu font metrics and direct label/placeholder color rules.');
