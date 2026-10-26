import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { site, projects } from '../src/data/site.js';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { Layout } = await server.ssrLoadModule('/src/Portfolio.jsx');
  const template = await fs.readFile('dist/index.html', 'utf8');
  const routes = [['', 'Overview'], ['projects', 'Projects'], ['experience', 'Experience'], ['skills', 'Skills'], ['education', 'Education'], ['about', 'About'], ['services', 'Work with me'], ['contact', 'Contact'], ['ask', 'Portfolio guide'], ...projects.map(p => [`projects/${p.id}`, p.title])];
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  for (const [route, title] of [...routes, ['404', 'Page not found']]) {
    const markup = renderToString(React.createElement(StaticRouter, { basename: '/Portfolio', location: `/Portfolio/${route}` }, React.createElement(Layout)));
    const description = projects.find(p => `projects/${p.id}` === route)?.summary || (route ? `${title}. ${site.description}` : site.description);
    let html = template.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
      .replace(/<title>.*?<\/title>/, `<title>${escape(title)} | ${site.name}, Software Engineer</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(description)}`)
      .replace(/(<link rel="canonical" href=")[^"]*/, `$1${site.url}${route}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(title)} | ${site.name}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(description)}`)
      .replace(/(<meta property="og:url" content=")[^"]*/, `$1${site.url}${route}`);
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: site.fullName, jobTitle: site.role, url: site.url, sameAs: [site.github, site.linkedin] })}</script></head>`);
    const target = route === '404' ? 'dist/404.html' : path.join('dist', route, 'index.html');
    await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, html);
  }
  await fs.writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(([r]) => !['ask', 'contact'].includes(r)).map(([r]) => `<url><loc>${site.url}${r}</loc></url>`).join('')}</urlset>`);
  console.log(`Prerendered ${routes.length} routes, 404 and sitemap.`);
} finally { await server.close(); }
