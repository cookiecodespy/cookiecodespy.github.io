import copy,json,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from editorial import validate,NEWS

class EditorialTests(unittest.TestCase):
 def setUp(self):
  self.data=json.loads(NEWS.read_text(encoding='utf-8'))
 def test_separate_events_can_share_a_primary_source(self):
  other=copy.deepcopy(self.data['articles'][0]);other['id']='another-feature';other['eventKey']='another-feature'
  self.data['articles'].append(other)
  row=next(r for r in self.data.get('dailyCoverage',[]) if r['date']==other['date']);row['verifiedArticles']+=1
  validate(self.data)
 def test_same_event_cannot_be_published_twice(self):
  other=copy.deepcopy(self.data['articles'][0]);other['id']='different-title-same-event'
  self.data['articles'].append(other)
  with self.assertRaisesRegex(AssertionError,'Duplicate event'):validate(self.data)
 def test_unsafe_link_is_rejected(self):
  self.data['articles'][0]['source']['url']='javascript:alert(1)'
  with self.assertRaisesRegex(AssertionError,'Unsafe source'):validate(self.data)
 def test_new_company_official_domain_does_not_require_code_change(self):
  self.data['articles'][0]['company']='Emerging AI Lab'
  self.data['articles'][0]['source']['name']='Emerging AI Lab'
  self.data['articles'][0]['source']['url']='https://example-ai-lab.com/news/new-model'
  validate(self.data)
 def test_missing_image_is_rejected(self):
  self.data['articles'][0]['image']='assets/missing.webp'
  with self.assertRaisesRegex(AssertionError,'Missing/unsafe image'):validate(self.data)
 def test_reporter_v2_optional_fields_validate(self):
  a=next(a for a in self.data['articles'] if a.get('articleVersion')==2)
  a['articleVersion']=2
  a['quickTakeaways']=['Uno','Dos','Tres']
  a['technicalDetails']=[{'label':'Modelo','value':'Ejemplo'}]
  a['availability']={'status':'GA','platforms':['API'],'regions':[],'requirements':[],'notes':[]}
  a['pricing']=[{'label':'Entrada','value':'US$1/M'}]
  a['limitations']=['Claim del proveedor pendiente de evaluación independiente.']
  a['practicalAdvice']=['Probar con cargas reales antes de migrar.']
  a['usefulFacts']=['ID estable.']
  a['curiosities']=['Dato verificado.']
  a['executiveSummary']='Resumen ejecutivo.'
  a['finalSummary']='Resumen final.'
  a['imageStatus']='library'
  validate(self.data)
 def test_reporter_v2_structured_sections_satisfy_context(self):
  a=next(a for a in self.data['articles'] if a.get('articleVersion')==2 and len(a['sections'])>=2)
  a['body']=['Resumen compatible con frontend anterior.']
  validate(self.data)
 def test_legacy_short_body_still_rejected(self):
  a=next(a for a in self.data['articles'] if a.get('articleVersion')!=2 and len(a['body'])>=2)
  a['body']=['Solo un párrafo superficial.']
  with self.assertRaisesRegex(AssertionError,'An article needs developed context'):validate(self.data)
 def test_reporter_v2_rejects_invalid_section_kind(self):
  a=next(a for a in self.data['articles'] if a.get('articleVersion')==2)
  self.assertTrue(a.get('sections'))
  a['sections'][0]['kind']='inventado'
  with self.assertRaisesRegex(AssertionError,'Invalid section kind'):validate(self.data)
 def test_daily_coverage_count_must_match_articles(self):
  self.assertTrue(self.data.get('dailyCoverage'))
  self.data['dailyCoverage'][0]['verifiedArticles']+=1
  with self.assertRaisesRegex(AssertionError,'Daily coverage/article count mismatch'):validate(self.data)
 def test_daily_coverage_cannot_have_date_gaps(self):
  self.assertGreater(len(self.data.get('dailyCoverage',[])),3)
  self.data['dailyCoverage'].pop(2)
  with self.assertRaisesRegex(AssertionError,'Gap in dailyCoverage|Article date missing'):validate(self.data)
if __name__=='__main__':unittest.main()
