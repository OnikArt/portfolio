import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const stage = path.join(root, "pages-site");
const output = path.join(root, "dist-pages");
const repo = process.env.GITHUB_REPOSITORY?.split("/");
const repoName = repo?.[1] || path.basename(root.replace(/\/$/, ""));
const suppliedBase = process.env.PAGES_BASE_PATH ?? `/${repoName}`;
const base = suppliedBase === "/" ? "" : suppliedBase.replace(/\/$/, "");
if (base && !/^\/[A-Za-z0-9._-]+$/.test(base)) throw new Error("PAGES_BASE_PATH must be a single safe path segment or /");
const origin = process.env.PAGES_SITE_URL || (repo?.[0] && repo?.[1] ? `https://${repo[0]}.github.io/${repo[1]}` : "");
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== "https:" || url.pathname.replace(/\/$/, "") !== base) throw new Error("PAGES_SITE_URL must be an HTTPS URL ending in PAGES_BASE_PATH");
}

const publicLink = path.join(stage, "public");
if (!fs.existsSync(publicLink)) fs.symlinkSync(path.join(root, "public"), publicLink, "dir");
else if (!fs.lstatSync(publicLink).isSymbolicLink() || fs.realpathSync(publicLink) !== path.join(root, "public")) throw new Error("pages-site/public is not the expected generated symlink");

const env = {
  ...process.env,
  ONIKART_DEPLOY_TARGET: "pages",
  VITE_ONIKART_DEPLOY_TARGET: "pages",
  VITE_ONIKART_BASE_PATH: base,
  PAGES_BASE_PATH: base,
  PAGES_SITE_URL: origin,
};
const cli = path.join(root, "node_modules/vinext/dist/cli.js");
const build = spawnSync(process.execPath, [cli, "build"], { cwd: stage, env, stdio: "inherit" });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status || 1);

const source = path.join(stage, "dist/client");
if (!fs.existsSync(path.join(source, "index.html"))) throw new Error("Vinext did not emit static index.html");
const marker = path.join(output, ".onikart-pages-generated");
if (fs.existsSync(output)) {
  if (!fs.existsSync(marker)) throw new Error("Refusing to replace an unrecognized dist-pages directory");
  fs.rmSync(output, { recursive: true });
}
fs.cpSync(source, output, { recursive: true });
const viteManifestDir = path.join(output, ".vite");
if (fs.existsSync(viteManifestDir)) fs.rmSync(viteManifestDir, { recursive: true });
fs.writeFileSync(marker, JSON.stringify({ generatedBy: "build:pages", base, origin }));
fs.writeFileSync(path.join(output, ".nojekyll"), "");

// This Vinext release prerenders clean URLs without trailingSlash. GitHub Pages
// serves real directory index files on refresh, so keep both URL forms.
for (const route of ["privacy", "tariffs", "works"]) {
  const dir = path.join(output, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(output, `${route}.html`), path.join(dir, "index.html"));
}
const workRoot = path.join(output, "work");
if (fs.existsSync(workRoot)) for (const entry of fs.readdirSync(workRoot)) {
  if (!entry.endsWith(".html")) continue;
  const slug = entry.slice(0, -5);
  const dir = path.join(workRoot, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(workRoot, entry), path.join(dir, "index.html"));
}

// Vinext emits some framework/preload URLs at origin root even when public
// component paths already use sitePath(). Prefix only unprefixed root assets.
function patchAssets(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) patchAssets(filename);
    else if (entry.name === ".DS_Store") fs.unlinkSync(filename);
    else if (base && /\.(html|css|js)$/.test(filename)) {
      const original = fs.readFileSync(filename, "utf8");
      const updated = original.replace(/(?<![A-Za-z0-9._-])\/(?:_next|fonts|images|icons)\//g, match => `${base}${match}`);
      if (updated !== original) fs.writeFileSync(filename, updated);
    }
  }
}
patchAssets(output);
const routes = ["/", "/works/", "/tariffs/", "/privacy/"];
if (fs.existsSync(workRoot)) for (const entry of fs.readdirSync(workRoot)) if (entry.endsWith(".html")) routes.push(`/work/${entry.slice(0, -5)}/`);
fs.writeFileSync(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`);
if (origin) {
  const urls = routes.map(route => `  <url><loc>${origin}${route}</loc></url>`).join("\n");
  fs.writeFileSync(path.join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
console.log(`Static GitHub Pages artifact: ${output}`);
