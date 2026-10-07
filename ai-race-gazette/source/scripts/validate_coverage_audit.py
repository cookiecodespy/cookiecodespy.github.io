"""Cross-check historical coverage with the Research Backbone audit ledger."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
COVERAGE=ROOT/'docs/history-coverage.json'
AUDIT=ROOT/'research/coverage-audit.json'
REGISTRY=ROOT/'research/source-registry.json'
ALLOWED_STATUS={'pending','partial','complete','reviewed-no-material-news'}
ALLOWED_AUDIT_MODE={'pending-backbone-audit','legacy-block-audit','backbone-v1'}

def main():
    news=json.loads(NEWS.read_text(encoding='utf-8'))
    coverage=json.loads(COVERAGE.read_text(encoding='utf-8'))
    audit=json.loads(AUDIT.read_text(encoding='utf-8'))
    registry=json.loads(REGISTRY.read_text(encoding='utf-8'))
    assert audit.get('schemaVersion')==1
    assert audit.get('periodStart')==news.get('coverageStart')
    source_ids={s['id'] for s in registry['sources']}
    categories=set(audit.get('categories') or [])
    assert categories
    rows={r['date']:r for r in coverage}
    audit_rows={r['date']:r for r in audit.get('days',[])}
    assert len(rows)==len(coverage)==len(audit_rows)
    article_counts={}
    for a in news['articles']:
        article_counts[a['date']]=article_counts.get(a['date'],0)+1
    for day,row in rows.items():
        assert row['status'] in ALLOWED_STATUS
        assert day in audit_rows
        ar=audit_rows[day]
        assert ar['archiveStatus']==row['status']
        assert ar['verifiedArticles']==row['verifiedArticles']==article_counts.get(day,0)
        assert ar['auditMode'] in ALLOWED_AUDIT_MODE
        reviewed_sources=ar.get('reviewedSourceIds',[])
        reviewed_categories=ar.get('reviewedCategories',[])
        assert isinstance(reviewed_sources,list) and len(reviewed_sources)==len(set(reviewed_sources))
        assert set(reviewed_sources)<=source_ids
        assert isinstance(reviewed_categories,list) and len(reviewed_categories)==len(set(reviewed_categories))
        assert set(reviewed_categories)<=categories
        for key in ('openDiscoveryPerformed','reversePassPerformed','backboneReauditRequired'):
            assert isinstance(ar.get(key),bool)
        stats=ar.get('candidateStats')
        assert isinstance(stats,dict)
        assert stats.get('published')==row['verifiedArticles']
        if ar['auditMode']=='backbone-v1' and row['status'] in {'complete','reviewed-no-material-news'}:
            assert reviewed_sources, f'{day}: completed Backbone audit needs source checks'
            assert reviewed_categories, f'{day}: completed Backbone audit needs category checks'
            assert ar['openDiscoveryPerformed'] is True
            assert ar['reversePassPerformed'] is True
            assert ar['backboneReauditRequired'] is False
    print(f"coverage audit OK: {len(rows)} days cross-checked; {sum(r['auditMode']=='backbone-v1' for r in audit_rows.values())} days on Backbone v1")

if __name__=='__main__':
    main()
