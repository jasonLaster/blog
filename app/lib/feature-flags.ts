export function isProjectsPageEnabled() {
  const value = process.env.PROJECTS_PAGE_ENABLED?.toLowerCase();
  return value === "1" || value === "true";
}
