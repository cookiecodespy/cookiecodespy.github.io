import {chromium} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const data=JSON.parse(await readFile('public/data/news.json','utf8'));
await mkdir('qa/polished',{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'es-CL'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const url=process.env.QA_URL||'http://127.0.0.1:4173/';

const articleDates=new Set(data.articles.map(a=>a.date));
const dateRange=(start,end)=>{
  const out=[];let d=new Date(start+'T12:00:00Z'),last=new Date(end+'T12:00:00Z');
  while(d<=last){out.push(d.toISOString().slice(0,10));d.setUTCDate(d.getUTCDate()+1);}
  return out;
};

await page.goto(url);
await page.getByRole('heading',{name:'Noticias de IA',exact:true}).waitFor();
await page.evaluate(()=>document.fonts.ready);
assert.equal(await page.locator('.news-cover').count(),Math.min(12,data.articles.length));

const positions=await page.evaluate(()=>['.archive-masthead','.project-intro','.archive-controls','.archive-results'].map(s=>document.querySelector(s).getBoundingClientRect().top));
assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
await page.screenshot({path:'qa/polished/01-portada.png',fullPage:true});

while(await page.getByRole('button',{name:'Mostrar más noticias'}).count()){
  await page.getByRole('button',{name:'Mostrar más noticias'}).click();
}
assert.equal(await page.locator('.news-cover').count(),data.articles.length);

await page.getByRole('button',{name:'Vista lista'}).click();
assert.equal(await page.locator('.news-list-item').count(),data.articles.length);
await page.screenshot({path:'qa/polished/02-lista.png',fullPage:true});

const v2=data.articles.find(a=>a.articleVersion===2);
assert.ok(v2,'Expected at least one Reporter V2 fixture in published data');
await page.getByRole('searchbox').fill(v2.title);
assert.equal(await page.locator('.news-list-item').count(),1);
await page.getByRole('searchbox').fill('zzznothing');
await page.getByRole('heading',{name:'No hay noticias con esos filtros'}).waitFor();
await page.locator('.empty').getByRole('button',{name:'Limpiar filtros'}).click();

const filterTarget=data.articles.find(a=>a.company==='Google'&&a.tags.includes('Modelos'))||data.articles[0];
await page.getByRole('button',{name:filterTarget.company,exact:true}).click();
await page.getByRole('button',{name:filterTarget.tags[0],exact:true}).click();
let expected=data.articles.filter(a=>a.company===filterTarget.company&&a.tags.includes(filterTarget.tags[0])).length;
assert.equal(await page.locator('.news-list-item').count(),Math.min(12,expected));

await page.getByRole('button',{name:'Vista portadas'}).click();
assert.equal(await page.locator('.news-cover').count(),Math.min(12,expected));
const month=filterTarget.date.slice(0,7);
await page.getByRole('button',{name:new RegExp(month==='2026-09'?'septiembre de 2026':month==='2026-10'?'octubre de 2026':month,'i')}).click();
expected=data.articles.filter(a=>a.company===filterTarget.company&&a.tags.includes(filterTarget.tags[0])&&a.date.startsWith(month)).length;
assert.equal(await page.locator('.news-cover').count(),Math.min(12,expected));
await page.getByRole('button',{name:'Limpiar filtros',exact:true}).click();

const knownDay='2026-09-01';
const knownCount=data.articles.filter(a=>a.date===knownDay).length;
await page.getByLabel('Filtrar por día').fill(knownDay);
assert.equal(await page.locator('.news-cover').count(),Math.min(12,knownCount));
await page.reload();
await page.locator('.news-cover').first().waitFor();
assert.equal(await page.getByLabel('Filtrar por día').inputValue(),knownDay);
assert.equal(await page.locator('.news-cover').count(),Math.min(12,knownCount));
await page.screenshot({path:'qa/polished/03-dia.png',fullPage:true});

const missingDay=dateRange(data.archiveStart||data.coverageStart,data.updatedAt.slice(0,10)).find(d=>!articleDates.has(d));
if(missingDay){
  await page.getByLabel('Filtrar por día').fill(missingDay);
  const emptyCopy=page.locator('.empty p');
  await emptyCopy.waitFor();
  assert.ok((await emptyCopy.textContent()).trim().length>20);
}
await page.locator('.filter-summary').getByRole('button',{name:'Limpiar filtros'}).click();

await page.goto(url+`#articulo/${v2.id}`);
await page.getByRole('heading',{name:'En 30 segundos'}).waitFor();
await page.getByRole('heading',{name:'La lectura del Gazette'}).waitFor();
if(v2.usefulFacts?.length)await page.getByRole('heading',{name:'Datos útiles'}).waitFor();
if(v2.curiosities?.length)await page.getByRole('heading',{name:'Datos curiosos'}).waitFor();
if(v2.finalSummary)await page.getByRole('heading',{name:'Resumen final'}).waitFor();
await page.getByRole('heading',{name:'Consulta la evidencia original'}).waitFor();
assert.equal(await page.locator('h1').textContent(),v2.title);
await page.getByRole('button',{name:'Copiar enlace'}).click();
await page.locator('.toast').getByText(/Enlace copiado|Puedes copiar/).waitFor();
await page.screenshot({path:'qa/polished/04-articulo-v2.png',fullPage:true});

await page.reload();
await page.getByRole('heading',{name:'Consulta la evidencia original'}).waitFor();
await page.getByRole('link',{name:'Volver a la portada',exact:true}).click();

for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
}
await page.setViewportSize({width:390,height:844});
await page.goto(url+`#articulo/${v2.id}`);
await page.getByRole('heading',{name:'En 30 segundos'}).waitFor();
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:'qa/polished/05-articulo-v2-movil.png',fullPage:true});

await page.goto(url+'#articulo/no-existe');
await page.getByRole('heading',{name:'Esta página no está en el archivo'}).waitFor();
await page.getByRole('link',{name:'Volver a la portada',exact:true}).click();
await page.locator('.skip').focus();
await page.keyboard.press('Enter');
assert.equal(await page.evaluate(()=>document.activeElement.id),'contenido');

// Synthetic stress fixture: many simultaneous launches remain paginated and filterable.
const stress=await browser.newPage();
await stress.route('**/data/news.json',r=>r.fulfill({json:{...data,articles:Array.from({length:60},(_,i)=>({...data.articles[0],id:`feature-${String(i).padStart(2,'0')}`,eventKey:`feature-${i}`,date:'2026-10-06',company:'OpenAI',title:`Función independiente ${i}`}))}}));
await stress.goto(url);
await stress.locator('.news-cover').first().waitFor();
assert.equal(await stress.locator('.news-cover').count(),12);
await stress.getByRole('button',{name:'Mostrar más noticias'}).click();
assert.equal(await stress.locator('.news-cover').count(),24);
await stress.getByLabel('Filtrar por día').fill('2026-10-06');
assert.match(await stress.locator('.results-meta').textContent(),/60 noticias/);
await stress.close();

assert.deepEqual(errors,[]);
await writeFile('qa/browser-results.json',JSON.stringify({
  passed:true,
  articles:data.articles.length,
  reporterV2:v2.id,
  errors,
  checks:['layout order','pagination','search','dynamic filters','filter reload','pending day','Reporter V2 blocks','share/reload','320/390/768/1280 reflow','skip keyboard','60 simultaneous launches'],
  capturedAt:new Date().toISOString()
},null,2));
await browser.close();
console.log('Archive, Reporter V2, responsive and 60-launch stress checks passed');
