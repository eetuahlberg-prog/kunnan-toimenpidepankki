from pathlib import Path
import json,base64,argparse
parser=argparse.ArgumentParser()
parser.add_argument('--inline-output',type=Path,help='Optional inline preview fragment path')
args=parser.parse_args()
P=Path(__file__).resolve().parent
assets=P/'assets'
def uri(name,mime):return 'data:'+mime+';base64,'+base64.b64encode((assets/name).read_bytes()).decode()
css=(P/'app.css').read_text(encoding='utf-8').replace('__FONT__',uri('ubuntu.woff','font/woff'))
shell=(P/'shell.html').read_text(encoding='utf-8').replace('__MKL__',uri('maakuntaliitto.png','image/png')).replace('__EU__',uri('eu.png','image/png')).replace('__PROJECT__',uri('ilmastovisio.png','image/png')).replace('__HERO__',uri('lake-hero.jpg','image/jpeg'))
data=json.loads((P/'data.json').read_text(encoding='utf-8'))
supplemental=json.loads((P/'supplemental.json').read_text(encoding='utf-8'))
# Generalized display copy only. Raw source text stays in the packaged JSON files.
editorial=json.loads((P/'editorial.json').read_text(encoding='utf-8'))
def generalize(records):
 result=[]
 for a in records:
  e=editorial[a['id']]
  result.append(dict(id=a['id'],title=e['title'],description=e.get('description',''),theme=a.get('theme',''),source=a.get('source',{}),isIdea=bool(a.get('isIdea')),generalized=True,municipality='',status='',owner='',schedule='',tasks=''))
 return result
data=generalize(data)
supplemental=generalize(supplemental)
payload=json.dumps(dict(consolidation=json.loads((P/'consolidation.json').read_text(encoding='utf-8')),data=data,supplemental=supplemental,models=json.loads((P/'models.json').read_text(encoding='utf-8')),sources=json.loads((P/'sources.json').read_text(encoding='utf-8'))),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
scripts='window.CLIMATE_DATA='+payload+';\n'+(P/'core.js').read_text(encoding='utf-8')+'\n'+(P/'proposal.js').read_text(encoding='utf-8')+'\n'+(P/'office-export.js').read_text(encoding='utf-8')+'\n'+(P/'app.js').read_text(encoding='utf-8')
fragment='<style>\n'+css+'\n</style>\n'+shell+'\n<script>\n'+scripts+'\n</script>\n'
assert len(fragment.encode())<1000000,len(fragment.encode())
(P/'dist').mkdir(exist_ok=True)
(P/'dist'/'index.html').write_text('<!doctype html>\n<html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ilmastosuunnitelman toimenpiteiden päivitys</title><meta name="description" content="Toimenpidepankki vaikutuksineen kuntien ilmastosuunnitelmien päivittämiseen."><style>body{margin:0;background:#fff}#climate-app{width:100%;max-width:none;margin:0;min-height:100vh}</style></head><body>'+fragment+'</body></html>',encoding='utf-8')
if args.inline_output:
 args.inline_output.write_text(fragment,encoding='utf-8')
print('Build:',len(fragment.encode()),'bytes;',len(data),'actions')
