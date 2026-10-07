import copy,json,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from editorial import validate,NEWS

class EditorialTests(unittest.TestCase):
 def setUp(self):
  self.data=json.loads(NEWS.read_text(encoding='utf-8'))
 def test_separate_events_can_share_a_primary_source(self):
  other=copy.deepcopy(self.data['articles'][0]);other['id']='another-feature';other['eventKey']='another-feature'
  self.data['articles'].append(other);validate(self.data)
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
  a=self.data['articles'][0]
  a['articleVersion']=2
  a['quickTakeaways']=['Uno','Dos','Tres']
  a['sections']=[{'heading':'Qué pasó','paragraphs':['Contexto desarrollado.'],'kind':'report'}]
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
 def test_reporter_v2_rejects_invalid_section_kind(self):
  a=self.data['articles'][0]
  a['articleVersion']=2
  a['sections']=[{'heading':'Sección','paragraphs':['Texto.'],'kind':'inventado'}]
  with self.assertRaisesRegex(AssertionError,'Invalid section kind'):validate(self.data)
if __name__=='__main__':unittest.main()
