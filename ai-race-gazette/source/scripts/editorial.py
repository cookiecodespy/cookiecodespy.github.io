"""Validate the archive and generate RSS without dependencies or API keys."""
import argparse
import json
import re
from pathlib import Path
from datetime import date, datetime, timezone
from email.utils import format_datetime
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NEWS = ROOT/'public/data/news.json'
SITE = 'https://cookiecodespy.github.io/ai-race-gazette/'
OFFICIAL = {'mistral.ai','docs.mistral.ai','openai.com','developers.openai.com','blog.google','deepmind.google','ai.google.dev','anthropic.com','claude.com','microsoft.com','blogs.microsoft.com','nvidianews.nvidia.com','blogs.nvidia.com','ai.meta.com','about.fb.com','huggingface.co','research.google','github.com','x.ai'}

def validate(data):
    assert data['schemaVersion'] == 1, 'Unsupported schema'
    datetime.fromisoformat(data['updatedAt'].replace('Z','+00:00'))
    start = date.fromisoformat(data['coverageStart'])
    ids, urls = set(), set()
    for a in data['articles']:
        assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',a['id']), 'Invalid slug'
        assert a['id'] not in ids, 'Duplicate id: '+a['id']
        ids.add(a['id'])
        assert start <= date.fromisoformat(a['date']) <= date.today(), 'Invalid coverage date'
        assert date.fromisoformat(a['verifiedAt']) <= date.today(), 'Future verification'
        for key in ['company','title','summary','imageAlt','imageCredit','analysis','watch']:
            assert isinstance(a[key],str) and a[key].strip(), f'Missing {key}'
        for key in ['tags','body','keyPoints']:
            assert isinstance(a[key],list) and a[key] and all(isinstance(p,str) and p.strip() for p in a[key]), f'Missing {key}'
        assert len(a['body']) >= 2, 'An article needs developed context'
        image = ROOT/'public'/a['image']
        assert image.resolve().is_relative_to((ROOT/'public/assets').resolve()) and image.is_file(), 'Missing/unsafe image'
        for source in [a['source'], *a.get('relatedSources',[])]:
            u = urlparse(source['url'])
            host = (u.hostname or '').removeprefix('www.')
            assert u.scheme == 'https' and not u.username and not u.password, 'Unsafe source URL'
            assert host in OFFICIAL or any(host.endswith('.'+h) for h in OFFICIAL if h != 'github.com'), 'Review source domain: '+host
            assert source['name'].strip(), 'Missing source attribution'
        assert a['source']['url'] not in urls, 'Duplicate source; update existing article'
        urls.add(a['source']['url'])
        if a['source'].get('publishedAt'):
            assert date.fromisoformat(a['source']['publishedAt']) <= date.today(), 'Future publication'
    return data

def feed(data):
    rss = ET.Element('rss',version='2.0')
    channel = ET.SubElement(rss,'channel')
    for k,v in [('title','AI Race Gazette'),('link',SITE),('description','Noticias de IA y tecnología, con contexto y fuentes oficiales.'),('language','es-cl')]:
        ET.SubElement(channel,k).text=v
    for a in sorted(data['articles'],key=lambda a:(a['date'],a['id']),reverse=True):
        item = ET.SubElement(channel,'item')
        for k,v in [('title',a['title']),('link',SITE+'#articulo/'+a['id']),('description',a['summary']),('guid',SITE+'#articulo/'+a['id']),('pubDate',format_datetime(datetime.fromisoformat(a['date']+'T12:00:00+00:00')))]:
            ET.SubElement(item,k).text=v
        ET.SubElement(item,'source',url=a['source']['url']).text=a['source']['name']
    ET.indent(rss)
    ET.ElementTree(rss).write(ROOT/'public/feed.xml',encoding='utf-8',xml_declaration=True)

if __name__ == '__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--validate-only',action='store_true');args=parser.parse_args()
    data=validate(json.loads(NEWS.read_text(encoding='utf-8')))
    if not args.validate_only: feed(data)
    print(f"Validated {len(data['articles'])} articles; " + ('no files changed' if args.validate_only else 'RSS generated'))
