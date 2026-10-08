export const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function filterArticles(articles, { query = '', company = 'Todas', month = 'all', topic = 'Todos', day = '' } = {}) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return articles.filter(a => (company === 'Todas' || a.company === company) && (month === 'all' || a.date.startsWith(month)) && (!day || a.date === day) && (topic === 'Todos' || a.tags.includes(topic)) && words.every(w => normalize([a.title, a.summary, a.company, a.product || '', ...a.tags].join(' ')).includes(w)));
}
export const sortArticles = articles => [...articles].sort((a,b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
export const monthLabel = month => new Intl.DateTimeFormat('es-CL',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-15T12:00:00Z'));
export const dateLabel = (date, short = false) => new Intl.DateTimeFormat('es-CL', {day:'numeric', month:short ? 'short' : 'long', year:'numeric', timeZone:'UTC'}).format(new Date(date + 'T12:00:00Z'));
export const groupEditions = (articles) => [...new Set(articles.map(a => a.date))].sort().reverse().map(date => ({date, articles:articles.filter(a => a.date === date)}));

/** Count readable words across legacy and Reporter V2 content, without double-rendering metadata. */
export const articleWordCount = article => {
  const parts = [article.title, article.summary, ...(article.body||[]), article.analysis, article.watch,
    article.executiveSummary, article.finalSummary, ...(article.quickTakeaways||[]),
    ...(article.limitations||[]), ...(article.practicalAdvice||[]),
    ...(article.usefulFacts||[]), ...(article.curiosities||[])];
  for (const section of article.sections||[]) parts.push(section.heading, ...(section.paragraphs||[]));
  return parts.filter(x=>typeof x==='string' && x.trim()).join(' ').trim().split(/\s+/).filter(Boolean).length;
};
export const estimatedReadingMinutes = (article,wordsPerMinute=200) => Math.max(2,Math.ceil(articleWordCount(article)/wordsPerMinute));
