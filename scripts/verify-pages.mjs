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
console.log(`Pages artifact verified: ${files.length} files; base ${base || "/"}; no backend secrets/API paths.`);
