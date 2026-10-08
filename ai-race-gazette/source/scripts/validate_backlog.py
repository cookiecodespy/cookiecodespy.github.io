"""Check Gazette phase/backlog integrity. No external dependencies."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
d=json.loads((root/'ops/backlog.json').read_text(encoding='utf-8'))
assert d['schemaVersion']==1
phases=d['phases'];ids={x['id'] for x in phases};assert len(ids)==len(phases)
tasks=d['items'];tids=[x['id'] for x in tasks];assert len(tids)==len(set(tids))
status=set(d['rules']['statuses']);priority=set(d['rules']['priorities'])
for p in phases:
 assert p['status'] in status and p['gate'].strip()
for t in tasks:
 assert t['phase'] in ids and t['priority'] in priority and t['status'] in status
 assert t['acceptance'].strip() and t['lane'].strip()
 if t['status']=='done': assert t.get('evidenceCommit') or t.get('verifiedEvidence'),f"Missing done evidence: {t['id']}"
 if t['status']=='cancelled': assert t.get('cancellationReason'),f"Missing cancellation reason: {t['id']}"
 for dep in t.get('dependsOn',[]): assert dep in tids,f"Unknown dependency: {dep}"
print(f"Backlog OK: {len(phases)} phases, {len(tasks)} tasks, {sum(x['status']=='done' for x in tasks)} completed with evidence")
