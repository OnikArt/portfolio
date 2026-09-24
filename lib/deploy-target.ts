// Vite inlines these public, non-secret build flags into both server and client builds.
export const isPagesBuild = import.meta.env.VITE_ONIKART_DEPLOY_TARGET === "pages";
export const isFullStackBuild = !isPagesBuild;

const pagesBasePath = (import.meta.env.VITE_ONIKART_BASE_PATH || "").replace(/\/$/, "");
export function sitePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return isPagesBuild ? `${pagesBasePath}${path}` : path;
}
