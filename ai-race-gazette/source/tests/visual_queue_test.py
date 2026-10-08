import unittest
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from refresh_visual_queue import refresh

def article(i,src='assets/hero.webp',status='needs-specific-art',date='2026-09-08'):
    return {'id':i,'eventKey':f'event-{i}','date':date,'company':'Test','product':'Product',
            'title':f'Article {i}','summary':'Grounded source summary','image':src,
            'imageStatus':status,'imageBrief':'Illustrate this actual article with a period engraving and no false logos.'}

class RefreshVisualQueueTests(unittest.TestCase):
    def setUp(self):
        self.manifest={'schemaVersion':1,'assets':[
            {'id':'generic','src':'assets/hero.webp','currentUsage':1},
            {'id':'specific','src':'assets/news/2026-09-08/a.webp','currentUsage':1},
        ]}
    def test_new_news_adds_brief_and_updates_usage(self):
        news={'updatedAt':'2026-10-08T12:00:00Z','articles':[article('a'),article('b')]}
        m,q=refresh(news,self.manifest,{'schemaVersion':1,'items':[]})
        self.assertEqual(len(q['items']),2)
        self.assertEqual(m['assets'][0]['currentUsage'],2)
        self.assertEqual(q['items'][0]['queuePriority'],'P0')
    def test_refresh_idempotence(self):
        news={'updatedAt':'2026-10-08T12:00:00Z','articles':[article('a')]}
        m,q=refresh(news,self.manifest,{'schemaVersion':1,'items':[]})
        self.assertEqual((m,q),refresh(news,m,q))
    def test_keep_completed_visual_metadata(self):
        story=article('a','assets/news/2026-09-08/a.webp','specific')
        news={'updatedAt':'2026-10-08T12:00:00Z','articles':[story]}
        old={'schemaVersion':1,'items':[{'articleId':'a','date':'2026-09-08','productionStatus':'complete',
            'completedAssetId':'specific','completedAt':'2026-10-08','producedBy':'Designer',
            'reviewerNotes':'Approved editorial style'}]}
        _,q=refresh(news,self.manifest,old)
        item=q['items'][0]
        self.assertEqual(item['productionStatus'],'complete')
        self.assertEqual(item['completedAssetId'],'specific')
        self.assertEqual(item['reviewerNotes'],'Approved editorial style')
    def test_lost_specific_image_reopens_brief(self):
        news={'updatedAt':'2026-10-08T12:00:00Z','articles':[article('a')]}
        old={'schemaVersion':1,'items':[{'articleId':'a','date':'2026-09-08','productionStatus':'complete',
            'completedAssetId':'obsolete','completedAt':'2026-10-08'}]}
        _,q=refresh(news,self.manifest,old)
        self.assertEqual(q['items'][0]['productionStatus'],'brief-ready')
        self.assertNotIn('completedAssetId',q['items'][0])
    def test_reject_unregistered_hero(self):
        news={'updatedAt':'2026-10-08T12:00:00Z','articles':[article('a','assets/ghost.webp')]}
        with self.assertRaisesRegex(ValueError,'Unregistered image'):
            refresh(news,self.manifest,{'schemaVersion':1,'items':[]})
if __name__=='__main__':unittest.main()
