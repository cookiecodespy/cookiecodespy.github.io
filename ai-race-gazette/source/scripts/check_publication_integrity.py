"""Verify both public JSON/RSS mirrors and calendar consistency."""
import json
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import date,timedelta
from email.utils import parsedate_to_datetime
from pathlib import Path
SOURCE=Path(__file__).resolve().parents[1]
PROJECT=SOURCE.parent
STATUSES={'pending','partial','complete','reviewed-no-material-news'}

def validate(news_text,mirror_text,rss_text,rss_mirror,history_text):
    assert news_text==mirror_text,'JSON mirrors differ'
    assert rss_text==rss_mirror,'RSS mirrors differ'
    archive=json.loads(news_text)
    articles=archive['articles']
    public=archive['dailyCoverage']
    historical=json.loads(history_text)
    assert articles, 'Empty article archive'
    ids=[a['id'] for a in articles]
    keys=[a.get('eventKey',a['id']) for a in articles]
    assert len(ids)==len(set(ids)), 'Duplicate article ID'
    assert len(keys)==len(set(keys)), 'Duplicate eventKey'
    pc={row['date']:row for row in public}
    hc={row['date']:row for row in historical}
    assert len(pc)==len(public) and len(hc)==len(historical), 'Duplicate date rows'
    assert set(pc)==set(hc), 'Coverage calendars differ'
    counts=Counter(a['date'] for a in articles)
    assert set(counts)<=set(pc), 'Story without calendar date'
    for d,row in pc.items():
        assert row['status'] in STATUSES, d+' invalid coverage status'
        assert row['status']==hc[d]['status'], d+' status mismatch'
        assert row['verifiedArticles']==hc[d]['verifiedArticles']==counts[d], d+' story count mismatch'
        if row['status']=='reviewed-no-material-news':
            assert counts[d]==0, d+' no-material day contains stories'
        if row['status']=='complete':
            assert counts[d]>0, d+' completed day has no stories'
    start=date.fromisoformat(archive['coverageStart'])
    end=max(date.fromisoformat(d) for d in pc)
    expected={(start+timedelta(days=k)).isoformat() for k in range((end-start).days+1)}
    assert set(pc)==expected,'Calendar dates have gaps'
    root=ET.fromstring(rss_text)
    items=root.findall('./channel/item')
    assert root.tag=='rss' and len(items)==len(articles),'RSS count or format mismatch'
    urls={f'https://cookiecodespy.github.io/ai-race-gazette/#articulo/{a["id"]}' for a in articles}
    rss_urls=[i.findtext('link') for i in items]
    assert len(set(rss_urls))==len(rss_urls), 'RSS duplicate links'
    assert set(rss_urls)==urls, 'RSS missing or unknown article links'
    expected_urls=[
        f'https://cookiecodespy.github.io/ai-race-gazette/#articulo/{a["id"]}'
        for a in sorted(articles,key=lambda a:(a['date'],a['id']),reverse=True)
    ]
    assert rss_urls==expected_urls, 'RSS items not in reverse chronological order'
    articles_by_url={
        f'https://cookiecodespy.github.io/ai-race-gazette/#articulo/{article["id"]}':article
        for article in articles
    }
    for item in items:
        link=item.findtext('link')
        article=articles_by_url[link]
        assert item.findtext('guid')==link, 'RSS GUID mismatch'
        assert item.findtext('title')==article['title'], f"Stale RSS title for {article['id']}"
        assert item.findtext('description')==article['summary'], f"Stale RSS summary for {article['id']}"
        source=item.find('source')
        assert source is not None and source.text==article['source']['name'],f"Stale RSS source name for {article['id']}"
        assert source.get('url')==article['source']['url'],f"Stale RSS source URL for {article['id']}"
        published=parsedate_to_datetime(item.findtext('pubDate')).date().isoformat()
        assert published==article['date'],f"Stale RSS date for {article['id']}"
    return len(articles),len(pc)

if __name__=='__main__':
    n,d=validate(
        (PROJECT/'data/news.json').read_text(encoding='utf-8'),
        (SOURCE/'public/data/news.json').read_text(encoding='utf-8'),
        (PROJECT/'feed.xml').read_text(encoding='utf-8'),
        (SOURCE/'public/feed.xml').read_text(encoding='utf-8'),
        (SOURCE/'docs/history-coverage.json').read_text(encoding='utf-8'))
    print(f'Publication integrity OK: {n} articles, {d} dates, RSS/mirrors synchronized')
