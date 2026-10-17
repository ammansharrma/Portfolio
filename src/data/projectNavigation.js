// A route chooses its collection once; navigation never falls back to another collection.
export function getProjectCollection(personalProjects, companies, company) {
  return company ? (companies[company]?.projects ?? []) : personalProjects;
}

export function projectPath(id, company) {
  return company ? `/experience/${company}/projects/${id}` : `/projects/${id}`;
}

export function getProjectNeighbors(projects, id) {
  const index = projects.findIndex(project => project.id === id);
  if (index < 0 || projects.length < 2) return null;
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
    index,
    total: projects.length,
  };
}
