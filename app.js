'use strict';
document.addEventListener('DOMContentLoaded', async () => {
    if (window.top !== window.self) window.top.location = window.self.location;
    document.body.addEventListener('click', (e) => {
        const l = e.target.closest('a[target="_blank"]');
        if (l) l.setAttribute('rel', 'noopener noreferrer');
    });
    const rootPrefix = (window.location.pathname.split('/').length > 2) ? '../'.repeat(window.location.pathname.split('/').length - 2) : '';
    initSchemaOrg(rootPrefix);
    const c = document.querySelector('.blog-section');
    if (!c) return;
    const lang = document.documentElement.lang || 'en';
    const path = lang === 'bg' ? '../blog-data.json' : 'blog-data.json';
    try {
        const res = await fetch(path);
        if (!res.ok) throw 0;
        const data = await res.json();
        const articles = data[lang] || [];
        renderArticles(articles, c);
        initLocalSearch(articles, c, lang);
    } catch { c.innerHTML = '<p>Error loading articles.</p>'; }
});
function renderArticles(articles, container) {
    container.innerHTML = '';
    if (!articles.length) {
        container.innerHTML = document.documentElement.lang === 'bg' ? '<p>Няма намерени статии.</p>' : '<p>No articles found.</p>';
        return;
    }
    const f = document.createDocumentFragment();
    articles.forEach(({ date, displayDate, title, excerpt, link }) => {
        const card = document.createElement('article'); card.className = 'blog-card';
        const t = document.createElement('time'); t.setAttribute('datetime', date); t.textContent = displayDate;
        const h = document.createElement('h3'); const a = document.createElement('a'); a.href = link; a.textContent = title; h.appendChild(a);
        const p = document.createElement('p'); p.textContent = excerpt;
        card.append(t, h, p); f.appendChild(card);
    });
    container.appendChild(f);
}
function initLocalSearch(articles, container, lang) {
    const searchInput = document.getElementById('site-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = articles.filter(article => 
            article.title.toLowerCase().includes(query) || 
            article.excerpt.toLowerCase().includes(query)
        );
        renderArticles(filtered, container);
    });
}
async function initSchemaOrg(prefix) {
    try {
        const res = await fetch(`${prefix}schema.json`);
        if (!res.ok) return;
        const json = await res.json();
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(json);
        document.head.appendChild(script);
    } catch (e) {}
}
