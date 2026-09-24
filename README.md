# OnikArt

Russian-language portfolio, lead funnel, visitor chat and private operations admin. The production target is Vinext + Nitro on Vercel Functions, Neon PostgreSQL and Vercel Blob.

## Local setup

```bash
npm ci
cp .env.example .env.local
# Fill server-only values. DATABASE_URL must point to PostgreSQL.
npm run db:migrate
# Optional, only for a reviewed new database: npm run db:seed
npm run db:test
npm run dev
```

Do not commit `.env.local`. `DATABASE_URL`, admin credentials, `BLOB_READ_WRITE_TOKEN` and Telegram credentials are server-only. Use a Neon pooled connection string for `DATABASE_URL`.

## Commands

- `npm run dev` — local Vinext/Vite development server.
- `npm run build:vercel` — Vinext + Nitro Vercel-preset build; emits `.vercel/output`.
- `npm run build:pages` — isolated Vinext static export of the public showcase; emits `dist-pages/` without PostgreSQL or application secrets.
- `npm run build` / `npm run start` — legacy standalone Node workflow, not used by Vercel.
- `npm run db:generate` — generate PostgreSQL Drizzle migrations in `drizzle-pg/`.
- `npm run db:migrate` — apply pending migrations transactionally.
- `npm run db:seed` — optional insertion of reviewed default/system content into an intended new database; do not run blindly against existing Production data.
- `npm run db:test` — isolated PostgreSQL CRUD and reconnect-persistence check with cleanup.
- `npm test`, `npm run lint`, `npx tsc --noEmit` — verification.

## Persistence

All runtime relational access goes through `lib/postgres.ts` and `DATABASE_URL`. `db/schema.ts` is the PostgreSQL source schema; `drizzle-pg/` is the active migration set. The old `drizzle/`, `examples/d1/`, Cloudflare declarations and Sites hosting metadata are retained only as legacy compatibility artifacts and are not used by the Vercel runtime.

`lib/storage.ts` is the single Vercel Blob adapter for administrator-uploaded media. Git-tracked images, fonts and icons remain in `public/`. Runtime uploads are never persisted to a Vercel Function filesystem.

Production preparation and the manual Preview-to-Production checklist are in [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md). The old VPS guide is historical and is not the current deployment plan.

The temporary public-only GitHub Pages target and its content snapshot are documented in [GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md). Pages does not host the admin, APIs, lead form or chat; it does not replace the Vercel target.

## Critical invariants

- Keep the existing visual design and native-anchor navigation mitigation; do not reintroduce `next/link` without reproducing and retesting the Vinext production bug.
- Telegram delivery failure must not roll back the primary database operation.
- Do not invent Fasadof metrics, leads, reviews or analytics.
- Never expose secrets in client bundles, logs, reports or Git.
