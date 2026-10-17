import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// GitHub Pages serves real files, so each shareable route gets the built app shell.
const root = fileURLToPath(new URL('../', import.meta.url));
const { projects } = JSON.parse(await readFile(resolve(root, 'src/data/projects.json'), 'utf8'));
const companies = JSON.parse(await readFile(resolve(root, 'src/data/experience/projects.json'), 'utf8'));
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const routes = [
  ...Object.keys(companies).map(company => `experience/${company}`),
  ...projects.map(({ id }) => `projects/${id}`),
  ...Object.entries(companies).flatMap(([company, experience]) => experience.projects.map(({ id }) => `experience/${company}/projects/${id}`)),
];
for (const route of routes) {
  const directory = resolve(root, 'dist', route);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), html);
}
await writeFile(resolve(root, 'dist/404.html'), html);
console.log(`Created ${routes.length} static route entries and a not-found page.`);
