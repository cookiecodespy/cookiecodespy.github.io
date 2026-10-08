"""Validate Visual Desk assets while tolerating asynchronous Newsroom additions.

Visual metadata is a snapshot. Reporter V2 may add new articles hourly,
while Visual Desk refreshes its production queue in separate non-hourly commits.
"""
import argparse
import json
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
MANIFEST=ROOT/'visual/asset-manifest.json'
QUEUE=ROOT/'visual/image-queue.json'

KINDS={'editorial-illustration','diagram','official-image'}
ORIGINS={'generated-ai','official','editorial-original'}
SPECIFICITY={'generic','category','company-family','story-specific'}
VISUAL_STATUS={'legacy-unclassified','library','needs-specific-art','specific'}
QUEUE_STATUS={'needs-art-direction','brief-ready','in-production','qa','complete'}

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--strict',action='store_true',help='Fail if queue/usage is behind news.json')
    args=parser.parse_args()
    news=json.loads(NEWS.read_text(encoding='utf-8'))
    manifest=json.loads(MANIFEST.read_text(encoding='utf-8'))
    queue=json.loads(QUEUE.read_text(encoding='utf-8'))
    assert manifest.get('schemaVersion')==1
    assert queue.get('schemaVersion')==1
    articles=news['articles']
    assets=manifest['assets']
    assert assets and isinstance(queue.get('items'),list)
    ids=set();paths=set();by_src={}
    for a in assets:
        aid=a['id'];src=a['src']
        assert aid and aid not in ids, f'Duplicate asset ID: {aid}'
        assert src.startswith('assets/') and src not in paths, f'Duplicate/unsafe asset: {src}'
        ids.add(aid);paths.add(src);by_src[src]=a
        assert a['kind'] in KINDS and a['origin'] in ORIGINS and a['specificity'] in SPECIFICITY
        assert a['canonicalCredit'].strip() and a['tags']
        assert (ROOT/'public'/src).is_file(), f'Missing asset: {src}'
        if a['origin']=='official':
            assert str(a.get('sourceUrl','')).startswith('https://')
            assert a.get('licenseNote'), f'Official image has no license note: {aid}'
    usage=Counter(a['image'] for a in articles)
    for a in articles:
        asset=by_src.get(a['image'])
        assert asset is not None, f"Unregistered hero for {a['id']}"
        assert a.get('imageStatus','legacy-unclassified') in VISUAL_STATUS
        assert a['imageCredit'] in {asset['canonicalCredit'],*asset.get('legacyCredits',[])},f"Credit mismatch for {a['id']}"
        if a.get('imageStatus')=='needs-specific-art':
            assert a.get('imageBrief'), f"Missing imageBrief for {a['id']}"
        if a.get('visualAssetId'):
            assert a['visualAssetId']==asset['id'], f"Visual asset mismatch for {a['id']}"
        if a.get('imageStatus')=='specific':
            assert asset['specificity']=='story-specific', f"Non-specific hero for {a['id']}"
    items=queue['items']
    qids=[i['articleId'] for i in items]
    assert len(qids)==len(set(qids)), 'Duplicate queue article IDs'
    articles_by_id={a['id']:a for a in articles}
    snapshot_fresh=queue.get('generatedFromNewsUpdatedAt')==news['updatedAt']
    if args.strict or snapshot_fresh:
        assert set(qids)==set(articles_by_id), 'Visual queue missing/extra stories (refresh required)'
        for asset in assets:
            assert asset.get('currentUsage',0)==usage.get(asset['src'],0),f"Outdated usage for {asset['src']}"
    for i in items:
        assert i['queuePriority'] in {'P0','P1','P2','P3'}
        assert i['productionStatus'] in QUEUE_STATUS
        assert i['currentAssetId'] in ids
        assert i['currentImage'] in by_src
        assert isinstance(i.get('brief'),str) and len(i['brief'].strip())>40
        assert i['desiredOutput'].startswith(f"assets/news/{i['date']}/")
        if snapshot_fresh or args.strict:
            article=articles_by_id[i['articleId']]
            assert i['currentImage']==article['image']
            assert i['currentAssetId']==by_src[article['image']]['id']
            assert i['currentReuseCount']==usage[article['image']]
            if article.get('imageStatus')=='specific':
                assert i['productionStatus']=='complete'
    suffix='' if snapshot_fresh else ' (non-blocking: queue snapshot older than Newsroom)'
    print(f"visual desk OK: {len(assets)} assets, {len(items)} queued, {len(articles)} articles{suffix}")

if __name__=='__main__':
    main()
