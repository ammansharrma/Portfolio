import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { getProjectCollection, getProjectNeighbors, projectPath } from '../src/data/projectNavigation.js';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const personal = read('../src/data/projects.json').projects;
const companies = read('../src/data/experience/projects.json');
const diagrams = read('../src/data/architecture.json');

test('navigation wraps inside each collection without crossing boundaries', () => {
  for (const company of [undefined, ...Object.keys(companies)]) {
    const collection = getProjectCollection(personal, companies, company);
    for (const project of collection) {
      const { previous, next } = getProjectNeighbors(collection, project.id);
      for (const destination of [previous, next]) {
        assert.ok(collection.includes(destination));
        const path = projectPath(destination.id, company);
        assert.ok(path.startsWith(company ? `/experience/${company}/projects/` : '/projects/'));
        assert.ok(existsSync(new URL(`../dist${path}/index.html`, import.meta.url)), `Missing static route: ${path}`);
      }
    }
    assert.equal(getProjectNeighbors(collection, collection.at(-1).id).next.id, collection[0].id);
    assert.equal(getProjectNeighbors(collection, collection[0].id).previous.id, collection.at(-1).id);
  }
});

test('unknown companies and project IDs do not fall back to another collection', () => {
  assert.deepEqual(getProjectCollection(personal, companies, 'unknown'), []);
  assert.equal(getProjectNeighbors(personal, companies.mindstix.projects[0].id), null);
  assert.equal(getProjectNeighbors(companies.mindstix.projects, personal[0].id), null);
  assert.equal(getProjectNeighbors(companies.omnevu.projects, companies.mindstix.projects[0].id), null);
});

test('every project has a valid architecture graph and locally available icon assets', () => {
  const projects = [...personal, ...Object.values(companies).flatMap(company => company.projects)];
  for (const project of projects) {
    const diagram = diagrams[project.diagram || project.id];
    assert.ok(diagram, `Missing architecture: ${project.id}`);
    const ids = new Set(diagram.nodes.map(node => node.id));
    assert.equal(ids.size, diagram.nodes.length);
    for (const edge of diagram.edges) {
      assert.ok(ids.has(edge.from) && ids.has(edge.to));
      assert.notEqual(edge.from, edge.to);
    }
    for (const node of diagram.nodes) {
      assert.ok(node.x >= 0 && node.x + 220 <= 890);
      assert.ok(node.y >= 0 && node.y + 130 <= diagram.height);
      if (node.icon) assert.ok(existsSync(new URL(`../public/architecture/icons/${node.icon}.${node.icon === 'firebase' ? 'png' : 'svg'}`, import.meta.url)), `Missing icon: ${node.icon}`);
    }
  }
});
