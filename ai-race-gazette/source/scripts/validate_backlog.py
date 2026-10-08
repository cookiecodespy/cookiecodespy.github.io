"""Validate the Gazette completion queue and ensure its human checklist is exact."""
import json
from pathlib import Path
from refresh_master_checklist import render

root=Path(__file__).resolve().parents[1]
doc=json.loads((root/'ops/backlog.json').read_text(encoding='utf-8'))
assert doc['schemaVersion']==1
phases=doc['phases']
phase_ids=[p['id'] for p in phases]
assert len(phase_ids)==len(set(phase_ids)) and phases, 'Invalid/duplicate phases'
tasks=doc['items']
task_ids=[t['id'] for t in tasks]
assert len(task_ids)==len(set(task_ids)), 'Duplicate task IDs'
status=set(doc['rules']['statuses'])
priority=set(doc['rules']['priorities'])
for phase in phases:
    assert phase['status'] in status and phase['gate'].strip()
for task in tasks:
    assert task['phase'] in phase_ids, f"Unknown phase {task['id']}"
    assert task['priority'] in priority and task['status'] in status, f"Invalid task state {task['id']}"
    assert task['acceptance'].strip() and task['lane'].strip()
    if task['status']=='done':
        assert task.get('evidenceCommit') or task.get('verifiedEvidence'), f"Missing completion evidence: {task['id']}"
    if task['status']=='cancelled':
        assert task.get('cancellationReason'), f"Missing rejection reason: {task['id']}"
    for dep in task.get('dependsOn',[]):
        assert dep in task_ids and dep!=task['id'], f"Invalid dependency {dep}"
actual=(root/'docs/master-checklist.md').read_text(encoding='utf-8')
assert actual==render(doc), 'Master checklist differs from backlog.json; regenerate, do not edit manually'
print(f"Backlog OK: {len(phases)} phases, {len(tasks)} tasks, {sum(t['status']=='done' for t in tasks)} done with evidence")
