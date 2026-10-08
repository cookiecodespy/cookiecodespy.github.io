"""Publish one approved Visual Desk image into the reproducible Gazette source tree.

This script DOES NOT generate images and DOES NOT push to GitHub.
It copies an approved WebP into source/public, updates both news JSON copies
plus the Visual Desk manifest/queue, then relies on normal validation/CI.
"""
import argparse
import json
import shutil
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
REPO_ROOT=ROOT.parent
PUBLIC=ROOT/'public'
SOURCE_NEWS=PUBLIC/'data/news.json'
ROOT_NEWS=REPO_ROOT/'data/news.json'
MANIFEST=ROOT/'visual/asset-manifest.json'
QUEUE=ROOT/'visual/image-queue.json'
CANONICAL_CREDIT='Ilustración editorial generada con IA · AI Race Gazette; no es una fotografía documental.'

def load(path):
    return json.loads(path.read_text(encoding='utf-8'))

def dump(path,data):
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def assert_webp(path):
    raw=path.read_bytes()[:16]
    assert len(raw)>=12 and raw[:4]==b'RIFF' and raw[8:12]==b'WEBP', f'Not a WebP file: {path}'

def validate_slug(value,label):
    assert value and all(c.islower() or c.isdigit() or c=='-' for c in value), f'Invalid {label}: {value}'

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--article-id',required=True)
    p.add_argument('--input',required=True,type=Path)
    p.add_argument('--asset-id',required=True)
    p.add_argument('--alt',required=True)
    p.add_argument('--credit',default=CANONICAL_CREDIT)
    p.add_argument('--caption')
    p.add_argument('--tags',default='')
    p.add_argument('--origin',choices=['generated-ai','official','editorial-original'],default='generated-ai')
    p.add_argument('--official-source')
    p.add_argument('--official-license-note')
    args=p.parse_args()

    validate_slug(args.article_id,'article id')
    validate_slug(args.asset_id,'asset id')
    assert args.input.is_file(), f'Missing input: {args.input}'
    assert_webp(args.input)
    assert args.alt.strip()
    assert args.credit.strip()
    if args.origin=='official':
        assert args.official_source and args.official_source.startswith('https://')
        assert args.official_license_note and args.official_license_note.strip()

    source_news=load(SOURCE_NEWS)
    root_news=load(ROOT_NEWS)
    assert source_news==root_news, 'news mirrors differ before visual publish'
    matches=[a for a in source_news['articles'] if a['id']==args.article_id]
    assert len(matches)==1, f'Article not found/duplicated: {args.article_id}'
    article=matches[0]

    manifest=load(MANIFEST)
    queue=load(QUEUE)
    assert not any(a['id']==args.asset_id for a in manifest['assets']), f'Asset id exists: {args.asset_id}'

    rel=f"assets/news/{article['date']}/{args.article_id}.webp"
    assert not any(a['src']==rel for a in manifest['assets']), f'Asset path exists: {rel}'
    dest=PUBLIC/rel
    dest.parent.mkdir(parents=True,exist_ok=True)
    assert not dest.exists(), f'Destination already exists: {dest}'
    shutil.copyfile(args.input,dest)

    article['image']=rel
    article['imageAlt']=args.alt.strip()
    article['imageCredit']=args.credit.strip()
    article['imageStatus']='specific'
    article['visualAssetId']=args.asset_id
    if article.get('media'):
        article['media']=[m for m in article['media'] if m.get('placement')!='hero']

    tags=[x.strip() for x in args.tags.split(',') if x.strip()]
    asset={
        'id':args.asset_id,
        'src':rel,
        'kind':'official-image' if args.origin=='official' else 'editorial-illustration',
        'origin':args.origin,
        'reusable':False,
        'specificity':'story-specific',
        'tags':tags or [article['company'].lower().replace(' ','-'), article.get('product','news').lower().replace(' ','-')[:60]],
        'canonicalCredit':args.credit.strip(),
        'legacyCredits':[],
        'currentUsage':1,
        'articleIds':[article['id']],
        'notes':'Story-specific hero approved by Visual Desk.'
    }
    if args.caption:
        asset['caption']=args.caption.strip()
    if args.origin=='official':
        asset['sourceUrl']=args.official_source
        asset['licenseNote']=args.official_license_note.strip()
    manifest['assets'].append(asset)

    usage=Counter(a['image'] for a in source_news['articles'])
    for item in manifest['assets']:
        item['currentUsage']=usage.get(item['src'],0)

    qmatch=[i for i in queue.get('items',[]) if i['articleId']==article['id']]
    assert len(qmatch)==1, f"Visual queue item missing/duplicated: {article['id']}"
    qi=qmatch[0]
    qi['currentImage']=rel
    qi['currentAssetId']=args.asset_id
    qi['currentReuseCount']=1
    qi['articleImageStatus']='specific'
    qi['productionStatus']='complete'
    qi['completedAssetId']=args.asset_id
    qi['completedAt']=source_news['updatedAt'][:10]

    for qi2 in queue.get('items',[]):
        if qi2['articleId']!=article['id']:
            qi2['currentReuseCount']=usage.get(qi2['currentImage'],0)

    dump(SOURCE_NEWS,source_news)
    dump(ROOT_NEWS,source_news)
    dump(MANIFEST,manifest)
    dump(QUEUE,queue)
    print(f'Published visual asset {args.asset_id} -> {rel} for {args.article_id}')

if __name__=='__main__':
    main()
