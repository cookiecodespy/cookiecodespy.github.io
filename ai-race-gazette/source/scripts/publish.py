"""Publish only the Gazette subtree using GitHub's atomic Git tree API and gh auth."""
import argparse
import base64
import json
import subprocess
import tempfile
from pathlib import Path
from editorial import ROOT, NEWS, validate

REPO='repos/cookiecodespy/cookiecodespy.github.io'
PREFIX='ai-race-gazette/'
def api(path,payload=None):
    args=['gh','api',REPO+'/'+path]
    if payload is None:
        return json.loads(subprocess.check_output(args,text=True))
    with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',suffix='.json',delete=False) as f:
        json.dump(payload,f);name=f.name
    try:
        return json.loads(subprocess.check_output(args+['--method','POST','--input',name],text=True))
    finally:
        Path(name).unlink(missing_ok=True)

def publish(message):
    validate(json.loads(NEWS.read_text(encoding='utf-8')))
    dist=ROOT/'dist/client'
    assert (dist/'index.html').is_file(),'Run npm run build first'
    assert (dist/'data/news.json').read_bytes()==NEWS.read_bytes(),'Stale build; run npm run build again'
    paths={PREFIX+p.relative_to(dist).as_posix():p for p in dist.rglob('*') if p.is_file()}
    for folder in ['src','scripts','tests','docs','public','worker','.openai']:
        for p in (ROOT/folder).rglob('*'):
            if p.is_file() and '__pycache__' not in p.parts and not p.name.endswith('.pyc'):
                paths[PREFIX+'source/'+p.relative_to(ROOT).as_posix()]=p
    for name in ['package.json','package-lock.json','vite.config.mjs','index.html','AGENTS.md','.gitignore']:
        paths[PREFIX+'source/'+name]=ROOT/name
    for name in ['README.md','design-qa.md','DESIGN-BRIEF.md']:
        p=ROOT/name
        if p.exists():paths[PREFIX+name]=p
    ref=api('git/ref/heads/main')['object']['sha']
    base=api('git/commits/'+ref)['tree']['sha']
    existing={e['path']:e['sha'] for e in api('git/trees/'+base+'?recursive=1')['tree'] if e['type']=='blob'}
    entries=[]
    import hashlib
    for remote,p in paths.items():
        raw=p.read_bytes();sha=hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
        if existing.get(remote)==sha:continue
        blob=api('git/blobs',{'content':base64.b64encode(raw).decode(),'encoding':'base64'})
        entries.append({'path':remote,'mode':'100644','type':'blob','sha':blob['sha']})
    # Delete obsolete build hashes only; never remove original references or other projects.
    for remote in existing:
        if remote.startswith(PREFIX+'assets/') and re_build_asset(remote) and remote not in paths:
            entries.append({'path':remote,'mode':'100644','type':'blob','sha':None})
    if not entries:
        print('No changes to publish');return
    assert all(e['path'].startswith(PREFIX) for e in entries)
    tree=api('git/trees',{'base_tree':base,'tree':entries})['sha']
    commit=api('git/commits',{'message':message,'tree':tree,'parents':[ref]})['sha']
    # Non-force update: a concurrent change aborts safely instead of overwriting it.
    with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',suffix='.json',delete=False) as f:
        json.dump({'sha':commit,'force':False},f);name=f.name
    try:subprocess.run(['gh','api',REPO+'/git/refs/heads/main','--method','PATCH','--input',name],check=True,stdout=subprocess.DEVNULL)
    finally:Path(name).unlink(missing_ok=True)
    print('Published commit:',commit)
    print('https://cookiecodespy.github.io/ai-race-gazette/')
    api('pages/builds',{})

def re_build_asset(path):
    import re
    return bool(re.search(r'/[^/]+-[A-Za-z0-9_-]{8}\.(js|css|woff2|webp)$',path))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--message',required=True);args=p.parse_args();publish(args.message)
