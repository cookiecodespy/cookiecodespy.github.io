"""Quality audit for AI Race Gazette. No network or API keys required."""
import json
import re
from pathlib import Path
from statistics import median
from collections import Counter

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
COVERAGE=ROOT/'docs/history-coverage.json'
VISUAL_MANIFEST=ROOT/'visual/asset-manifest.json'
VISUAL_QUEUE=ROOT/'visual/image-queue.json'

def words(article):
    parts=[article.get('title',''),article.get('summary','')]
    parts += article.get('body',[])
    parts += article.get('keyPoints',[])
    parts += [article.get('analysis',''),article.get('watch','')]
    for sec in article.get('sections',[]):
        parts.append(sec.get('heading',''))
        parts += sec.get('paragraphs',[])
    parts += article.get('quickTakeaways',[])
    parts += article.get('limitations',[])
    parts += article.get('practicalAdvice',[])
    parts += article.get('usefulFacts',[])
    parts += article.get('curiosities',[])
    parts += [article.get('executiveSummary',''),article.get('finalSummary','')]
    return len(re.findall(r"\b\w+\b"," ".join(x for x in parts if isinstance(x,str)),flags=re.UNICODE))

data=json.loads(NEWS.read_text(encoding='utf-8'))
articles=data['articles']
counts=[words(a) for a in articles]
ids=[a['id'] for a in articles]
events=[a.get('eventKey',a['id']) for a in articles]
assert len(ids)==len(set(ids)), 'Duplicate ids'
assert len(events)==len(set(events)), 'Duplicate eventKeys'

coverage=data.get('dailyCoverage') or (json.loads(COVERAGE.read_text(encoding='utf-8')) if COVERAGE.exists() else [])
states=Counter(row['status'] for row in coverage)
companies=Counter(a['company'] for a in articles)
dates=Counter(a['date'] for a in articles)
v2=[a for a in articles if a.get('articleVersion')==2]
visual_manifest=json.loads(VISUAL_MANIFEST.read_text(encoding='utf-8')) if VISUAL_MANIFEST.exists() else {'assets':[]}
visual_queue=json.loads(VISUAL_QUEUE.read_text(encoding='utf-8')) if VISUAL_QUEUE.exists() else {'items':[]}
image_usage=Counter(a.get('image') for a in articles)
queue_states=Counter(i.get('productionStatus') for i in visual_queue.get('items',[]))

report={
 'articles':len(articles),
 'dates_with_articles':len(dates),
 'companies':len(companies),
 'avg_words':round(sum(counts)/len(counts),1) if counts else 0,
 'median_words':median(counts) if counts else 0,
 'under_500':sum(n<500 for n in counts),
 'under_900':sum(n<900 for n in counts),
 'reporter_v2':len(v2),
 'with_specific_art':sum(a.get('imageStatus')=='specific' for a in articles),
 'registered_visual_assets':len(visual_manifest.get('assets',[])),
 'unique_article_images':len(image_usage),
 'most_reused_image':image_usage.most_common(1)[0] if image_usage else None,
 'articles_using_most_reused_image':image_usage.most_common(1)[0][1] if image_usage else 0,
 'visual_queue_states':dict(queue_states),
 'visual_queue_p0':sum(i.get('queuePriority')=='P0' for i in visual_queue.get('items',[])),
 'visual_queue_p1':sum(i.get('queuePriority')=='P1' for i in visual_queue.get('items',[])),
 'coverage_states':dict(states),
 'shortest':sorted((words(a),a['id']) for a in articles)[:10],
}
# Operational scorecard: derived on every CI run, never stored as a stale snapshot.
backlog_path=ROOT/'ops/backlog.json'
backlog=json.loads(backlog_path.read_text(encoding='utf-8')) if backlog_path.exists() else {'items':[],'phases':[]}
all_tasks=backlog.get('items',[])
done_days=sum(s in ('complete','reviewed-no-material-news') for s in states.elements())
report['editorial_progress']={
 'archive_updated_at':data.get('updatedAt'),
 'latest_article_date':max(dates) if dates else None,
 'calendar_days_registered':len(coverage),
 'calendar_days_closed':done_days,
 'calendar_days_open':len(coverage)-done_days,
 'v2_articles':len(v2),
 'legacy_articles':len(articles)-len(v2),
 'v2_single_linked_source':sum(1 for a in v2 if len(a.get('relatedSources',[]))==0),
 'visual_queue_articles':len(visual_queue.get('items',[])),
 'visual_queue_fresh':visual_queue.get('generatedFromNewsUpdatedAt')==data.get('updatedAt'),
 'task_statuses':dict(Counter(t.get('status') for t in all_tasks)),
 'active_phase_ids':[p['id'] for p in backlog.get('phases',[]) if p['status']=='in_progress'],
}

print(json.dumps(report,ensure_ascii=False,indent=2))
