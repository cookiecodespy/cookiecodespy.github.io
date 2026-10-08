"""Refresh Visual Desk from the live archive without changing editorial content.

Preserve per-story production metadata across refreshes. Entirely deterministic:
unchanged news + manifest + queue yields byte-for-byte identical output.
"""
import json
from collections import Counter
from copy import deepcopy
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
MANIFEST=ROOT/'visual/asset-manifest.json'
QUEUE=ROOT/'visual/image-queue.json'
ART_DIRECTION=("Grabado editorial de prensa antigua, tinta negra y sepia sobre papel envejecido, "
               "composición tecnológica narrativa, alto detalle, sin texto incrustado, sin logotipos falsos, "
               "sin interfaz inventada presentada como real, sin apariencia de fotografía documental.")

def priority(article,reuse):
    if article.get('imageStatus')=='needs-specific-art': return 'P0'
    if reuse>=20: return 'P1'
    if reuse>=5: return 'P2'
    return 'P3'

def refresh(news,manifest,old_queue):
    manifest=deepcopy(manifest)
    old_queue=deepcopy(old_queue)
    old={i['articleId']:i for i in old_queue.get('items',[])}
    usage=Counter(a['image'] for a in news['articles'])
    by_src={a['src']:a for a in manifest['assets']}
    for asset in manifest['assets']:
        asset['currentUsage']=usage.get(asset['src'],0)
    items=[]
    for article in news['articles']:
        image=article['image']
        asset=by_src.get(image)
        if asset is None: raise ValueError(f"Unregistered image for {article['id']}: {image}")
        previous=old.get(article['id'],{})
        specific=article.get('imageStatus')=='specific'
        status='complete' if specific else previous.get('productionStatus')
        if status in (None,'complete'):
            status='brief-ready' if article.get('imageBrief') else 'needs-art-direction'
        brief=(article.get('imageBrief') or previous.get('brief') or
            f"Crear una ilustración específica para “{article['title']}”. "
            f"El foco visual debe representar {article.get('product') or 'la novedad'} de {article['company']} "
            f"y la idea central del informe, sin convertir metáforas en hechos. {ART_DIRECTION}")
        fresh={
          'articleId':article['id'],
          'eventKey':article.get('eventKey',article['id']),
          'date':article['date'],
          'company':article['company'],
          'product':article.get('product'),
          'title':article['title'],
          'currentImage':image,
          'currentAssetId':asset['id'],
          'currentReuseCount':usage[image],
          'articleImageStatus':article.get('imageStatus','legacy-unclassified'),
          'queuePriority':priority(article,usage[image]),
          'productionStatus':status,
          'desiredType':previous.get('desiredType','editorial-illustration'),
          'desiredOutput':previous.get('desiredOutput') if previous.get('date')==article['date'] else None,
          'brief':brief,
          'sourceSummary':article['summary'],
          'artDirection':previous.get('artDirection',ART_DIRECTION),
          'outputSpec':previous.get('outputSpec',{'format':'webp','preferredWidth':1600,'aspectRatio':'3:2','safeCenterCrop':True}),
          'publishRule':previous.get('publishRule','No sustituir el fallback hasta revisar coherencia factual, legibilidad, crédito y ausencia de elementos engañosos.')
        }
        fresh['desiredOutput']=fresh['desiredOutput'] or f"assets/news/{article['date']}/{article['id']}.webp"
        item={**previous,**fresh}
        if not specific:
            for field in ('completedAt','completedAssetId','producedBy'):
                item.pop(field,None)
        items.append(item)
    order={'P0':0,'P1':1,'P2':2,'P3':3}
    items.sort(key=lambda i:(order[i['queuePriority']],i['date'],i['articleId']))
    queue={
      **{k:v for k,v in old_queue.items() if k not in ('items','generatedAt','generatedFromNewsUpdatedAt')},
      'schemaVersion':1,
      'generatedFromNewsUpdatedAt':news['updatedAt'],
      'generatedAt':news['updatedAt'][:10],
      'purpose':old_queue.get('purpose','Cola del Visual Desk: no bloquea Newsroom ni reemplaza investigación.'),
      'statusDefinitions':old_queue.get('statusDefinitions',{
        'needs-art-direction':'Requiere dirección visual',
        'brief-ready':'Brief listo',
        'in-production':'En producción',
        'qa':'Pendiente de aprobación',
        'complete':'Arte específico aprobado y enlazado',
      }),
      'items':items
    }
    return manifest,queue

def save_if_changed(path,doc):
    desired=json.dumps(doc,ensure_ascii=False,indent=2)+'\n'
    if not path.exists() or path.read_text(encoding='utf-8')!=desired:
        path.write_text(desired,encoding='utf-8')
        return True
    return False

def main():
    news=json.loads(NEWS.read_text(encoding='utf-8'))
    manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))
    old=json.loads(QUEUE.read_text(encoding='utf-8')) if QUEUE.exists() else {'items':[]}
    manifest,queue=refresh(news,manifest,old)
    changed=save_if_changed(MANIFEST,manifest)|save_if_changed(QUEUE,queue)
    print(f"Visual queue {'updated' if changed else 'already current'}: {len(queue['items'])} articles")

if __name__=='__main__': main()
