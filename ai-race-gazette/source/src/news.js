export const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function filterArticles(articles, { query = '', company = 'Todas', month = 'all', topic = 'Todos' } = {}) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return articles.filter(a => (company === 'Todas' || a.company === company) && (month === 'all' || a.date.startsWith(month)) && (topic === 'Todos' || a.tags.includes(topic)) && words.every(w => normalize([a.title, a.summary, a.company, ...a.tags].join(' ')).includes(w)));
}
export const dateLabel = (date, short = false) => new Intl.DateTimeFormat('es-CL', {day:'numeric', month:short ? 'short' : 'long', year:'numeric', timeZone:'UTC'}).format(new Date(date + 'T12:00:00Z'));
export const groupEditions = (articles) => [...new Set(articles.map(a => a.date))].sort().reverse().map(date => ({date, articles:articles.filter(a => a.date === date)}));
