// scripts/generate-sitemap.js
// Runs as a postbuild script to generate /public/sitemap.xml
// Usage: node scripts/generate-sitemap.js
// npm script: "postbuild": "node scripts/generate-sitemap.js"

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://eecohm.edu.np';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// All static routes
const staticRoutes = [
  { path: '/',           changefreq: 'weekly',  priority: '1.0' },
  { path: '/about',      changefreq: 'monthly', priority: '0.8' },
  { path: '/programs',   changefreq: 'monthly', priority: '0.9' },
  { path: '/facilities', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact',    changefreq: 'monthly', priority: '0.7' },
];

// Dynamic program routes — must match slugs in src/data/content.js
const programSlugs = [
  'advanced-diploma-computer-science',
  'advanced-diploma-hotel-management',
  'diploma-hotel-management',
  'business-studies',
  'plus-two-hotel-management',
  'plus-two-computer-science',
  'pre-school-to-secondary',
];

const programRoutes = programSlugs.map((slug) => ({
  path: `/programs/${slug}`,
  changefreq: 'monthly',
  priority: '0.8',
}));

const allRoutes = [...staticRoutes, ...programRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outPath, sitemap, 'utf8');
console.log(`✅ sitemap.xml generated at ${outPath} (${allRoutes.length} URLs, lastmod: ${today})`);
