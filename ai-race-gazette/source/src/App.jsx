import { useEffect, useMemo, useRef, useState } from 'react';
import { dateLabel, filterArticles, groupEditions, sortArticles, monthLabel } from './news.js';
const asset = path => `${import.meta.env.BASE_URL}${path}`;
const readPreferences = () => {try{return JSON.parse(sessionStorage.getItem('gazette-filters'))||{};}catch{return {};}};
const preferences = readPreferences();
const getRoute = () => {try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}};
function Rule({heavy=false}) {return <div className={heavy?'rule heavy':'rule'} aria-hidden="true"/>;}
function Masthead({query,onQuery,home}) {return <header className="masthead archive-masthead"><div className="header-meta">Edición digital · Archivo diario</div><a href="#" className="brand"><span>AI Race Gazette</span><small>Noticias de IA · Archivo diario y cobertura de la industria</small></a>{home ? <label className="search header-search"><span>Buscar en el archivo</span><input type="search" value={query} onChange={e=>onQuery(e.target.value)} placeholder="Buscar compañías, modelos, productos o noticias…"/></label> : <a className="button header-home" href="#">Volver al archivo</a>}</header>;}
function NewsCover({article,index}) {return <a className="edition-card news-cover" href={`#articulo/${article.id}`}><div className="card-paper" aria-hidden="true"/><div className="card-content"><div className="card-date"><span>Noticia</span><time dateTime={article.date}>{dateLabel(article.date,true)}</time><span>Acceso libre</span></div><div className="card-mast">AI Race Gazette</div><div className="eyebrow">{article.company} · {article.product||'Novedad'}</div><h3>{article.title}</h3><p>{article.summary}</p><div className="cover-detail"><img src={asset(article.image)} alt={article.imageAlt} loading={index<4?'eager':'lazy'} width="600" height="400"/><div className="cover-keys"><h4>Puntos clave</h4>{article.keyPoints.slice(0,2).map(point=><p key={point}>{point}</p>)}</div></div><div className="cover-tags">{article.tags.map(t=><span key={t}>{t}</span>)}</div><div className="card-bottom"><span>Fuente oficial</span><span>Abrir noticia</span></div></div></a>;}
function Illustration({article,hero=false}) {return <figure className="hero-art"><img src={asset(article?.image||'assets/hero.webp')} alt={article?.imageAlt||'Grabado de un humanoide mecánico junto a un globo terrestre'} loading={hero?'eager':'lazy'} width="900" height="600"/><figcaption>{article?.imageCredit||'Ilustración editorial generada con IA · AI Race Gazette'}</figcaption></figure>;}
function MiniArticle({article,index}) {return <a className="mini-article" href={`#articulo/${article.id}`}><div className="company-name">{article.company}</div><img src={asset(article.image)} alt="" loading="lazy" width="400" height="220"/><h3>{article.title}</h3><p>{article.summary}</p><span className="read-label">Leer noticia <span>Pág. {index+2}</span></span></a>;}
const articleWordCount = article => {
 const parts=[article.title,article.summary,...(article.body||[]),article.analysis,article.watch,article.executiveSummary,article.finalSummary,...(article.quickTakeaways||[]),...(article.limitations||[]),...(article.practicalAdvice||[]),...(article.usefulFacts||[]),...(article.curiosities||[])];
 for(const section of article.sections||[]) parts.push(section.heading,...(section.paragraphs||[]));
 return parts.filter(Boolean).join(' ').trim().split(/\\s+/).filter(Boolean).length;
};
function DetailList({title,items,className=''}) {
 if(!items?.length)return null;
 return <section className={`detail-card ${className}`}><h2>{title}</h2><dl>{items.map((item,i)=><div className="detail-row" key={item.label+i}><dt>{item.label}</dt><dd>{item.value}{item.note&&<small>{item.note}</small>}</dd></div>)}</dl></section>;
}
function BulletBlock({title,items,className=''}) {
 if(!items?.length)return null;
 return <section className={`report-block ${className}`}><h2>{title}</h2><ul>{items.map((item,i)=><li key={item+i}>{item}</li>)}</ul></section>;
}
function AvailabilityCard({availability}) {
 if(!availability)return null;
 const groups=[['Plataformas',availability.platforms],['Regiones',availability.regions],['Requisitos',availability.requirements],['Notas',availability.notes]].filter(([,items])=>items?.length);
 return <section className="detail-card availability-card"><h2>Disponibilidad</h2>{availability.status&&<p className="availability-status">{availability.status}</p>}{groups.map(([label,items])=><div className="availability-group" key={label}><h3>{label}</h3><ul>{items.map((item,i)=><li key={item+i}>{item}</li>)}</ul></div>)}</section>;
}
function Timeline({items}) {
 if(!items?.length)return null;
 return <section className="report-block timeline-block"><h2>Cronología</h2><ol>{items.map((item,i)=><li key={item.date+item.label+i}><time dateTime={item.date}>{dateLabel(item.date,true)}</time><div><strong>{item.label}</strong>{item.description&&<p>{item.description}</p>}</div></li>)}</ol></section>;
}
function ComparisonBlock({items}) {
 if(!items?.length)return null;
 return <section className="report-block comparison-block"><h2>Contexto competitivo</h2>{items.map((item,i)=><article key={item.subject+i}><h3>{item.subject}</h3><p>{item.comparison}</p><small><b>Base:</b> {item.basis}{item.caveat&&<> · {item.caveat}</>}</small></article>)}</section>;
}
function MediaGallery({items}) {
 if(!items?.length)return null;
 return <div className="article-media-grid">{items.map((media,i)=><figure key={media.src+i}><img src={asset(media.src)} alt={media.alt} loading="lazy"/><figcaption>{media.caption&&<span>{media.caption} </span>}{media.credit}</figcaption></figure>)}</div>;
}
function Article({article,articles,onShare}) {
 const readingMinutes=Math.max(2,Math.ceil(articleWordCount(article)/200));
 const isV2=article.articleVersion===2;
 const secondaryMedia=(article.media||[]).filter(media=>media.src!==article.image);
 return <article className={isV2?'full-article reporter-v2':'full-article'}>
  <div className="article-nav"><a href="#">Volver a la portada</a><a href={`#edicion/${article.date}`}>Edición del {dateLabel(article.date,true)}</a></div>
  <Rule/>
  <div className="section-meta"><span>{article.company} · {dateLabel(article.date)}</span><span>{article.tags.join(' · ')}</span></div>
  {isV2&&<div className="reporter-strip"><span>Informe Reporter V2</span><span>{article.product||'Cobertura especial'}</span></div>}
  <h1>{article.title}</h1>
  <p className="article-deck">{article.summary}</p>
  <div className="byline"><span>Redacción AI Race Gazette · {readingMinutes} min de lectura{isV2?' · Informe ampliado':''}</span><button onClick={onShare}>Copiar enlace</button></div>
  <Illustration article={article} hero/>
  {article.quickTakeaways?.length>0&&<section className="quick-brief"><div><span className="quick-kicker">Lectura rápida</span><h2>En 30 segundos</h2></div><ul>{article.quickTakeaways.map((point,i)=><li key={point+i}>{point}</li>)}</ul></section>}
  <div className="story-layout">
   <div className="story">
    {article.executiveSummary&&<section className="report-block executive-summary"><span className="report-label">Resumen ejecutivo</span><h2>La noticia, en contexto</h2><p>{article.executiveSummary}</p></section>}
    {(article.body||[]).map((p,i)=><p key={i}>{p}</p>)}
    <MediaGallery items={secondaryMedia}/>
    {article.sections?.map((section,i)=><section className={`report-block report-section ${section.kind||''}`} key={section.heading+i}><h2>{section.heading}</h2>{section.paragraphs.map((p,j)=><p key={j}>{p}</p>)}</section>)}
    <Timeline items={article.timeline}/>
    <ComparisonBlock items={article.comparisons}/>
    <section className="analysis gazette-analysis"><span className="report-label">Opinión separada de los hechos</span><h2>La lectura del Gazette</h2><p>{article.analysis}</p><small>Análisis editorial · AI Race Gazette</small></section>
    <BulletBlock title="Consejos prácticos" items={article.practicalAdvice} className="advice-block"/>
    <BulletBlock title="Datos útiles" items={article.usefulFacts} className="useful-block"/>
    <BulletBlock title="Datos curiosos" items={article.curiosities} className="curiosity-block"/>
    <BulletBlock title="Limitaciones y preguntas abiertas" items={article.limitations} className="limitations-block"/>
    {article.finalSummary&&<section className="report-block final-summary"><span className="report-label">Cierre</span><h2>Resumen final</h2><p>{article.finalSummary}</p></section>}
    <section className="report-block watch-block"><h2>Qué seguir ahora</h2><p>{article.watch}</p></section>
   </div>
   <aside className="article-aside">
    <div className="key-box"><h2>Puntos clave</h2><ol>{article.keyPoints.map(p=><li key={p}>{p}</li>)}</ol></div>
    <DetailList title="En números y detalles" items={article.technicalDetails}/>
    <DetailList title="Precio" items={article.pricing} className="pricing-card"/>
    <AvailabilityCard availability={article.availability}/>
    <div className="source-box"><h2>Sobre esta cobertura</h2><p>{article.announcedAt?`Anuncio original: ${dateLabel(article.announcedAt)}.`:'Fecha original sin confirmar.'}</p><p>Revisada el {dateLabel(article.verifiedAt)}.</p>{article.verificationNote&&<p>{article.verificationNote}</p>}<p>Hechos, claims del proveedor y análisis editorial se distinguen según la política del Gazette.</p>{article.imageStatus==='needs-specific-art'&&<p><b>Visual:</b> la ilustración actual es temporal; existe un brief para arte específico.</p>}{article.corrections?.map(c=><p key={c.date+c.note}><b>Corrección · {dateLabel(c.date)}:</b> {c.note}</p>)}</div>
   </aside>
  </div>
  <section className="sources"><div className="source-heading"><span className="report-label">Fuentes y trazabilidad</span><h2>Consulta la evidencia original</h2><p>El Gazette prioriza anuncios, documentación, papers y repositorios primarios; las fuentes secundarias se usan para contexto adicional.</p></div><div className="source-links"><a className="button primary" href={article.source.url} target="_blank" rel="noopener noreferrer">{article.source.name} · Fuente principal</a>{article.relatedSources?.map(s=><a className="related-source" key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>)}</div></section>
  {articles.some(a=>a.date===article.date&&a.id!==article.id)&&<><Rule/><h2 className="related-title">Más noticias del mismo día</h2><div className="headlines">{articles.filter(a=>a.date===article.date&&a.id!==article.id).slice(0,8).map((a,i)=><MiniArticle key={a.id} article={a} index={i}/>)}</div></>}
 </article>;
}
const coverageStatusLabel = status => ({complete:'Cobertura completa',partial:'Cobertura parcial',pending:'Pendiente de revisión','reviewed-no-material-news':'Revisado · sin novedades materiales'}[status]||status);
const coverageEmptyMessage = status => status==='reviewed-no-material-news'?'Este día fue revisado de forma exhaustiva y no encontramos una novedad material verificable que justificara un artículo.':status==='complete'?'Este día está auditado como completo; no hay artículos materiales publicados para esta fecha.':status==='partial'?'La cobertura de este día todavía es parcial. Puede haber novedades pendientes de verificación.':'Este día está pendiente de una revisión histórica completa.';
const calendarDays = (month,coverage) => {
 const [year,monthNumber]=month.split('-').map(Number);
 const total=new Date(Date.UTC(year,monthNumber,0)).getUTCDate();
 const mondayOffset=(new Date(Date.UTC(year,monthNumber-1,1)).getUTCDay()+6)%7;
 const byDate=new Map(coverage.map(row=>[row.date,row]));
 return {mondayOffset,days:Array.from({length:total},(_,i)=>{const date=`${month}-${String(i+1).padStart(2,'0')}`;return {day:i+1,date,coverage:byDate.get(date)||null};})};
};
function CoverageCalendar({dailyCoverage,month}) {
 if(!dailyCoverage?.length)return null;
 const months=[...new Set(dailyCoverage.map(row=>row.date.slice(0,7)))].sort();
 const activeMonth=month!=='all'&&months.includes(month)?month:months.at(-1);
 const {mondayOffset,days}=calendarDays(activeMonth,dailyCoverage);
 const monthRows=dailyCoverage.filter(row=>row.date.startsWith(activeMonth));
 const totals=monthRows.reduce((acc,row)=>{acc[row.status]=(acc[row.status]||0)+1;return acc;},{});
 return <section className="coverage-calendar" aria-labelledby="coverage-calendar-title">
  <div className="coverage-calendar-heading"><div><span className="eyebrow">Cronología auditable</span><h2 id="coverage-calendar-title">{monthLabel(activeMonth)}</h2></div><p>{totals.complete||0} completos · {totals['reviewed-no-material-news']||0} sin novedades · {(totals.partial||0)+(totals.pending||0)} por cerrar</p></div>
  <div className="calendar-legend" aria-label="Leyenda de cobertura"><span className="complete">Completo</span><span className="partial">Parcial</span><span className="pending">Pendiente</span><span className="reviewed-no-material-news">Sin novedades</span></div>
  <div className="calendar-grid" role="grid" aria-label={`Cobertura de ${monthLabel(activeMonth)}`}>
   {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(label=><div className="calendar-weekday" role="columnheader" key={label}>{label}</div>)}
   {Array.from({length:mondayOffset},(_,i)=><div className="calendar-pad" aria-hidden="true" key={`pad-${i}`}/>)}
   {days.map(({day,date,coverage})=><a role="gridcell" className={`calendar-day ${coverage?.status||'pending'}`} href={`#edicion/${date}`} aria-label={`${dateLabel(date,true)} · ${coverageStatusLabel(coverage?.status||'pending')} · ${coverage?.verifiedArticles||0} noticias`} key={date}><strong>{day}</strong><span>{coverage?.verifiedArticles||0} {coverage?.verifiedArticles===1?'noticia':'noticias'}</span><small>{coverageStatusLabel(coverage?.status||'pending')}</small></a>)}
  </div>
 </section>;
}
function Edition({edition,coverage,allCoverage}) {
 const dates=allCoverage.map(row=>row.date);
 const index=dates.indexOf(edition.date);
 const previous=index>0?dates[index-1]:null;
 const next=index>=0&&index<dates.length-1?dates[index+1]:null;
 const nav=<div className="article-nav"><a href="#">Volver a la hemeroteca</a><span className="edition-day-nav">{previous&&<a href={`#edicion/${previous}`}>← {dateLabel(previous)}</a>}{next&&<a href={`#edicion/${next}`}>{dateLabel(next)} →</a>}</span></div>;
 if(!edition.articles.length)return <section className="daily-edition empty-edition">{nav}<Rule/><div className="section-meta"><span>Edición diaria · {coverageStatusLabel(coverage?.status||'pending')}</span><span>{dateLabel(edition.date)}</span></div><h1 className="edition-title">La carrera de la IA,<br/>día a día.</h1><div className={`empty-edition-panel ${coverage?.status||'pending'}`}><span className="eyebrow">Estado de la jornada</span><h2>{coverageStatusLabel(coverage?.status||'pending')}</h2><p>{coverageEmptyMessage(coverage?.status||'pending')}</p><p><b>{coverage?.verifiedArticles||0} noticias verificadas</b> registradas para esta fecha.</p></div></section>;
 return <section className="daily-edition">{nav}<Rule/><div className="section-meta"><span>Edición diaria · {coverageStatusLabel(coverage?.status||'partial')}</span><span>{dateLabel(edition.date)}</span></div><h1 className="edition-title">La carrera de la IA,<br/>día a día.</h1><div className="edition-lead"><a href={`#articulo/${edition.articles[0].id}`}><div className="eyebrow">{edition.articles[0].company}</div><h2>{edition.articles[0].title}</h2><p>{edition.articles[0].summary}</p><span className="read-label">Leer la noticia completa</span></a><Illustration article={edition.articles[0]} hero/></div><Rule/><div className="headlines">{edition.articles.slice(1).map((a,i)=><MiniArticle key={a.id} article={a} index={i}/>)}</div></section>;
}
export function App() {
 const [data,setData]=useState(null),[error,setError]=useState(false),[route,setRoute]=useState(getRoute),[query,setQuery]=useState(preferences.query||''),[company,setCompany]=useState(preferences.company||'Todas'),[month,setMonth]=useState(preferences.month||'all'),[topic,setTopic]=useState(preferences.topic||'Todos'),[day,setDay]=useState(preferences.day||''),[view,setView]=useState(preferences.view==='list'?'list':'covers'),[limit,setLimit]=useState(12),[message,setMessage]=useState('');const mainRef=useRef(null);
 useEffect(()=>{const c=new AbortController();fetch(asset('data/news.json'),{signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setData).catch(e=>{if(e.name!=='AbortError')setError(true);});return()=>c.abort();},[]);
 useEffect(()=>{const f=()=>setRoute(getRoute());window.addEventListener('hashchange',f);return()=>window.removeEventListener('hashchange',f);},[]);
 useEffect(()=>{window.scrollTo({top:0});mainRef.current?.focus({preventScroll:true});},[route]);useEffect(()=>setLimit(12),[query,company,month,topic,day]);useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(''),3000);return()=>clearTimeout(t);},[message]);
 useEffect(()=>{try{sessionStorage.setItem('gazette-filters',JSON.stringify({query,company,month,topic,day,view}));}catch{}},[query,company,month,topic,day,view]);
 const articles=data?.articles||[];const dailyCoverage=data?.dailyCoverage||[];const selectedCoverage=day?dailyCoverage.find(row=>row.date===day):null;const coverageCounts=dailyCoverage.reduce((acc,row)=>{acc[row.status]=(acc[row.status]||0)+1;return acc;},{});const filtered=useMemo(()=>sortArticles(filterArticles(articles,{query,company,month,topic,day})),[data,query,company,month,topic,day]);const allEditions=groupEditions(articles);const selected=route.startsWith('articulo/')?articles.find(a=>a.id===route.slice(9)):null;const editionDate=route.startsWith('edicion/')?route.slice(8):null;const editionCoverage=editionDate?dailyCoverage.find(row=>row.date===editionDate):null;const editionFromArticles=editionDate?allEditions.find(e=>e.date===editionDate):null;const edition=editionDate&&(editionCoverage||editionFromArticles)?(editionFromArticles||{date:editionDate,articles:[]}):null;
 useEffect(()=>{const title=selected?`${selected.title} — AI Race Gazette`:edition?`Edición del ${dateLabel(edition.date)} — AI Race Gazette`:'AI Race Gazette — Noticias de IA y tecnología';const description=selected?selected.summary:edition?`${edition.articles.length} noticias verificadas de la carrera de la IA del ${dateLabel(edition.date)}.`:'La carrera de la inteligencia artificial, contada día a día. Noticias, contexto, análisis y fuentes en una hemeroteca independiente.';document.title=title;const setMeta=(selector,content)=>{const node=document.querySelector(selector);if(node)node.setAttribute('content',content);};setMeta('meta[name="description"]',description);setMeta('meta[property="og:title"]',title);setMeta('meta[property="og:description"]',description);setMeta('meta[property="og:url"]',location.href);setMeta('meta[name="twitter:title"]',title);setMeta('meta[name="twitter:description"]',description);if(selected?.image){const imageUrl=new URL(asset(selected.image),location.href).href;setMeta('meta[property="og:image"]',imageUrl);setMeta('meta[name="twitter:image"]',imageUrl);}},[selected,edition]);
 const reset=()=>{setQuery('');setCompany('Todas');setMonth('all');setTopic('Todos');setDay('');};const share=async()=>{try{await navigator.clipboard.writeText(location.href);setMessage('Enlace copiado');}catch{setMessage('Puedes copiar el enlace desde la barra de direcciones.');}};
 return <><a className="skip" href="#contenido" onClick={e=>{e.preventDefault();mainRef.current?.focus();}}>Saltar al contenido</a><div className="newspaper"><div className="paper-surface" aria-hidden="true"/><div className="paper-content"><Masthead query={query} onQuery={setQuery} home={!route}/><main id="contenido" ref={mainRef} tabIndex="-1">{error?<div className="empty"><h1>No pudimos cargar la edición</h1><p>Comprueba tu conexión e inténtalo de nuevo.</p><button className="button" onClick={()=>location.reload()}>Reintentar</button></div>:!data?<p className="loading" role="status">Preparando la edición…</p>:selected?<Article article={selected} articles={articles} onShare={share}/>:edition?<Edition edition={edition} coverage={editionCoverage} allCoverage={dailyCoverage}/>:route?<div className="empty"><h1>Esta página no está en el archivo</h1><a className="button" href="#">Volver a la portada</a></div>:<>
 <section className="project-intro"><div className="intro-frame"><div className="eyebrow">Edición diaria · Archivo interactivo</div><h1>Noticias de IA</h1><p>Explora el archivo diario de lanzamientos, anuncios y movimientos más importantes del ecosistema. Puedes navegar cada edición como <b>portada</b> o como <b>lista</b>; al tocar una noticia, se abre una <b>página completa</b> con contexto, puntos clave y enlaces a la fuente original.</p></div></section>
 <section className="archive-controls" aria-label="Explorar noticias"><div className="toolbar"><div className="view-toggle" aria-label="Vista del archivo"><button className={view==='covers'?'button primary':'button'} aria-pressed={view==='covers'} onClick={()=>setView('covers')}>Vista portadas</button><button className={view==='list'?'button primary':'button'} aria-pressed={view==='list'} onClick={()=>setView('list')}>Vista lista</button></div><div className="month-filters" aria-label="Filtrar por mes"><button className={month==='all'?'button primary':'button'} aria-pressed={month==='all'} onClick={()=>{setMonth('all');setDay('');}}>Todo</button>{[...new Set(['2026-09',...articles.map(a=>a.date.slice(0,7))])].sort().map(m=><button key={m} className={month===m?'button primary':'button'} aria-pressed={month===m} onClick={()=>{setMonth(m);setDay('');}}>{monthLabel(m)}</button>)}</div><label className="day-filter">Día<input type="date" aria-label="Filtrar por día" value={day} min={data.archiveStart||data.coverageStart} max={data.updatedAt.slice(0,10)} onChange={e=>{setDay(e.target.value);if(e.target.value)setMonth(e.target.value.slice(0,7));}}/></label></div><nav className="category-chips" aria-label="Filtrar por compañía o tema"><button className={company==='Todas'&&topic==='Todos'?'category-chip active':'category-chip'} aria-pressed={company==='Todas'&&topic==='Todos'} onClick={()=>{setCompany('Todas');setTopic('Todos');}}>Todos</button>{[...new Set(articles.map(a=>a.company))].sort().map(c=><button key={c} className={company===c?'category-chip active':'category-chip'} aria-pressed={company===c} onClick={()=>{setCompany(company===c?'Todas':c);}}>{c}</button>)}{[...new Set(articles.flatMap(a=>a.tags))].sort().map(t=><button key={t} className={topic===t?'category-chip active':'category-chip'} aria-pressed={topic===t} onClick={()=>{setTopic(topic===t?'Todos':t);}}>{t}</button>)}</nav>{(query||company!=='Todas'||topic!=='Todos'||month!=='all'||day)&&<div className="filter-summary"><span>{[query&&`Búsqueda: ${query}`,company!=='Todas'&&company,topic!=='Todos'&&topic,day?dateLabel(day):month!=='all'&&monthLabel(month)].filter(Boolean).join(' · ')}</span><button className="button" onClick={reset}>Limpiar filtros</button></div>}</section>
 <CoverageCalendar dailyCoverage={dailyCoverage} month={month}/>
 <section className="archive archive-results" aria-label="Noticias del archivo"><div className="results-meta"><span role="status">{filtered.length} {filtered.length===1?'noticia':'noticias'}</span><span>Más recientes primero</span>{day&&selectedCoverage&&<span className={`coverage-state ${selectedCoverage.status}`}>{coverageStatusLabel(selectedCoverage.status)}</span>}</div>{filtered.length===0?<div className="empty"><h3>No hay noticias con esos filtros</h3><p>{day&&!articles.some(a=>a.date===day)?coverageEmptyMessage(selectedCoverage?.status||'pending'):'Prueba con otra fecha, compañía o tema.'}</p><button className="button" onClick={reset}>Limpiar filtros</button></div>:view==='covers'?<div className="edition-grid">{filtered.slice(0,limit).map((a,i)=><NewsCover key={a.id} article={a} index={i}/>)}</div>:<div className="news-list">{filtered.slice(0,limit).map(a=><a className="news-list-item" href={`#articulo/${a.id}`} key={a.id}><div className="card-paper" aria-hidden="true"/><div className="list-content"><div className="eyebrow"><time dateTime={a.date}>{dateLabel(a.date)}</time> · {a.company} · {a.tags.join(' · ')}</div><h3>{a.title}</h3><p>{a.summary}</p><div className="cover-tags">{a.tags.map(t=><span key={t}>{t}</span>)}</div></div><span className="button list-open">Abrir</span></a>)}</div>}{filtered.length>limit&&<button className="button more" onClick={()=>setLimit(l=>l+12)}>Mostrar más noticias</button>}<p className="coverage-note">Archivo en reconstrucción: {dateLabel(data.archiveStart||data.coverageStart)}–{dateLabel(data.updatedAt.slice(0,10))}. {articles.length} noticias verificadas en {allEditions.length} días con artículos.{dailyCoverage.length>0&&<> Estado editorial: {coverageCounts.complete||0} días completos · {coverageCounts['reviewed-no-material-news']||0} revisados sin novedades materiales · {(coverageCounts.pending||0)+(coverageCounts.partial||0)} todavía pendientes o parciales.</>}</p></section></>}</main><footer><Rule/><div className="footer-name">AI Race Gazette</div><p>El futuro se escribe cada día.</p><div className="footer-links"><a href="#">Portada</a><a href={asset('feed.xml')}>RSS</a><a href="https://github.com/cookiecodespy/cookiecodespy.github.io/tree/main/ai-race-gazette" target="_blank" rel="noopener noreferrer">Código & correcciones</a></div><small>Publicación independiente · Resúmenes asistidos por IA · Ilustraciones editoriales generadas con IA<br/>Las marcas pertenecen a sus respectivos titulares.</small></footer></div></div><div className="toast" role="status">{message}</div></>;
}
