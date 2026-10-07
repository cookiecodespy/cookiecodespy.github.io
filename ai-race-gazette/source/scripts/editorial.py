"""Validate the archive and generate RSS without dependencies or API keys."""
import argparse
import json
import re
from pathlib import Path
from datetime import date, datetime, timezone, timedelta
from email.utils import format_datetime
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NEWS = ROOT/'public/data/news.json'
SITE = 'https://cookiecodespy.github.io/ai-race-gazette/'
BLOCKED_HOSTS = {'localhost', '127.0.0.1', '0.0.0.0', '::1'}
ARTICLE_KINDS = {'report','technical','context','competition','analysis','practical'}
MEDIA_TYPES = {'editorial-illustration','diagram','official-image'}
IMAGE_STATUSES = {'specific','library','needs-specific-art'}

def _nonempty(value, label):
    assert isinstance(value,str) and value.strip(), f'Missing {label}'

def _string_list(value, label, allow_empty=False):
    assert isinstance(value,list), f'Invalid {label}'
    if not allow_empty:
        assert value, f'Missing {label}'
    assert all(isinstance(x,str) and x.strip() for x in value), f'Invalid {label}'

def _asset(path, label='image'):
    p = ROOT/'public'/path
    assert p.resolve().is_relative_to((ROOT/'public/assets').resolve()) and p.is_file(), f'Missing/unsafe {label}'

def _source(source):
    u = urlparse(source['url'])
    host = (u.hostname or '').lower().removeprefix('www.')
    assert u.scheme == 'https' and host and not u.username and not u.password, 'Unsafe source URL'
    assert host not in BLOCKED_HOSTS and not host.endswith('.local'), 'Unsafe source URL'
    _nonempty(source['name'],'source attribution')
    if source.get('publishedAt'):
        assert date.fromisoformat(source['publishedAt']) <= date.today(), 'Future publication'

def _article_words(a):
    parts=[a.get('title',''),a.get('summary',''),*a.get('body',[]),a.get('analysis',''),a.get('watch',''),a.get('executiveSummary',''),a.get('finalSummary',''),*a.get('quickTakeaways',[]),*a.get('limitations',[]),*a.get('practicalAdvice',[]),*a.get('usefulFacts',[]),*a.get('curiosities',[])]
    for section in a.get('sections',[]):
        parts.extend([section.get('heading',''),*section.get('paragraphs',[])])
    return len(re.findall(r'\b\w+\b',' '.join(x for x in parts if isinstance(x,str)),flags=re.UNICODE))

def _validate_v2(a):
    if 'articleVersion' not in a:
        return
    assert a['articleVersion'] == 2, 'Unsupported article version'
    _string_list(a.get('quickTakeaways'),'quickTakeaways')
    assert len(a['quickTakeaways']) >= 3, 'Reporter V2 needs at least 3 quick takeaways'
    _nonempty(a.get('executiveSummary'),'executiveSummary')
    _nonempty(a.get('finalSummary'),'finalSummary')
    assert _article_words(a) >= 500, 'Reporter V2 article is too short'

    for key in ['limitations','practicalAdvice','usefulFacts','curiosities']:
        if key in a:
            _string_list(a[key],key,allow_empty=True)

    if 'sections' in a:
        assert isinstance(a['sections'],list), 'Invalid sections'
        for section in a['sections']:
            assert isinstance(section,dict), 'Invalid section'
            _nonempty(section.get('heading'),'section heading')
            _string_list(section.get('paragraphs'),'section paragraphs')
            if section.get('kind') is not None:
                assert section['kind'] in ARTICLE_KINDS, 'Invalid section kind'

    for key in ['technicalDetails','pricing']:
        if key in a:
            assert isinstance(a[key],list), f'Invalid {key}'
            for row in a[key]:
                assert isinstance(row,dict), f'Invalid {key} row'
                _nonempty(row.get('label'),f'{key} label')
                _nonempty(row.get('value'),f'{key} value')
                if row.get('note') is not None:
                    _nonempty(row['note'],f'{key} note')

    if 'availability' in a:
        av=a['availability']
        assert isinstance(av,dict), 'Invalid availability'
        if av.get('status') is not None:
            _nonempty(av['status'],'availability status')
        for key in ['platforms','regions','requirements','notes']:
            if key in av:
                _string_list(av[key],f'availability {key}',allow_empty=True)

    if 'timeline' in a:
        assert isinstance(a['timeline'],list), 'Invalid timeline'
        for row in a['timeline']:
            assert isinstance(row,dict), 'Invalid timeline row'
            date.fromisoformat(row['date'])
            _nonempty(row.get('label'),'timeline label')
            if row.get('description') is not None:
                _nonempty(row['description'],'timeline description')

    if 'comparisons' in a:
        assert isinstance(a['comparisons'],list), 'Invalid comparisons'
        for row in a['comparisons']:
            assert isinstance(row,dict), 'Invalid comparison row'
            for key in ['subject','comparison','basis']:
                _nonempty(row.get(key),f'comparison {key}')
            if row.get('caveat') is not None:
                _nonempty(row['caveat'],'comparison caveat')

    for key in ['executiveSummary','finalSummary','imageBrief']:
        if key in a and a[key] is not None:
            _nonempty(a[key],key)

    if 'imageStatus' in a:
        assert a['imageStatus'] in IMAGE_STATUSES, 'Invalid imageStatus'

    if 'media' in a:
        assert isinstance(a['media'],list), 'Invalid media'
        for m in a['media']:
            assert isinstance(m,dict) and m.get('type') in MEDIA_TYPES, 'Invalid media item'
            _nonempty(m.get('src'),'media src')
            _nonempty(m.get('alt'),'media alt')
            _nonempty(m.get('credit'),'media credit')
            _asset(m['src'],'media')
            for key in ['caption','placement']:
                if m.get(key) is not None:
                    _nonempty(m[key],f'media {key}')

def validate(data):
    assert data['schemaVersion'] == 1, 'Unsupported schema'
    updated = datetime.fromisoformat(data['updatedAt'].replace('Z','+00:00'))
    assert updated.tzinfo and updated <= datetime.now(timezone.utc), 'Future/naive archive update'
    start = date.fromisoformat(data['coverageStart'])
    ids, events = set(), set()
    for a in data['articles']:
        assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',a['id']), 'Invalid slug'
        assert a['id'] not in ids, 'Duplicate id: '+a['id']
        ids.add(a['id'])
        event = a.get('eventKey',a['id'])
        assert isinstance(event,str) and re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',event), 'Invalid event key'
        assert event not in events, 'Duplicate event; update existing article: '+event
        events.add(event)
        assert start <= date.fromisoformat(a['date']) <= date.today(), 'Invalid coverage date'
        assert date.fromisoformat(a['verifiedAt']) <= date.today(), 'Future verification'
        for key in ['company','title','summary','imageAlt','imageCredit','analysis','watch']:
            _nonempty(a[key],key)
        for key in ['tags','body','keyPoints']:
            _string_list(a[key],key)
        assert len(a['body']) >= 2, 'An article needs developed context'
        _asset(a['image'])
        for source in [a['source'], *a.get('relatedSources',[])]:
            _source(source)
        if a.get('coveredAt'):
            assert date.fromisoformat(a['date']) <= date.fromisoformat(a['coveredAt']) <= date.today(), 'Invalid coverage timestamp'
        if a.get('announcedAt'):
            assert date.fromisoformat(a['announcedAt']) <= date.today(), 'Future announcement'
        _validate_v2(a)
    daily = data.get('dailyCoverage')
    if daily is not None:
        assert isinstance(daily,list) and daily, 'Missing dailyCoverage'
        allowed={'pending','partial','complete','reviewed-no-material-news'}
        article_counts={}
        for a in data['articles']:
            article_counts[a['date']]=article_counts.get(a['date'],0)+1
        seen=set()
        for row in daily:
            assert isinstance(row,dict), 'Invalid dailyCoverage row'
            d=date.fromisoformat(row['date'])
            assert start <= d <= date.today(), 'Invalid daily coverage date'
            assert row['date'] not in seen, 'Duplicate daily coverage date'
            seen.add(row['date'])
            assert row['status'] in allowed, 'Invalid daily coverage status'
            assert isinstance(row.get('verifiedArticles'),int) and row['verifiedArticles'] >= 0, 'Invalid daily coverage count'
            assert row['verifiedArticles'] == article_counts.get(row['date'],0), 'Daily coverage/article count mismatch: '+row['date']
        for d in article_counts:
            assert d in seen, 'Article date missing from dailyCoverage: '+d
        first=min(date.fromisoformat(d) for d in seen); last=max(date.fromisoformat(d) for d in seen)
        assert first == start, 'dailyCoverage must start at coverageStart'
        cursor=first
        while cursor <= last:
            assert cursor.isoformat() in seen, 'Gap in dailyCoverage: '+cursor.isoformat()
            cursor += timedelta(days=1)
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
