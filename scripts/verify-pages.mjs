import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist-pages");
const { base, origin } = JSON.parse(fs.readFileSync(path.join(output, ".onikart-pages-generated"), "utf8"));
const required = ["index.html", "works/index.html", "tariffs/index.html", "work/fasadof/index.html", "privacy/index.html", "robots.txt", "favicon.svg", "images/fasadof.png", "images/onikart-hero-sculpture.webp", "fonts/mazzard/MazzardH-ExtraBold.woff2", "fonts/geologica/Geologica-Variable.ttf", ".nojekyll"];
for (const name of required) if (!fs.existsSync(path.join(output, name))) throw new Error(`Missing Pages artifact: ${name}`);
if (origin && !fs.existsSync(path.join(output, "sitemap.xml"))) throw new Error("Missing Pages sitemap");

const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, entry.name); if (entry.isDirectory()) walk(p); else files.push(p); } }
walk(output);
if (base) {
  const assets = files.filter(p => p.includes(`${path.sep}_next${path.sep}static${path.sep}`));
  if (!assets.length) throw new Error("Missing Pages framework assets");
  if (assets.some(p => !p.startsWith(path.join(output, "_next", "static") + path.sep))) throw new Error("Framework assets are nested under the Pages base directory");
  const runtimeFiles = files.filter(p => /\.(?:html|js|css|rsc)$/.test(p));
  let prefixedFrameworkReferences = 0;
  for (const filename of runtimeFiles) {
    const content = fs.readFileSync(filename, "utf8");
    const relative = path.relative(output, filename);
    if (/(?<![A-Za-z0-9._-])\/_next\/static\//.test(content)) throw new Error(`Root-relative framework asset in ${relative}`);
    if (content.includes(`${base}${base}/_next/`)) throw new Error(`Doubled Pages base path in ${relative}`);
    prefixedFrameworkReferences += content.split(`${base}/_next/static/`).length - 1;
  }
  if (!prefixedFrameworkReferences) throw new Error("Missing prefixed Pages framework references");
  for (const route of ["index.html", "works/index.html", "tariffs/index.html", "privacy/index.html", "work/fasadof/index.html"]) {
    const html = fs.readFileSync(path.join(output, route), "utf8");
    if (!html.includes(`${base}/_next/static/chunks/`) || !html.includes(`${base}/_next/static/css/`)) throw new Error(`Missing prefixed JS/CSS on ${route}`);
  }
}
const forbidden = ["DATABASE_URL", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "ADMIN_SESSION_SECRET", "BLOB_READ_WRITE_TOKEN", "TELEGRAM_BOT_TOKEN", "TELEGRAM_ADMIN_CHAT_ID", "BACKEND_ORIGIN", "audit_logs", "notification_events", "password_hash", "/api/chat", "/api/leads"];
for (const needle of forbidden) for (const filename of files) if (fs.readFileSync(filename).includes(Buffer.from(needle))) throw new Error(`Forbidden server-only marker in Pages artifact: ${needle}`);

for (const filename of files.filter(p => p.endsWith(".html"))) {
  const html = fs.readFileSync(filename, "utf8");
  if (html.includes('href="/admin') || html.includes('action="/api/')) throw new Error(`Backend link in ${path.relative(output, filename)}`);
  for (const [, ref] of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
    const url = new URL(ref, "https://pages.invalid");
    if (base && !url.pathname.startsWith(`${base}/`) && url.pathname !== base) throw new Error(`Unprefixed Pages URL: ${ref}`);
    const assetPath = decodeURIComponent(url.pathname.slice(base.length)).replace(/^\//, "");
    const candidate = path.join(output, assetPath || "index.html");
    if (!fs.existsSync(candidate) && !fs.existsSync(path.join(candidate, "index.html"))) throw new Error(`Broken Pages URL: ${ref}`);
  }
}
for (const filename of files.filter(p => p.endsWith(".css"))) {
  const css = fs.readFileSync(filename, "utf8");
  for (const [, raw] of css.matchAll(/url\(\s*["']?(\/[^)'"\s]+)["']?\s*\)/g)) {
    const url = new URL(raw, "https://pages.invalid");
    if (base && !url.pathname.startsWith(`${base}/`)) throw new Error(`Unprefixed CSS asset: ${raw}`);
    const assetPath = decodeURIComponent(url.pathname.slice(base.length)).replace(/^\//, "");
    if (!fs.existsSync(path.join(output, assetPath))) throw new Error(`Broken CSS asset: ${raw}`);
  }
}
for (const route of ["index.html", "tariffs/index.html"]) {
  const html = fs.readFileSync(path.join(output, route), "utf8");
  if (!html.includes("Индивидуально") || /\b(?:30|50|90)[\s\u00a0]?000\s?₽/.test(html)) throw new Error(`Incorrect public tariff prices in ${route}`);
}
console.log(`Pages artifact verified: ${files.length} files; base ${base || "/"}; no backend secrets/API paths.`);
