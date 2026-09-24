import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("Pages uses an isolated Vinext export while Vercel retains Nitro", () => {
  const scripts = JSON.parse(read("package.json")).scripts;
  assert.match(scripts["build:pages"], /build-pages\.mjs/);
  assert.match(scripts["build:vercel"], /NITRO_PRESET=vercel/);
  assert.match(read("pages-site/next.config.ts"), /output: "export"/);
  assert.match(read("vercel.mjs"), /framework: "nitro"/);
  assert.ok(!fs.existsSync(path.join(root, "pages-site/app/admin")));
  assert.ok(!fs.existsSync(path.join(root, "pages-site/app/api")));
});

test("public snapshot cannot contain private domain tables or secret names", () => {
  const snapshot = read("data/public-snapshot.ts");
  for (const forbidden of ["DATABASE_URL", "ADMIN_PASSWORD_HASH", "BLOB_READ_WRITE_TOKEN", "TELEGRAM_BOT_TOKEN", "audit_logs", "notification_events", "conversations", "password_hash"])
    assert.doesNotMatch(snapshot, new RegExp(forbidden));
  assert.match(snapshot, /fasadof/);
  assert.match(read("pages-site/app/work/[slug]/page.tsx"), /generateStaticParams/);
});

test("static home has contact fallback without backend form or chat imports", () => {
  const home = read("pages-site/app/page.tsx");
  assert.match(home, /HomeContent/);
  assert.match(home, /StaticContact/);
  assert.doesNotMatch(home, /ChatWidget|sections\/Contact"/);
  assert.doesNotMatch(read("components/sections/StaticContact.tsx"), /\/api\//);
  assert.match(read("app/page.tsx"), /ChatWidget/);
  assert.match(read("components/sections/Contact.tsx"), /\/api\/leads/);
});
