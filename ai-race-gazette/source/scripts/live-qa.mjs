import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';

const BASE=(process.env.GAZETTE_LIVE_URL||'https://cookiecodespy.github.io/ai-race-gazette/').replace(/\/?$/,'/');
const errors=[];
const browser=await chromium.launch({headless:true});
let stats={passed:false,site:BASE};
try {
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  const newsResponse=await page.request.get(BASE+'data/news.json',{timeout:30000});
  assert.equal(newsResponse.status(),200,'Published news.json HTTP');
  const news=await newsResponse.json();
  assert(news.articles?.length>0,'Public archive is empty');
  const ids=new Set(news.articles.map(a=>a.id));
  assert.equal(ids.size,news.articles.length,'Duplicate public article IDs');
  const rssResponse=await page.request.get(BASE+'feed.xml',{timeout:30000});
  assert.equal(rssResponse.status(),200,'Public RSS HTTP');
  const rssText=await rssResponse.text();
  const rssItems=(rssText.match(/<item>/g)||[]).length;
  assert.equal(rssItems,news.articles.length,'Public RSS count differs from published JSON');

  await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('.news-cover').first().waitFor({timeout:30000});
  const cards=await page.locator('.news-cover').count();
  assert(cards>0&&cards<=news.articles.length,'Home cover cards inconsistent');
  assert(await page.locator('.coverage-calendar').count()>0,'Daily coverage calendar missing');
  await page.locator('.news-cover').first().click();
  await page.locator('.full-article h1').waitFor({timeout:20000});
  const route=new URL(page.url()).hash;
  assert.match(route,/#articulo\//,'Article navigation did not occur');
  assert(await page.locator('.sources a').count()>0,'Article lacks traceable source link');
  await page.locator('.hero-art img').first().waitFor();
  const hasImage=await page.locator('.hero-art img').first().evaluate(img=>img.complete&&img.naturalWidth>0);
  assert(hasImage,'Article illustration failed to load');
  await page.evaluate(()=>document.fonts.ready);
  await mkdir('qa',{recursive:true});
  await page.screenshot({path:'qa/live-desktop.png',fullPage:true});
  const desktopURL=page.url();

  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.goto(BASE,{waitUntil:'domcontentloaded',timeout:45000});
  await mobile.locator('.news-cover').first().waitFor({timeout:30000});
  const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert(overflow<=3,'Unexpected mobile horizontal overflow: '+overflow+'px');
  await mobile.screenshot({path:'qa/live-mobile.png',fullPage:true});

  assert.deepEqual(errors,[],'Browser JavaScript errors');
  stats={passed:true,site:BASE,publicArticles:news.articles.length,rssItems,visibleCovers:cards,desktopURL,hasImage,mobileHorizontalOverflow:overflow,errors};
  console.log('Live Gazette OK: '+news.articles.length+' articles, RSS, images, mobile, no page errors');
} finally {
  await mkdir('qa',{recursive:true});
  await writeFile('qa/live-results.json',JSON.stringify(stats,null,2)+'\n');
  await browser.close();
}
