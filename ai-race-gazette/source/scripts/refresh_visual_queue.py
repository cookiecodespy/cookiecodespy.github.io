"""Refresh Visual Desk usage counts and story queue without changing news data."""
import json
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
MANIFEST=ROOT/'visual/asset-manifest.json'
QUEUE=ROOT/'visual/image-queue.json'

ART_DIRECTION=(
    "Grabado editorial de prensa antigua, tinta negra y sepia sobre papel envejecido, "
    "composición tecnológica narrativa, alto detalle, sin texto incrustado, sin logotipos falsos, "
    "sin interfaz inventada presentada como real, sin apariencia de fotografía documental."
)

def priority(article,reuse):
    if article.get('imageStatus')=='needs-specific-art':
        return 'P0'
    if reuse>=20:
        return 'P1'
    if reuse>=5:
        return 'P2'
    return 'P3'

def main():
    news=json.loads(NEWS.read_text(encoding='utf-8'))
    manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))
    old_queue=json.loads(QUEUE.read_text(encoding='utf-8')) if QUEUE.exists() else {'items':[]}
    old={i['articleId']:i for i in old_queue.get('items',[])}
    usage=Counter(a['image'] for a in news['articles'])
    by_src={a['src']:a for a in manifest['assets']}

    for asset in manifest['assets']:
        asset['currentUsage']=usage.get(asset['src'],0)

    items=[]
    for article in news['articles']:
        image=article['image']
        asset=by_src.get(image)
        if not asset:
            raise SystemExit(f'Unregistered image: {image}')
        previous=old.get(article['id'],{})
        has_brief=bool(article.get('imageBrief'))
        status=previous.get('productionStatus')
        if status=='complete' and article.get('imageStatus')!='specific':
            status=None
        if not status:
            status='complete' if article.get('imageStatus')=='specific' else ('brief-ready' if has_brief else 'needs-art-direction')
        brief=article.get('imageBrief') or previous.get('brief') or (
            f"Crear una ilustración específica para “{article['title']}”. "
            f"El foco visual debe representar {article.get('product') or 'la novedad'} de {article['company']} "
            f"y la idea central del informe, sin convertir metáforas en hechos. {ART_DIRECTION}"
        )
        items.append({
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
            'desiredOutput':previous.get('desiredOutput',f"assets/news/{article['date']}/{article['id']}.webp"),
            'brief':brief,
            'sourceSummary':article['summary'],
            'artDirection':previous.get('artDirection',ART_DIRECTION),
            'outputSpec':previous.get('outputSpec',{'format':'webp','preferredWidth':1600,'aspectRatio':'3:2','safeCenterCrop':True}),
            'publishRule':previous.get('publishRule','No sustituir el fallback hasta revisar coherencia factual, legibilidad, crédito y ausencia de elementos engañosos.')
        })

    order={'P0':0,'P1':1,'P2':2,'P3':3}
    items.sort(key=lambda i:(order[i['queuePriority']],i['date'],i['articleId']))
    queue={
        'schemaVersion':1,
        'generatedFromNewsUpdatedAt':news['updatedAt'],
        'generatedAt':news['updatedAt'][:10],
        'purpose':'Cola editorial del Visual Desk. No bloquea Newsroom y no es fuente factual.',
        'statusDefinitions':old_queue.get('statusDefinitions',{
            'needs-art-direction':'Brief automático preliminar; requiere revisión visual.',
            'brief-ready':'El artículo ya contiene un brief específico listo para producción.',
            'in-production':'Arte en generación/revisión.',
            'qa':'Arte generado pendiente de control editorial.',
            'complete':'Arte específico aprobado y enlazado.'
        }),
        'items':items
    }
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    QUEUE.write_text(json.dumps(queue,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f"Visual queue refreshed: {len(items)} stories; {sum(i['queuePriority']=='P0' for i in items)} P0; {sum(i['queuePriority']=='P1' for i in items)} P1")

if __name__=='__main__':
    main()
