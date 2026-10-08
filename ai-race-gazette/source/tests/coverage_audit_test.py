import copy,json,sys,unittest
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
  days,closed,growing,new=self.verify()
  self.assertGreaterEqual(days,37)
  self.assertGreaterEqual(growing,1)
 def test_audited_complete_day_cannot_silently_grow(self):
  a=next(x for x in self.news['articles'] if x['date']=='2026-09-01')
  clone=copy.deepcopy(a);clone['id']='test-new-audited-story';clone['eventKey']='test-new-audited-story'
  self.news['articles'].append(clone)
  next(r for r in self.coverage if r['date']=='2026-09-01')['verifiedArticles']+=1
  with self.assertRaisesRegex(AssertionError,'closed audit count changed'):
   self.verify()
 def test_future_new_day_may_be_partial(self):
  clone=copy.deepcopy(self.news['articles'][0])
  clone.update(id='test-next-day-story',eventKey='test-next-day-story',date='2026-10-08')
  self.news['articles'].append(clone)
  self.coverage.append({'date':'2026-10-08','status':'partial','verifiedArticles':1})
  self.assertGreaterEqual(self.verify()[3],1)
 def test_unrecorded_historical_date_fails(self):
  self.audit['days']=[a for a in self.audit['days'] if a['date']!='2026-09-10']
  with self.assertRaisesRegex(AssertionError,'missing historical audit record'):
   self.verify()

if __name__=='__main__':unittest.main()
