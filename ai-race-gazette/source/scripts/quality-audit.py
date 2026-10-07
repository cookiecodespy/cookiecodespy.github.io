"""Quality audit for AI Race Gazette. No network or API keys required."""
import json
import re
from pathlib import Path
from statistics import median
from collections import Counter

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
COVERAGE=ROOT/'docs/history-coverage.json'

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
 'coverage_states':dict(states),
 'shortest':sorted((words(a),a['id']) for a in articles)[:10],
}
print(json.dumps(report,ensure_ascii=False,indent=2))
