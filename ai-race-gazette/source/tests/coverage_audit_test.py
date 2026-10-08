import copy
import json
import sys
import unittest
from datetime import date, timedelta
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from validate_coverage_audit import check

class CoverageAuditTests(unittest.TestCase):
 def setUp(self):
  self.news=json.loads((ROOT/'public/data/news.json').read_text(encoding='utf-8'))
  self.coverage=json.loads((ROOT/'docs/history-coverage.json').read_text(encoding='utf-8'))
  self.audit=json.loads((ROOT/'research/coverage-audit.json').read_text(encoding='utf-8'))
  self.registry=json.loads((ROOT/'research/source-registry.json').read_text(encoding='utf-8'))

 def verify(self):
  return check(self.news,self.coverage,self.audit,self.registry)

 def test_live_partial_days_can_outgrow_snapshot(self):
  open_rows=[r for r in self.coverage if r['status'] in ('partial','pending') and
             any(a['date']==r['date'] for a in self.audit['days'])]
  if not open_rows: self.skipTest('No open historical snapshot days')
  row=open_rows[0]
  template=self.news['articles'][0]
  clone=copy.deepcopy(template)
  clone.update(id='test-open-day-story',eventKey='test-open-day-story',date=row['date'])
  self.news['articles'].append(clone)
  row['verifiedArticles']+=1
  if row['status']=='pending': row['status']='partial'
  days,closed,growing,new=self.verify()
  self.assertGreaterEqual(growing,1)

 def test_audited_complete_day_cannot_silently_grow(self):
  rows=[r for r in self.coverage if r['status']=='complete']
  if rows:
   row=rows[0]
  else:
   row=next(r for r in self.coverage if r['date'] in {a['date'] for a in self.audit['days']})
   row['status']='complete'
   ar=next(a for a in self.audit['days'] if a['date']==row['date'])
   ar['archiveStatus']='complete'
  clone=copy.deepcopy(self.news['articles'][0])
  clone.update(id='test-new-audited-story',eventKey='test-new-audited-story',date=row['date'])
  self.news['articles'].append(clone)
  row['verifiedArticles']+=1
  with self.assertRaisesRegex(AssertionError,'closed audit count changed'):
   self.verify()

 def test_future_new_day_may_be_partial(self):
  latest=max(date.fromisoformat(r['date']) for r in self.coverage)
  end=date.fromisoformat(self.audit['periodEnd'])
  day=(max(latest,end)+timedelta(days=1)).isoformat()
  clone=copy.deepcopy(self.news['articles'][0])
  clone.update(id='test-next-day-story',eventKey='test-next-day-story',date=day)
  self.news['articles'].append(clone)
  self.coverage.append({'date':day,'status':'partial','verifiedArticles':1})
  self.assertGreaterEqual(self.verify()[3],1)

 def test_unrecorded_historical_date_fails(self):
  day=self.audit['days'][0]['date']
  self.audit['days']=[a for a in self.audit['days'] if a['date']!=day]
  with self.assertRaisesRegex(AssertionError,'missing historical audit record'):
   self.verify()

if __name__=='__main__':
 unittest.main()
