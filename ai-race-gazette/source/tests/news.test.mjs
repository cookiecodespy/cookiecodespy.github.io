import test from 'node:test';
import assert from 'node:assert/strict';
import {filterArticles,groupEditions,sortArticles,monthLabel} from '../src/news.js';
const articles=[{date:'2026-10-07',company:'Google',title:'Edición de imágenes',summary:'Modelo nuevo',tags:['Imágenes']},{date:'2026-09-06',company:'OpenAI',title:'API para agentes',summary:'Desarrollo',tags:['Agentes']}];
test('Search handles accents and requires every query word',()=>{assert.equal(filterArticles(articles,{query:'edicion imagenes'}).length,1);assert.equal(filterArticles(articles,{query:'google agentes'}).length,0);});
test('Company, month and topic filters combine',()=>{assert.equal(filterArticles(articles,{company:'Google',month:'2026-09'}).length,0);assert.equal(filterArticles(articles,{topic:'Agentes',month:'2026-09'}).length,1);});
test('Editions group by date, newest first',()=>{assert.deepEqual(groupEditions(articles).map(e=>e.date),['2026-10-07','2026-09-06']);});
test('Several features from one company remain independent on the same day',()=>{
 const launches=[...Array(5)].map((_,i)=>({id:`feature-${i}`,date:'2026-10-07',company:'OpenAI',title:`Feature ${i}`,summary:'Nuevo producto',tags:['Productos']}));
 assert.equal(filterArticles(launches,{day:'2026-10-07',company:'OpenAI'}).length,5);
 assert.equal(groupEditions(launches)[0].articles.length,5);
 assert.equal(filterArticles(launches,{day:'2026-10-06'}).length,0);
 assert.deepEqual(sortArticles([...launches].reverse()).map(a=>a.id),launches.map(a=>a.id));
});
test('Month labels distinguish archive years',()=>{assert.match(monthLabel('2026-09'),/septiembre.*2026/);assert.match(monthLabel('2027-09'),/2027/);});
