import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/'scripts/publish_visual_asset.py'
spec=importlib.util.spec_from_file_location('publish_visual_asset',SCRIPT)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class VisualPublishTests(unittest.TestCase):
    def test_accepts_webp_signature(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'x.webp'
            p.write_bytes(b'RIFF'+(4).to_bytes(4,'little')+b'WEBP'+b'VP8 ')
            mod.assert_webp(p)

    def test_rejects_non_webp(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'x.webp'
            p.write_bytes(b'not-a-webp')
            with self.assertRaises(AssertionError):
                mod.assert_webp(p)

    def test_slug_validation(self):
        mod.validate_slug('claude-haiku-5-5','id')
        with self.assertRaises(AssertionError):
            mod.validate_slug('Claude Haiku','id')

if __name__=='__main__':
    unittest.main()
