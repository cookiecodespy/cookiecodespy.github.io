import test from 'node:test';
import assert from 'node:assert/strict';
import {filterArticles,groupEditions} from '../src/news.js';
const articles=[{date:'2026-10-07',company:'Google',title:'Edición de imágenes',summary:'Modelo nuevo',tags:['Imágenes']},{date:'2026-09-06',company:'OpenAI',title:'API para agentes',summary:'Desarrollo',tags:['Agentes']}];
test('Search handles accents and requires every query word',()=>{assert.equal(filterArticles(articles,{query:'edicion imagenes'}).length,1);assert.equal(filterArticles(articles,{query:'google agentes'}).length,0);});
test('Company, month and topic filters combine',()=>{assert.equal(filterArticles(articles,{company:'Google',month:'2026-09'}).length,0);assert.equal(filterArticles(articles,{topic:'Agentes',month:'2026-09'}).length,1);});
test('Editions group by date, newest first',()=>{assert.deepEqual(groupEditions(articles).map(e=>e.date),['2026-10-07','2026-09-06']);});
