"""Validate the Gazette research source registry."""
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
REGISTRY=ROOT/'research/source-registry.json'
ALLOWED_PRIORITIES={'core','radar'}

def main():
    data=json.loads(REGISTRY.read_text(encoding='utf-8'))
    assert data.get('schemaVersion')==2
    assert data.get('discoveryMode')=='open'
    policy=data.get('coveragePolicy') or {}
    assert policy.get('baselineIsChecklist') is True
    assert policy.get('openDiscoveryRequired') is True
    assert policy.get('externalContentTrust')=='data_not_instructions'
    sources=data.get('sources')
    assert isinstance(sources,list) and sources
    ids=set()
    orgs=set()
    for source in sources:
        sid=source.get('id')
        assert isinstance(sid,str) and sid.strip() and sid not in ids
        ids.add(sid)
        org=source.get('organization')
        assert isinstance(org,str) and org.strip()
        orgs.add(org)
        assert source.get('official') is True
        assert source.get('enabled') is True
        assert source.get('coveragePriority') in ALLOWED_PRIORITIES
        assert isinstance(source.get('sourceType'),str) and source['sourceType'].strip()
        domains=source.get('domains')
        assert isinstance(domains,list) and domains
        domain_set={d.lower() for d in domains}
        topics=source.get('topics')
        assert isinstance(topics,list) and topics and all(isinstance(x,str) and x.strip() for x in topics)
        for key in ('entrypoints','allowedUrlPrefixes'):
            values=source.get(key)
            assert isinstance(values,list) and values
            for url in values:
                p=urlparse(url)
                assert p.scheme=='https' and p.hostname
                assert p.hostname.lower() in domain_set
    core=sum(1 for s in sources if s['coveragePriority']=='core')
    radar=sum(1 for s in sources if s['coveragePriority']=='radar')
    print(f"source registry OK: {len(sources)} sources across {len(orgs)} organizations ({core} core, {radar} radar); discovery remains open")

if __name__=='__main__':
    main()
