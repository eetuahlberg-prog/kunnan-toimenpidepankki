"""Read XLSX XML and Liperi PDF tables without modifying original sources."""
import json,re,zipfile,xml.etree.ElementTree as ET
from pathlib import Path
from collections import Counter
import pdfplumber
ROOT=Path(__file__).resolve().parent
UPLOAD=ROOT.parent/'upload'
NS={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
XLSX='Kuntien toimenpiteet(1).xlsx'
PDF='Kestavan-kehityksen-ohjelma-2022-2030-laaja-versio(1).pdf'
MUNICIPALITIES=['Heinävesi','Juuka','Kitee','Kontiolahti','Lieksa','Nurmes','Rääkkylä','Tohmajärvi']
fields=['Otsikko','Kuvaus','Kunta','Toteutusvaihe','Teema','Toteutusajankohta','Vastuutaho','Tehtävät']
z=zipfile.ZipFile(UPLOAD/XLSX)
strings=[''.join(e.itertext()) for e in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',NS)]
data=[];excluded=[]
for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('s:sheetData/s:row',NS):
 vals=['']*8
 for c in row.findall('s:c',NS):
  index=ord(re.match('[A-Z]+',c.attrib['r'])[0])-ord('A')
  if index>=8:continue
  v=c.find('s:v',NS);v=v.text if v is not None else ''
  vals[index]=strings[int(v)] if c.attrib.get('t')=='s' else v
 n=int(row.attrib['r'])
 if vals[2] not in MUNICIPALITIES:
  assert vals[0] in ['Toimenpiteet – Ilmastopolku','Otsikko',''],(n,vals)
  excluded.append({'row':n,'reason':'Toistuva taulukon otsikko' if vals[0].startswith('Toimenpiteet') else 'Toistuva sarakeotsikkorivi','values':vals})
  continue
 assert vals[0]
 data.append({'id':f'xls-{n:03}','municipality':vals[2],'title':vals[0],'description':vals[1],'theme':vals[4],'status':vals[3] or 'Tarkistettava','schedule':vals[5],'owner':vals[6],'tasks':vals[7],'source':{'file':XLSX,'sheet':'Sheet1','row':n},'original':dict(zip(fields,vals))})
assert len(data)==464,len(data)
# Each group is a single six-column table carried across physical PDF pages.
groups=[(6,7,'Maankäyttö'),(8,9,'Liikenne'),(10,11,'Kiertotalous'),(12,14,'Palvelut ja hankinnat'),(15,17,'Energia'),(18,18,'Maatalous'),(20,20,'Opetus ja kasvatus'),(21,23,'Tiedotus ja viestintä')]
pdf=pdfplumber.open(UPLOAD/PDF)
liperi=[]
for first,last,theme in groups:
 firstwords=pdf.pages[first-1].extract_words()
 headers=[w for w in firstwords if w['text'] in ['TOIMENPIDE','TAVOITTEET','MITTARIT','VASTUUTAHO','AIKATAULU','SEURANNAN']]
 top=min(w['top'] for w in headers)
 starts=sorted(w['x0'] for w in headers if abs(w['top']-top)<2)
 assert len(starts)==6,(first,starts)
 current=None
 for page_number in range(first,last+1):
  page=pdf.pages[page_number-1]
  words=page.extract_words()
  bottom=min([w['top'] for w in words if w['text']=='SEURANTA']+[page.height-40])
  min_top=top+30 if page_number==first else 0
  tablewords=[w for w in words if min_top<w['top']<bottom and w['x0']>=starts[0]-2 and not (w['text']==str(page_number-1) and w['x0']>700 and w['top']>500)]
  rows=[]
  for w in tablewords:
   if not rows or abs(w['top']-rows[-1][0]['top'])>3:rows.append([w])
   else:rows[-1].append(w)
  for line in rows:
   line.sort(key=lambda w:w['x0'])
   if re.match(r'^\d+\.$',line[0]['text']) and line[0]['x0']<starts[1]-10:
    number=int(line[0]['text'][:-1]);assert 1<=number<=33
    current={'number':number,'theme':theme,'pages':[page_number],'cells':[[] for _ in range(6)]}
    liperi.append(current)
   assert current is not None,(page_number,line)
   if page_number not in current['pages']:current['pages'].append(page_number)
   for w in line:
    col=max(i for i,start in enumerate(starts) if w['x0']>=start-3)
    current['cells'][col].append(w['text'])
assert [a['number'] for a in liperi]==list(range(1,34))
for a in liperi:
 cells=[' '.join(c).strip() for c in a['cells']]
 # Preserve table wording; join soft-hyphenated PDF words only when Unicode soft hyphen appears.
 cells=[s.replace('\u00ad ','').replace('\u00ad','') for s in cells]
 title=re.sub(r'^\d+\.\s*','',cells[0])
 orig=dict(zip(['Toimenpide','Tavoitteet','Mittarit','Vastuutaho','Aikataulu','Seurannan vastuutaho'],cells))
 orig['Numero']=a['number'];orig['Teema']=a['theme'];orig['Toteutusvaihe']=None
 data.append({'id':f'liperi-{a["number"]:02}','municipality':'Liperi','title':title,'description':cells[1],'theme':a['theme'],'status':'Tarkistettava','schedule':cells[4],'owner':cells[3],'tasks':'','metric':cells[2],'monitoringOwner':cells[5],'source':{'file':PDF,'page':a['pages'][0],'pages':a['pages'],'printedPages':[p-1 for p in a['pages']],'actionNumber':a['number']},'original':orig})
assert len(data)==497
assert len(set(d['id'] for d in data))==497
(ROOT/'data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
audit={'total':len(data),'excelActions':464,'liperiActions':33,'municipalities':dict(sorted(Counter(d['municipality'] for d in data).items())),'excelExcludedRows':excluded,'statusCounts':dict(Counter(d['status'] for d in data)),'notes':['Excelin alkuperäisiä kenttiä ei ole korjattu. Myös mahdolliset lähdeaineiston virheet säilyvät.','Liperin PDF:n rivinvaihdot on yhdistetty välilyönneillä. Alkuperäiset kuusi saraketta säilyvät original-kentässä.','Liperin toteutusvaihe puuttuu vuoden 2022 ohjelmasta: kaikki 33 merkitty tarkistettaviksi.','Liperin source.page tarkoittaa PDF:n fyysistä sivua; painettu sivunumero on yhtä pienempi.','Aikataulu Jatkuva ei muuta lähteen toteutusvaihetta.']}
(ROOT/'data-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in audit.items() if k!='excelExcludedRows'},ensure_ascii=False,indent=2))
for d in data[-33:]: print(d['id'],d['title'],'|',d['owner'],'|',d['schedule'])
