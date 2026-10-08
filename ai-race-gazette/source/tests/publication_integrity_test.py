"""Semantic RSS synchronization tests for live Gazette content."""
import sys, unittest, xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from check_publication_integrity import validate

class PublicationIntegrityTests(unittest.TestCase):
    def setUp(self):
        self.news=(ROOT.parent/'data/news.json').read_text(encoding='utf-8')
        self.rss=(ROOT.parent/'feed.xml').read_text(encoding='utf-8')
        self.history=(ROOT/'docs/history-coverage.json').read_text(encoding='utf-8')
    def check(self,rss):
        return validate(self.news,self.news,rss,rss,self.history)
    def test_current_rss_is_semantically_in_sync(self):
        n,d=self.check(self.rss)
        self.assertGreater(n,0)
        self.assertGreater(d,0)
    def test_rss_title_must_match_article(self):
        tree=ET.fromstring(self.rss)
        tree.find('./channel/item/title').text='Outdated editorial headline'
        with self.assertRaisesRegex(AssertionError,'Stale RSS title'):
            self.check(ET.tostring(tree,encoding='unicode'))
    def test_rss_summary_must_match_article(self):
        tree=ET.fromstring(self.rss)
        tree.find('./channel/item/description').text='Stale cached summary'
        with self.assertRaisesRegex(AssertionError,'Stale RSS summary'):
            self.check(ET.tostring(tree,encoding='unicode'))
    def test_rss_date_must_match_article(self):
        tree=ET.fromstring(self.rss)
        tree.find('./channel/item/pubDate').text='Wed, 01 Jan 2020 12:00:00 +0000'
        with self.assertRaisesRegex(AssertionError,'Stale RSS date'):
            self.check(ET.tostring(tree,encoding='unicode'))

if __name__=='__main__':unittest.main()
