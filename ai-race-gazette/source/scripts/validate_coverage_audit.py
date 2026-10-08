"""Validate Research Backbone coverage without blocking live partial-day publishing.

history-coverage.json + public dailyCoverage are live counts.
coverage-audit.json is the Research Desk's immutable-ish audit snapshot.
Completed audited days must match exactly. Open days may grow in Newsroom.
"""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
NEWS=ROOT/'public/data/news.json'
COVERAGE=ROOT/'docs/history-coverage.json'
AUDIT=ROOT/'research/coverage-audit.json'
REGISTRY=ROOT/'research/source-registry.json'
STATUSES={'pending','partial','complete','reviewed-no-material-news'}
MODES={'pending-backbone-audit','legacy-block-audit','backbone-v1'}
CLOSED={'complete','reviewed-no-material-news'}

def check(news,coverage,audit,registry):
    assert audit.get('schemaVersion')==1
    assert audit.get('periodStart')==news.get('coverageStart')
    source_ids={s['id'] for s in registry['sources']}
    categories=set(audit.get('categories') or [])
    assert categories
    rows={r['date']:r for r in coverage}
    audit_rows={r['date']:r for r in audit.get('days',[])}
    assert len(rows)==len(coverage),'Duplicate daily coverage records'
    assert len(audit_rows)==len(audit.get('days',[])),'Duplicate audit dates'
    assert set(audit_rows)<=set(rows),'Audited date missing from live history coverage'
    live_counts={}
    for a in news['articles']:
        live_counts[a['date']]=live_counts.get(a['date'],0)+1
    new_days=0; growing=0; closed=0
    for day,row in rows.items():
        assert row['status'] in STATUSES, f'{day}: invalid live status'
        actual=live_counts.get(day,0)
        assert row['verifiedArticles']==actual, f'{day}: live history/article count mismatch'
        ar=audit_rows.get(day)
        if ar is None:
            # Newsroom may start a NEW day after the existing historical audit range.
            assert day>audit['periodEnd'],f'{day}: missing historical audit record'
            assert row['status'] in {'pending','partial'},f'{day}: close day only with audit evidence'
            new_days+=1
            continue
        assert ar['auditMode'] in MODES,f'{day}: invalid audit mode'
        checked_sources=ar.get('reviewedSourceIds',[])
        checked_categories=ar.get('reviewedCategories',[])
        assert isinstance(checked_sources,list) and len(set(checked_sources))==len(checked_sources)
        assert set(checked_sources)<=source_ids
        assert isinstance(checked_categories,list) and len(set(checked_categories))==len(checked_categories)
        assert set(checked_categories)<=categories
        for key in ('openDiscoveryPerformed','reversePassPerformed','backboneReauditRequired'):
            assert isinstance(ar.get(key),bool)
        stats=ar.get('candidateStats',{})
        assert isinstance(stats,dict)
        assert stats.get('published')==ar['verifiedArticles'],f'{day}: audit snapshot totals inconsistent'
        assert isinstance(ar['verifiedArticles'],int) and ar['verifiedArticles']>=0
        if row['status'] in CLOSED or ar['archiveStatus'] in CLOSED:
            # Complete means immutable evidence; additions require reauditing, not silence.
            assert row['status']==ar['archiveStatus'],f'{day}: closed audit status changed'
            assert ar['verifiedArticles']==actual,f'{day}: closed audit count changed; re-audit required'
            assert ar['auditMode']=='backbone-v1',f'{day}: closing requires backbone-v1 research audit'
            assert checked_sources, f'{day}: completed audit needs sources'
            assert checked_categories, f'{day}: completed audit needs categories'
            assert ar['openDiscoveryPerformed'] is True,f'{day}: open discovery required'
            assert ar['reversePassPerformed'] is True,f'{day}: second research pass required'
            assert ar['backboneReauditRequired'] is False,f'{day}: re-audit remains pending'
            assert isinstance(stats.get('unresolved'),int) and stats['unresolved']==0,f'{day}: unresolved candidates prevent closure'
            assert ar.get('reviewedAt'),f'{day}: no review date'
            evidence=ar.get('auditDocument')
            assert evidence and isinstance(evidence,str),f'{day}: no supporting research document'
            assert (ROOT/evidence).is_file(),f'{day}: missing supporting research document'
            closed+=1
        else:
            # Open dates are intentionally not exhaustive; Newsroom can add later.
            assert ar['archiveStatus'] in {'pending','partial'}
            assert row['status'] in {'pending','partial'}
            assert ar['verifiedArticles']<=actual, f'{day}: stories were removed; reconcile audit'
            if ar['verifiedArticles']!=actual or ar['archiveStatus']!=row['status']:
                growing+=1
    return len(rows),closed,growing,new_days

def main():
    news=json.loads(NEWS.read_text(encoding='utf-8'))
    coverage=json.loads(COVERAGE.read_text(encoding='utf-8'))
    audit=json.loads(AUDIT.read_text(encoding='utf-8'))
    registry=json.loads(REGISTRY.read_text(encoding='utf-8'))
    days,closed,growing,new=check(news,coverage,audit,registry)
    print(f"coverage audit OK: {days} live days; {closed} closed audits; {growing} open days newer than audit snapshot; {new} new unaudited dates")

if __name__=='__main__':
    main()
