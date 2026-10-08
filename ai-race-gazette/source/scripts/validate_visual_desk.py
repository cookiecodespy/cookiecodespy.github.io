"""Validate AI Race Gazette Visual Desk metadata against the archive."""
import json
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
MANIFEST=ROOT/'visual/asset-manifest.json'
QUEUE=ROOT/'visual/image-queue.json'

ALLOWED_KINDS={'editorial-illustration','diagram','official-image'}
ALLOWED_ORIGINS={'generated-ai','official','editorial-original'}
ALLOWED_SPECIFICITY={'generic','category','company-family','story-specific'}
ALLOWED_STATUS={'legacy-unclassified','library','needs-specific-art','specific'}
ALLOWED_QUEUE={'needs-art-direction','brief-ready','in-production','qa','complete'}

def main():
    news=json.loads(NEWS.read_text(encoding='utf-8'))
    manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))
    queue=json.loads(QUEUE.read_text(encoding='utf-8'))

    assert manifest.get('schemaVersion')==1
    assets=manifest.get('assets')
    assert isinstance(assets,list) and assets
    ids=set()
    srcs=set()
    by_src={}
    for asset in assets:
        aid=asset.get('id')
        src=asset.get('src')
        assert isinstance(aid,str) and aid and aid not in ids
        assert isinstance(src,str) and src.startswith('assets/') and src not in srcs
        ids.add(aid); srcs.add(src); by_src[src]=asset
        assert asset.get('kind') in ALLOWED_KINDS
        assert asset.get('origin') in ALLOWED_ORIGINS
        assert asset.get('specificity') in ALLOWED_SPECIFICITY
        assert isinstance(asset.get('tags'),list) and asset['tags']
        assert isinstance(asset.get('canonicalCredit'),str) and asset['canonicalCredit'].strip()
        file_path=ROOT/'public'/src
        assert file_path.is_file(), f'Manifest asset missing: {src}'

    usage=Counter(a['image'] for a in news['articles'])
    for article in news['articles']:
        assert article['image'] in by_src, f"Unregistered article image: {article['image']}"
        assert article.get('imageStatus','legacy-unclassified') in ALLOWED_STATUS
        asset=by_src[article['image']]
        allowed={asset['canonicalCredit'],*asset.get('legacyCredits',[])}
        assert article['imageCredit'] in allowed, f"Unregistered credit for {article['id']}"
        if article.get('imageStatus')=='needs-specific-art':
            assert isinstance(article.get('imageBrief'),str) and article['imageBrief'].strip(), f"{article['id']} needs imageBrief"

    for src,count in usage.items():
        assert by_src[src]['currentUsage']==count, f"Manifest usage stale for {src}"

    assert queue.get('schemaVersion')==1
    items=queue.get('items')
    assert isinstance(items,list)
    article_ids={a['id'] for a in news['articles']}
    queue_ids=[i['articleId'] for i in items]
    assert len(queue_ids)==len(set(queue_ids))
    assert set(queue_ids)<=article_ids
    for item in items:
        assert item['productionStatus'] in ALLOWED_QUEUE
        assert item['currentImage'] in by_src
        assert item['currentAssetId']==by_src[item['currentImage']]['id']
        assert item['currentReuseCount']==usage[item['currentImage']]
        assert item['queuePriority'] in {'P0','P1','P2','P3'}
        assert item['desiredOutput'].startswith(f"assets/news/{item['date']}/")
        assert isinstance(item['brief'],str) and len(item['brief'].strip())>40

    print(f"visual desk OK: {len(assets)} registered assets; {len(items)} queued stories; {usage.most_common(1)[0][1]} max reuse")

if __name__=='__main__':
    main()
