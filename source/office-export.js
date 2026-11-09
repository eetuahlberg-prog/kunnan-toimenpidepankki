(function(global){
'use strict';
// Browser-side OOXML exports. All text stays editable; no network or server is used.
const X=s=>String(s??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const XML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS='http://schemas.openxmlformats.org/',REL=NS+'package/2006/relationships',R=NS+'officeDocument/2006/relationships/';
const mime={docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
const fields=[['Toimenpiteen kuvaus','description'],['Teema','theme'],['Vastuuhenkilö','owner'],['Aikataulu','schedule'],['Kustannusarvio','costBand'],['Seuranta','metric'],['Vaikutukset ja perustelut','impacts']];
const value=(p,k)=>String(p[k]??'').trim()?String(p[k]):k==='owner'?'Nimetään yhteisessä valmistelussa':'Täydennetään';
function rels(items){return XML+'<Relationships xmlns="'+REL+'">'+items.map(([id,type,target])=>'<Relationship Id="'+id+'" Type="'+type+'" Target="'+X(target)+'"/>').join('')+'</Relationships>';}
function types(overrides){return XML+'<Types xmlns="'+NS+'package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'+overrides.map(([p,t])=>'<Override PartName="/'+p+'" ContentType="'+t+'"/>').join('')+'</Types>';}
function properties(title){return XML+'<cp:coreProperties xmlns:cp="'+NS+'package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>'+X(title)+'</dc:title><dc:creator>Ilmastovisio</dc:creator><dc:language>fi-FI</dc:language></cp:coreProperties>';}
const crcTable=Array.from({length:256},(_,i)=>{for(let j=0;j<8;j++)i=(i&1)?(0xedb88320^(i>>>1)):(i>>>1);return i>>>0});
function crc32(a){let c=0xffffffff;for(const x of a)c=crcTable[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function zip(files){
 const enc=new TextEncoder(),locals=[],central=[];let offset=0;
 const head=(length)=>{const a=new Uint8Array(length);return [a,new DataView(a.buffer)];};
 for(const [path,content] of Object.entries(files)){
  const name=enc.encode(path),data=enc.encode(content),crc=crc32(data),[a,v]=head(30+name.length);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);a.set(name,30);
  locals.push(a,data);const [b,w]=head(46+name.length);
  w.setUint32(0,0x02014b50,true);w.setUint16(4,20,true);w.setUint16(6,20,true);w.setUint16(8,0x800,true);w.setUint16(14,33,true);w.setUint32(16,crc,true);w.setUint32(20,data.length,true);w.setUint32(24,data.length,true);w.setUint16(28,name.length,true);w.setUint32(42,offset,true);b.set(name,46);central.push(b);offset+=a.length+data.length;
 }
 const directorySize=central.reduce((n,a)=>n+a.length,0),[end,v]=head(22);
 if(central.length>65535||offset+directorySize>0xffffffff)throw Error('Tiedosto on liian suuri. Vie suunnitelma pienemmissä osissa.');
 v.setUint32(0,0x06054b50,true);v.setUint16(8,central.length,true);v.setUint16(10,central.length,true);v.setUint32(12,directorySize,true);v.setUint32(16,offset,true);
 const out=new Uint8Array(offset+directorySize+22);let at=0;for(const a of [...locals,...central,end]){out.set(a,at);at+=a.length;}return out;
}
function prepare(state,core){
 if(!state.plan.length)throw Error('Lisää ensin toimenpiteitä suunnitelmaan.');
 if(state.approval.status==='Kunnan vahvistama'&&(!state.approval.decision.trim()||!state.approval.date))throw Error('Täydennä päätösviite ja päätöspäivä ennen vientiä.');
 return {title:state.planName||'Ilmastosuunnitelman toimenpiteet',status:state.approval.status,decision:state.approval.decision||'',date:state.approval.date||'',actions:state.plan.map(core.compactDraft)};
}
function baseFiles(title,rootPath){
 return {'_rels/.rels':rels([['rId1',R+'officeDocument',rootPath],['rId2',NS+'package/2006/relationships/metadata/core-properties','docProps/core.xml']]),'docProps/core.xml':properties(title)};
}
function docx(m){
 const ns=NS+'wordprocessingml/2006/main';
 const run=t=>'<w:r><w:t xml:space="preserve">'+X(t)+'</w:t></w:r>';
 const para=(t,style='Normal',page=false)=>'<w:p><w:pPr><w:pStyle w:val="'+style+'"/>'+(page?'<w:pageBreakBefore/>':'')+'</w:pPr>'+run(t)+'</w:p>';
 const paragraphs=t=>String(t).replace(/\r\n?/g,'\n').split('\n').map(t=>para(t)).join('');
 let body=para(m.title,'Title')+para('Suunnitelmaan valitut toimenpiteet ja niiden toteutus sekä vaikutusten arviointi.')+para('Tila: '+m.status+' | Toimenpiteitä: '+m.actions.length);
 if(m.decision||m.date)body+=para('Päätös: '+m.decision+' | Päätöspäivä: '+m.date);
 for(const [i,p] of m.actions.entries()){
  body+=para((i+1)+'. '+p.title,'Heading1',i>0);
  for(const [label,k] of fields)body+=para(label,'Heading2')+paragraphs(value(p,k));
 }
 const files=baseFiles(m.title,'word/document.xml');
 files['word/document.xml']=XML+'<w:document xmlns:w="'+ns+'" xmlns:r="'+R.slice(0,-1)+'"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
 const style=(id,name,size,bold,keep)=>'<w:style w:type="paragraph" w:styleId="'+id+'"'+(id==='Normal'?' w:default="1"':'')+'><w:name w:val="'+name+'"/>'+(id!=='Normal'?'<w:basedOn w:val="Normal"/>':'')+'<w:pPr><w:spacing w:before="'+(id==='Heading1'?240:100)+'" w:after="100" w:line="300" w:lineRule="auto"/>'+(keep?'<w:keepNext/>':'')+(id==='Heading1'?'<w:outlineLvl w:val="0"/>':id==='Heading2'?'<w:outlineLvl w:val="1"/>':'')+'</w:pPr><w:rPr><w:rFonts w:ascii="Ubuntu" w:hAnsi="Ubuntu" w:cs="Arial"/><w:color w:val="000000"/><w:sz w:val="'+size+'"/><w:lang w:val="fi-FI"/>'+(bold?'<w:b/>':'')+'</w:rPr></w:style>';
 files['word/styles.xml']=XML+'<w:styles xmlns:w="'+ns+'">'+style('Normal','Normal',24,false,false)+style('Title','Title',36,true,true)+style('Heading1','heading 1',30,true,true)+style('Heading2','heading 2',24,true,true)+'</w:styles>';
 files['word/_rels/document.xml.rels']=rels([['rId1',R+'styles','styles.xml']]);
 files['[Content_Types].xml']=types([['word/document.xml','application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'],['word/styles.xml','application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml'],['docProps/core.xml','application/vnd.openxmlformats-package.core-properties+xml']]);
 return files;
}
const fontWidths=[231,276,418,667,564,858,666,241,324,324,480,564,246,299,246,384,564,564,564,564,564,564,564,564,564,564,246,246,564,564,564,404,950,663,643,620,713,571,537,672,705,269,500,629,519,871,728,778,608,778,629,532,565,688,656,929,631,598,573,329,384,329,564,492,376,522,589,465,589,559,386,578,571,253,253,522,273,861,574,590,589,589,386,446,402,574,502,777,511,497,471,333,279,333,564,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,231,276,564,564,564,564,279,492,376,814,389,499,564,299,814,376,332,564,359,359,376,580,646,246,376,359,446,499,874,874,874,404,663,663,663,663,663,663,935,620,571,571,571,571,269,269,269,269,726,728,778,778,778,778,778,564,778,688,688,688,688,598,609,623,522,522,522,522,522,522,859,465,559,559,559,559,253,253,253,253,589,574,590,590,590,590,590,564,590,574,574,574,574,497,589,497];
function charWidth(c){return (fontWidths[c.codePointAt(0)-32]||1000)/1000;}
function cellChunks(text,width,maxLines=18){
 const out=[];let part='',column=0,line=1;
 for(const c of String(text)){if(line>maxLines){out.push(part);part='';column=0;line=1;}part+=c;if(c==='\n'){line++;column=0;}else if(++column>=width){line++;column=0;}}
 if(part||!out.length)out.push(part);return out;
}
function chunks(text,max){
 const chars=Array.from(String(text));if(!chars.length)return [''];
 const out=[];for(let i=0;i<chars.length;i+=max)out.push(chars.slice(i,i+max).join(''));return out;
}
function xlsx(m){
 const ns=NS+'spreadsheetml/2006/main',widths=[6,38,65,24,28,26,28,52,65,10],labels=['Nro','Toimenpide',...fields.map(x=>x[0]),'Osa'];
 const cell=(r,c,t,s=0)=>'<c r="'+String.fromCharCode(65+c)+r+'" s="'+s+'" t="inlineStr"><is><t xml:space="preserve">'+X(String(t).replace(/\r\n?/g,'\n'))+'</t></is></c>';
 const row=(r,values,style,height)=>'<row r="'+r+'" ht="'+height+'" customHeight="1">'+values.map((v,c)=>cell(r,c,v,style)).join('')+'</row>';
 let data='',r=1;const merges=[];
 const meta=[[m.title,2],['Tila: '+m.status,0],['Päätös: '+(m.decision||'Ei vahvistettu'),0],['Päätöspäivä: '+(m.date||'Ei vahvistettu'),0],['Toimenpiteitä: '+m.actions.length,0]];
 for(const [text,style] of meta)for(const part of cellChunks(text,style===2?150:200,12)){
  const lines=part.split('\n').reduce((n,l)=>n+Math.max(1,Math.ceil(l.length/(style===2?150:200))),0);
  data+=row(r,[part],style,Math.max(28,lines*(style===2?24:17)+12));merges.push('A'+r+':J'+r);r++;
 }
 r++;const headerRow=r++;data+=row(headerRow,labels,1,36);
 for(const [i,p] of m.actions.entries()){
  const values=[String(i+1),p.title,...fields.map(([,k])=>value(p,k))],parts=values.map((v,c)=>cellChunks(v,Math.max(1,Math.floor(widths[c]*.65)))),count=Math.max(...parts.map(x=>x.length));
  for(let n=0;n<count;n++){
   const v=parts.map((v,c)=>c===0?String(i+1):(v[n]||''));v.push((n+1)+'/'+count);
   const lines=Math.max(...v.map((s,c)=>String(s).split('\n').reduce((a,line)=>a+Math.max(1,Math.ceil(Array.from(line).length/Math.max(1,Math.floor(widths[c]*.65)))),0)));
   data+=row(r++,v,i%2?3:0,Math.min(409,Math.max(36,lines*17+14)));
  }
 }
 const files=baseFiles(m.title,'xl/workbook.xml');
 files['xl/workbook.xml']=XML+'<workbook xmlns="'+ns+'" xmlns:r="'+R.slice(0,-1)+'"><bookViews><workbookView/></bookViews><sheets><sheet name="Toimenpiteet" sheetId="1" r:id="rId1"/></sheets></workbook>';
 files['xl/_rels/workbook.xml.rels']=rels([['rId1',R+'worksheet','worksheets/sheet1.xml'],['rId2',R+'styles','styles.xml']]);
 files['xl/worksheets/sheet1.xml']=XML+'<worksheet xmlns="'+ns+'"><dimension ref="A1:J'+(r-1)+'"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="'+headerRow+'" topLeftCell="A'+(headerRow+1)+'" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="24"/><cols>'+widths.map((w,c)=>'<col min="'+(c+1)+'" max="'+(c+1)+'" width="'+w+'" customWidth="1"/>').join('')+'</cols><sheetData>'+data+'</sheetData><autoFilter ref="A'+headerRow+':J'+(r-1)+'"/><mergeCells count="'+merges.length+'">'+merges.map(ref=>'<mergeCell ref="'+ref+'"/>').join('')+'</mergeCells><pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" paperSize="9" fitToWidth="1" fitToHeight="0"/></worksheet>';
 const font=(size,color,bold)=>'<font><sz val="'+size+'"/><color rgb="FF'+color+'"/><name val="Ubuntu"/><family val="2"/>'+(bold?'<b/>':'')+'</font>';
 const xf=(font,fill)=>'<xf numFmtId="0" fontId="'+font+'" fillId="'+fill+'" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>';
 files['xl/styles.xml']=XML+'<styleSheet xmlns="'+ns+'"><fonts count="3">'+font(12,'17303B',false)+font(12,'FFFFFF',true)+font(18,'17303B',true)+'</fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF306C47"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEFF5F0"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border/><border>'+['left','right','top','bottom'].map(x=>'<'+x+' style="thin"><color rgb="FFD7E1DC"/></'+x+'>').join('')+'<diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4">'+xf(0,0)+xf(1,2)+xf(2,0)+xf(0,3)+'</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
 files['[Content_Types].xml']=types([['xl/workbook.xml','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'],['xl/worksheets/sheet1.xml','application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml'],['xl/styles.xml','application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml'],['docProps/core.xml','application/vnd.openxmlformats-package.core-properties+xml']]);
 return files;
}
const A=NS+'drawingml/2006/main',PN=NS+'presentationml/2006/main';
function wrap(text,max){
 const limit=max*.55,out=[];
 for(const paragraph of String(text).replace(/\r\n?/g,'\n').split('\n')){
  let line='',width=0;
  for(const word of paragraph.split(/\s+/).filter(Boolean)){
   const wordWidth=Array.from(word).reduce((n,c)=>n+charWidth(c),0);
   if(line&&width+charWidth(' ')+wordWidth>limit){out.push(line);line='';width=0;}
   if(line){line+=' ';width+=charWidth(' ');}
   for(const c of word){const cw=charWidth(c);if(line&&width+cw>limit){out.push(line);line='';width=0;}line+=c;width+=cw;}
  }
  if(line||!paragraph.trim())out.push(line);
 }
 return out.length?out:[''];
}
function slidesFor(m){
 const slides=[],cover=[{text:m.title,bold:true},...wrap('Tila: '+m.status,78).map(text=>({text})),{text:'Toimenpiteitä: '+m.actions.length}];
 if(m.decision)cover.push(...wrap('Päätös: '+m.decision,78).map(text=>({text})));
 if(m.date)cover.push({text:'Päätöspäivä: '+m.date});
 // Titles and arbitrary metadata may be long: paginate them as editable text too.
 const coverLines=cover.flatMap(p=>wrap(p.text,78).map(text=>({...p,text})));
 for(let at=0;at<coverLines.length;at+=13)slides.push({title:'Ilmastosuunnitelman toimenpiteet',lines:coverLines.slice(at,at+13),section:'Suunnitelma'});
 m.actions.forEach((p,i)=>{
  const titleLines=wrap(p.title,44),longTitle=titleLines.length>2,title=longTitle?'Toimenpide '+(i+1):titleLines.join('\n');
  const blocks=(longTitle?[['Toimenpiteen nimi','title'],...fields]:fields).map(([label,k])=>['theme','owner','schedule','costBand'].includes(k)?wrap(label+': '+value(p,k),78).map(text=>({text,bold:false})):[{text:label,bold:true},...wrap(value(p,k),78).map(text=>({text,bold:false}))]);
  const pages=[];let page=[];
  for(const block of blocks){
   if(page.length&&(block.length<=13?block.length>13-page.length:13-page.length<3)){pages.push(page);page=[];}
   for(const line of block){if(page.length===13){pages.push(page);page=[];}page.push(line);}
   if(block.length>2&&page.length<13)page.push({text:''});
  }
  if(page.length)pages.push(page);
  pages.forEach((lines,j)=>slides.push({title,lines,section:'Toimenpide '+(i+1)+' / '+m.actions.length+' · Osa '+(j+1)+' / '+pages.length}));
 });
 return slides;
}
function pptx(m){
 const emu=n=>Math.round(n*12700);
 const group='<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
 const shape=(id,name,x,y,w,h,lines,size,color)=>'<p:sp><p:nvSpPr><p:cNvPr id="'+id+'" name="'+name+'"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="'+emu(x)+'" y="'+emu(y)+'"/><a:ext cx="'+emu(w)+'" cy="'+emu(h)+'"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="none" lIns="0" rIns="0" tIns="0" bIns="0" anchor="t"/><a:lstStyle/>'+lines.map(p=>'<a:p><a:pPr><a:lnSpc><a:spcPts val="'+Math.round(size*1.3*100)+'"/></a:lnSpc><a:spcAft><a:spcPts val="0"/></a:spcAft></a:pPr><a:r><a:rPr lang="fi-FI" sz="'+size*100+'" b="'+(p.bold?'1':'0')+'"><a:solidFill><a:srgbClr val="'+color+'"/></a:solidFill><a:latin typeface="Ubuntu"/></a:rPr><a:t>'+X(p.text)+'</a:t></a:r><a:endParaRPr lang="fi-FI" sz="'+size*100+'"/></a:p>').join('')+'</p:txBody></p:sp>';
 const slides=slidesFor(m),files=baseFiles(m.title,'ppt/presentation.xml');
 const overrides=[['ppt/presentation.xml','application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'],['ppt/slideMasters/slideMaster1.xml','application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml'],['ppt/slideLayouts/slideLayout1.xml','application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml'],['ppt/theme/theme1.xml','application/vnd.openxmlformats-officedocument.theme+xml'],['docProps/core.xml','application/vnd.openxmlformats-package.core-properties+xml']];
 files['ppt/presentation.xml']=XML+'<p:presentation xmlns:a="'+A+'" xmlns:r="'+R.slice(0,-1)+'" xmlns:p="'+PN+'"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>'+slides.map((s,i)=>'<p:sldId id="'+(256+i)+'" r:id="rId'+(i+2)+'"/>').join('')+'</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>';
 files['ppt/_rels/presentation.xml.rels']=rels([['rId1',R+'slideMaster','slideMasters/slideMaster1.xml'],...slides.map((s,i)=>['rId'+(i+2),R+'slide','slides/slide'+(i+1)+'.xml'])]);
 slides.forEach((s,i)=>{
  const path='ppt/slides/slide'+(i+1)+'.xml';overrides.push([path,'application/vnd.openxmlformats-officedocument.presentationml.slide+xml']);
  files[path]=XML+'<p:sld xmlns:a="'+A+'" xmlns:r="'+R.slice(0,-1)+'" xmlns:p="'+PN+'"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree>'+group+shape(2,'Otsikko',48,45,864,90,s.title.split('\n').map(text=>({text,bold:true})),30,'17303B')+shape(3,'Toimenpiteen tiedot',48,148,864,330,s.lines,18,'17303B')+shape(4,'Sivun tiedot',48,507,864,22,[{text:'Ilmastovisio · '+s.section+' · Dia '+(i+1)+' / '+slides.length}],12,'3F5058')+'</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>';
  files['ppt/slides/_rels/slide'+(i+1)+'.xml.rels']=rels([['rId1',R+'slideLayout','../slideLayouts/slideLayout1.xml']]);
 });
 files['ppt/slideMasters/slideMaster1.xml']=XML+'<p:sldMaster xmlns:a="'+A+'" xmlns:r="'+R.slice(0,-1)+'" xmlns:p="'+PN+'"><p:cSld name="Ilmastovisio"><p:spTree>'+group+'</p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>';
 files['ppt/slideMasters/_rels/slideMaster1.xml.rels']=rels([['rId1',R+'slideLayout','../slideLayouts/slideLayout1.xml'],['rId2',R+'theme','../theme/theme1.xml']]);
 files['ppt/slideLayouts/slideLayout1.xml']=XML+'<p:sldLayout xmlns:a="'+A+'" xmlns:r="'+R.slice(0,-1)+'" xmlns:p="'+PN+'" type="blank" preserve="1"><p:cSld name="Tyhjä"><p:spTree>'+group+'</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>';
 files['ppt/slideLayouts/_rels/slideLayout1.xml.rels']=rels([['rId1',R+'slideMaster','../slideMasters/slideMaster1.xml']]);
 const solid='<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>';
 files['ppt/theme/theme1.xml']=XML+'<a:theme xmlns:a="'+A+'" name="Ilmastovisio"><a:themeElements><a:clrScheme name="Ilmastovisio">'+Object.entries({dk1:'17303B',lt1:'FFFFFF',dk2:'3F5058',lt2:'EFF5F0',accent1:'306C47',accent2:'235538',accent3:'17303B',accent4:'52616A',accent5:'D7E1DC',accent6:'EFF5F0',hlink:'235538',folHlink:'306C47'}).map(([k,v])=>'<a:'+k+'><a:srgbClr val="'+v+'"/></a:'+k+'>').join('')+'</a:clrScheme><a:fontScheme name="Ubuntu">'+['major','minor'].map(k=>'<a:'+k+'Font><a:latin typeface="Ubuntu"/><a:ea typeface=""/><a:cs typeface="Arial"/></a:'+k+'Font>').join('')+'</a:fontScheme><a:fmtScheme name="Ilmastovisio"><a:fillStyleLst>'+solid.repeat(3)+'</a:fillStyleLst><a:lnStyleLst>'+[6350,12700,19050].map(w=>'<a:ln w="'+w+'">'+solid+'<a:prstDash val="solid"/></a:ln>').join('')+'</a:lnStyleLst><a:effectStyleLst>'+('<a:effectStyle><a:effectLst/></a:effectStyle>').repeat(3)+'</a:effectStyleLst><a:bgFillStyleLst>'+solid.repeat(3)+'</a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>';
 files['[Content_Types].xml']=types(overrides);return files;
}
function create(format,state,core){
 const m=prepare(state,core),builder={docx,xlsx,pptx}[format];if(!builder)throw Error('Tuntematon tiedostomuoto.');
 return {data:zip(builder(m)),mime:mime[format],name:'ilmastotoimenpiteet-'+state.year+'.'+format};
}
const api={create,prepare,docx,xlsx,pptx,slidesFor,zip,wrap,charWidth};global.ClimateOffice=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
