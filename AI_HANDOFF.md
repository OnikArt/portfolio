# OnikArt — current AI handoff

Last verified: 2026-09-22, Europe/Moscow. This file describes the current working tree and replaces older D1/Sites handoff statements.

## Product and invariants

OnikArt is a Russian-language portfolio, lead funnel, visitor chat and private operations admin. Preserve the existing black/white/acid-lime design, Geologica/Mazzard typography, copy and responsive behavior. Do not invent Fasadof metrics or synthetic leads/reviews/analytics. Telegram failure must never roll back the primary database operation. Never expose credentials in client bundles, logs, Git or reports.

Do not reintroduce `next/link` without reproducing and retesting the Vinext production bug. The current semantic native-anchor navigation plus unminified production output is deliberate: it fixed production left-click failures caused by Vinext beta.5 navigation imports. Do not patch generated output or `node_modules`.

## Current architecture

- Vinext 1.0.0-beta.5, Next compatibility package 16.3.4, React 19.2.6, Vite 8, TypeScript 5.9 and Drizzle 0.45.
- One full-stack application: Server Components, pages, route handlers and cookie auth share an origin.
- PostgreSQL is the only active relational runtime, via `DATABASE_URL`, `pg` and `lib/postgres.ts`.
- `db/schema.ts` is PostgreSQL; active migrations are in `drizzle-pg/`. Old `drizzle/`, D1 examples, Cloudflare declarations and Sites metadata are legacy artifacts, not the Node runtime.
- Production output is `dist/standalone/server.js`. It reads Railway-provided `PORT`; default host is `0.0.0.0` unless `HOST` is set.
- Media uses `lib/storage.ts` and `UPLOADS_DIR`. For Railway, mount a persistent Volume at `/data` and set `UPLOADS_DIR=/data/uploads`.
- Chat uses four-second client polling. There is no SSE/WebSocket, manager presence or assignment.

## Vercel + Railway deployment

The minimal-risk production topology is:

```text
Browser → Vercel public HTTPS edge/rewrite
        → Railway full-stack Node application
        → Railway PostgreSQL + persistent media Volume
```

Vercel does not run a second Vinext frontend. `vercel.mjs` publishes `public/` and rewrites all routes to the configurable Railway `BACKEND_ORIGIN`; this keeps browser requests, HttpOnly cookies, pages and `/api/*` on one visible origin. Credentialed CORS is therefore neither enabled nor needed. `railway.json` defines Railpack build, `npm run db:migrate` pre-deploy, `npm run start`, `/health`, and restart-on-failure. The exact account setup, smoke checks, rollback and backups are in `README_DEPLOY.md`.

Required Vercel variable: `BACKEND_ORIGIN` only. Required Railway variables: `NODE_ENV`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `UPLOADS_DIR`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`; Telegram variables are optional. Never hardcode `vercel.app` or `railway.app` domains. Production metadata and sitemap require `NEXT_PUBLIC_SITE_URL`.

## Database and migrations

PostgreSQL tables cover settings, leads, services, tariffs, roles, users, projects and project children, conversations, messages, ratings, audit logs and notification events. Project children, messages, ratings and user roles have database foreign keys and relevant indexes. `npm run db:migrate` is repeatable; `npm run db:seed` is idempotent and contains only real default/system content. `npm run db:test` creates a uniquely named temporary settings row, verifies insert/read/update, closes and reopens the pool, verifies persistence, then deletes only its own row.

The local `.env.local` database pathname is not `/onikart`. Tests used the same local credentials with only the pathname corrected in process memory; no secret was printed or changed. Correct that pathname before ordinary local commands.

## Authentication and authorization

Admin login uses bcrypt plus a 12-hour HMAC cookie. Cookie flags are HttpOnly, SameSite=Strict, Path=/ and Secure when the canonical public URL is HTTPS or the proxy reports HTTPS. Owner credentials come from server environment. Database-backed staff and roles exist; APIs enforce permissions server-side. Owner protections exist in team operations. Login has an in-process per-IP limiter using trusted proxy address headers.

Remaining security work before a high-risk launch: CSRF tokens/origin enforcement for cookie-auth mutations, shared/distributed rate limiting if multiple replicas are introduced, session revocation/rotation, and a focused IDOR/security test matrix. Keep one Railway replica while filesystem Volume media is authoritative.

## Functional surfaces

- Public: `/`, `/works`, `/work/fasadof`, generic `/work/[slug]`, `/tariffs`, `/privacy`, `/health`, robots and sitemap.
- Leads: validated Russian E.164 phone, PostgreSQL insert before success, audit/notification dispatch afterward, client-visible network/server failures.
- Chat: anonymous HttpOnly visitor cookie; history, create/send, admin reply, close/reopen and rating; visitor conversation ownership is checked. Client polls every four seconds and reports send/close/rating failures.
- Admin: dashboard; leads; dialogs with reply/close; works; services; tariffs; ratings; analytics empty/real states; notifications; integrations; settings; team and roles.
- CMS: Works/services/tariffs CRUD and publication/visibility controls are database-backed. Homepage featured work, services, tariffs and Fasadof system accordion read PostgreSQL. Some contacts and narrative content remain in `data/site.ts`; full public/admin single-source parity is incomplete.
- Media: authenticated works editor upload for PNG/JPEG/WebP up to 10 MB with signature validation; file stored under `UPLOADS_DIR`; PostgreSQL media row and project cover updated transactionally after storage; `/media/[key]` serves immutable content. Actual Railway Volume survival is not yet live-verified.
- Telegram: server-only Bot API integration with graceful failure. Current configured token previously failed syntax validation; no successful live Telegram check is claimed for this pass.
- Weather: Open-Meteo, admin city persistence and graceful error UI exist.

## Production checks completed

- `npm test`: PASS, 11/11.
- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS with four existing `@next/next/no-img-element` warnings and no errors.
- `npm run build`: PASS; standalone output generated.
- PostgreSQL migrate, seed, CRUD, pool reconnect persistence and test cleanup: PASS against local `onikart` with an in-memory URL pathname correction.
- Standalone HTTP: `/`, `/works`, `/work/fasadof`, `/admin/login`, `/health`, `/robots.txt`, `/sitemap.xml` returned 200; health returned app/database OK.
- Invalid media key returned 404; unauthenticated media upload returned 403.
- Ordinary production browser left-click to Fasadof previously passed without a new console error.
- `vercel.mjs` evaluated successfully with a disposable HTTPS example origin; `railway.json` parses and has migration/health settings.

## Not verified / release blockers

- No live Vercel or Railway deployment was performed. External rewrite behavior, forwarded host/protocol, Secure cookie login and session persistence must be tested on the real domains.
- No plaintext owner password was available, so credentialed admin login and destructive admin journeys were not run.
- No actual Railway upload → restart/redeploy → media persistence test or backup restore was run.
- Telegram delivery is not verified with valid production credentials.
- Legal/privacy operator, retention and consent content still requires owner/legal approval.
- Full cross-browser, responsive and security matrices remain incomplete.
- Generic project detail and media workflows do not yet provide complete parity with every custom Fasadof case field; preview/reorder/SEO editing is partial.

Therefore: deployment configuration is prepared and locally verified, but **production launch is conditional** on live platform, credentialed workflow, Volume persistence, backup/restore and legal checks.

## Next-agent protocol

Read this file and `README_DEPLOY.md`, inspect `git status` and preserve all existing dirty-worktree changes. Never print `.env.local`. Prefer the smallest deploy-focused change. Before claiming production-ready, deploy Railway first, confirm migrations and `/health`, configure Vercel `BACKEND_ORIGIN`, then test through the Vercel/custom-domain URL: direct refresh, login/logout/session, lead visibility, chat reply/close/rating/reconnect, CMS publish, media restart persistence, Telegram, and restore rehearsal. Report unverified items explicitly.
