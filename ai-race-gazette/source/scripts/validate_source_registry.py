"""Validate the Gazette research source registry."""
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
REGISTRY=ROOT/'research/source-registry.json'

def main():
    data=json.loads(REGISTRY.read_text(encoding='utf-8'))
    assert data.get('schemaVersion')==1
    assert data.get('discoveryMode')=='open'
    sources=data.get('sources')
    assert isinstance(sources,list) and sources
    ids=set()
    for source in sources:
        sid=source.get('id')
        assert isinstance(sid,str) and sid.strip() and sid not in ids
        ids.add(sid)
        assert source.get('official') is True
        domains=source.get('domains')
        assert isinstance(domains,list) and domains
        domain_set={d.lower() for d in domains}
        for key in ('entrypoints','allowedUrlPrefixes'):
            values=source.get(key)
            assert isinstance(values,list) and values
            for url in values:
                p=urlparse(url)
                assert p.scheme=='https' and p.hostname
                assert p.hostname.lower() in domain_set
    print(f"source registry OK: {len(sources)} baseline sources; discovery remains open")

if __name__=='__main__':
    main()
