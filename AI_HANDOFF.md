# OnikArt — AI Handoff

## 1. Project Goal

OnikArt is Onik Artushyan's Russian-language portfolio and lead-generation site for digital business systems. The public site presents services, process, tariffs, the Fasadof case, contacts, lead form, and visitor chat. The private admin is intended to manage all public content, leads, dialogs, ratings, notifications, integrations, settings, staff, roles, and permissions.

## 2. Current Stack

- Vinext 1.0.0-beta.5 / Next compatibility package 16.3.4
- React and React DOM 19.2.6; one deduplicated runtime
- Vite 8.0.13, `@vitejs/plugin-rsc` 0.5.26, Cloudflare Vite plugin 1.37.1
- TypeScript 5.9.3, plain CSS, Drizzle ORM 0.45.2
- Cloudflare D1 (`DB`) and R2 (`BUCKET`) on Sites; Wrangler local persistence
- Custom HMAC cookie and bcrypt owner credentials from server environment
- Telegram Bot HTTP API; Open-Meteo HTTP API
- Local fonts: Geologica variable and Mazzard H ExtraBold

## 3. How to Run

Node 22.13+ is required.

```text
npm ci
npm run dev
npx tsc --noEmit
npm run lint
npm test
npm run build
npm run start -- --port 8788
```

## 4. Environment

- `NODE_ENV` — optional; server/build mode.
- `NEXT_PUBLIC_SITE_URL` — required in production; canonical public URL, client-safe.
- `DATABASE_URL` — optional VPS/local SQLite target; server only (not used by D1 path yet).
- `ADMIN_EMAIL` — required; owner login identifier, server only.
- `ADMIN_PASSWORD_HASH` — required; bcrypt hash, server secret.
- `ADMIN_SESSION_SECRET` — required; cookie HMAC key, server secret.
- `TELEGRAM_BOT_TOKEN` — required for Telegram, server secret.
- `TELEGRAM_ADMIN_CHAT_ID` — required for Telegram, server secret.

Never commit `.env.local` or copy values into this file/client bundles.

## 5. Architecture

```text
app/                 public/admin pages and route handlers
components/layout/   header/footer
components/sections/ public homepage sections
components/chat/     visitor chat client
components/admin/    admin shell, login, current read-only workspace
data/site.ts         current hardcoded public source of truth (temporary)
db/schema.ts         Drizzle/D1 schema
lib/platform.ts      D1 access, audit/notifications, Telegram dispatch
lib/admin-auth.ts    owner cookie and environment config
drizzle/             generated migration
deploy/              nginx and systemd examples
docs/                VPS notes
```

## 6. Database

Migration `drizzle/0000_absent_moonstone.sql` creates: `settings`, `leads`, `tariffs`, `projects`, `project_links`, `project_blocks`, `project_media`, `conversations`, `messages`, `ratings`, `audit_logs`, `notification_events`. Project child rows reference `project_id` logically, but the initial migration has no foreign-key constraints. Cloud deployment uses D1; local production uses `.wrangler/state`. No production-grade seed currently exists. Public content is not yet DB-driven.

## 7. Authentication

The owner is configured from environment. Login verifies bcrypt and issues a 12-hour HttpOnly, SameSite=Strict HMAC cookie. Admin pages redirect to `/admin/login`; current admin APIs return 401 without the owner cookie. Current model is single owner only: no user table, profile editing, custom roles, permission checks, CSRF token, revocation list, or owner-lockout rules. RBAC is a P0 requirement and is not implemented.

## 8. Public Site

Routes: `/`, `/works`, `/work/fasadof`, `/tariffs`, `/privacy`, `/health`. Homepage sections: hero, positioning, services, selected work, system, process, principles, technologies, about, benefits, tariffs, contact. Palette is black/white with acid lime; display uses Mazzard and body uses Geologica. Main body copy should stay at least 16px. The mobile menu is opaque `#0a0a0a`, fixed at `100dvh`, has a visible X, body lock, Escape handling, and hides chat via `body.menu-is-open`.

## 9. Admin

Routes currently exposed in the shell: Dashboard, Leads, Dialogs, Works, Tariffs, Ratings, Analytics, Content, Notifications, Integrations, Settings. The generic workspace can search loaded rows but buttons are placeholders. Services, Team, Roles, and Profile are absent. Works/services/tariffs CRUD, settings editing, profile editing, and RBAC must be built before production.

## 10. Chat

Visitor ID and conversation ID are stored in localStorage. `/api/chat` supports reading history, creating/sending, closing, and rating; messages persist in D1. `/api/admin/dialogs` supports list/reply/close/reopen, but the admin UI does not expose the operations. There is no SSE/WebSocket/polling for live replies.

## 11. Telegram

`recordEvent` writes audit and notification rows, then dispatches Telegram asynchronously. Telegram failure must never roll back primary CRUD. Direct `getMe` and `sendMessage` were previously verified successfully with the configured server secret. Event-trigger E2E coverage is incomplete. Never print the token.

## 12. Weather

`/api/weather` calls Open-Meteo; Voronezh is the intended default. The dashboard currently shows static explanatory text. City selection, persistence, forecast UI, and graceful client error UX are not implemented.

## 13. Works

The schema supports project metadata, links, blocks, media, status, featured order, publishing, and SEO. The public Fasadof page is currently hardcoded. Admin CRUD/editor/preview/reorder/media workflows are not implemented.

## 14. Fasadof

Fasadof is a real case with status `IN_PROGRESS` / «В работе». Do not invent revenue, conversion, traffic, or completion metrics. The current page communicates context, task, solution, system directions, and known links.

## 15. Services & Tariffs

Both public services and tariffs currently come from `data/site.ts`. Tariffs have a DB table, but no safe seed or working CRUD. Services have no DB table yet. Do not claim a single DB source of truth until both public rendering and admin editing use the same records.

## 16. Contacts

Public contacts/social links live in `data/site.ts` and are rendered in Contact and Footer. Move them to DB-backed settings when the admin settings workflow is implemented. Credentials and bot secrets never belong in contact settings.

## 17. Known Bugs

- P0: no RBAC/team/profile system.
- P0: public content and admin are not a single DB source; CRUD is incomplete.
- P0: legal privacy content is explicitly incomplete.
- P1: admin reply/close UI and visitor live updates are incomplete.
- P1: weather city UI/persistence is incomplete.
- P1: Telegram event-trigger journeys are not fully verified.
- P1: broad button/cross-browser/responsive matrices remain incomplete.
- P2: R2 media upload UI is absent.

## 18. Fixed Critical Bugs

Production left-click navigation was reproduced while dev worked. There was one React runtime, so duplicate React was ruled out. In Vinext beta.5's production `next/link` chunk, lazy imports from the shared navigation module resolve to non-functions: `getPrefetchInterceptionContext` fails during RSC prefetch and `navigateClientSide` fails inside `React.startTransition`. Middle-click worked because it bypassed Link's click interception and used the anchor href. The production-safe mitigation is semantic native anchors for all project navigation (an allowed upstream-bug fallback), plus unminified production output for readable stacks and protection from Rolldown symbol mangling. No generated or `node_modules` file is patched. A production left-click from home to Fasadof then navigated successfully with no new console error.

The mobile hamburger previously transformed into an X below a higher-z-index fullscreen overlay, making the close control invisible. The menu now contains its own explicit, dependency-free CSS X button above the overlay content, with a 44×44 target, safe-area-aware placement, high-contrast focus state, body scroll lock, Escape/popstate handling, link auto-close, chat suppression, and focus restoration.

## 19. Testing

Verified before this handoff: dependency tree contains one React/React DOM; dev framework Link reproduced no error; old production bundle reproduced exact RSC prefetch and navigation failures; fixed production build navigated by ordinary left-click to `/work/fasadof` with no new console error. Earlier checks passed 6 tests, typecheck, build, owner login, logged-out redirect, local chat persistence, Telegram direct API, and hero geometry at 1366×768, 390×844, 360×640.

Mobile menu close QA on the local production build passed at 320×568, 360×640, 375×667, 390×844, 414×896, and 430×932. At every size the explicit X was visible and tappable; the 44×44 CSS touch target stayed inside the viewport; screenshots at 320 and 430 confirmed the opaque black overlay and top-right placement. Tap close, Escape close, navigation auto-close, focus return to the menu trigger, body lock/unlock, chat suppression, and horizontal containment passed. This remains narrower than the full requested browser/E2E matrix.

## 20. Production

Sites uses `.openai/hosting.json` with D1 `DB` and R2 `BUCKET`. VPS examples are `deploy/nginx.conf`, `deploy/onikart.service`, and `docs/DEPLOY_VPS.md`; they are templates, not a verified deployed VPS. Back up the database and media separately, run migrations before traffic, and keep secrets outside Git. Current source must not be called VPS-ready while P0 items remain.

## 21. Security

Keep password hashes and tokens server-only. Protect every admin API server-side, not just navigation. Add RBAC authorization, CSRF protection for cookie-auth mutations, validation, per-IP/session rate limits, upload type/size checks, XSS-safe rich text, session revocation/rotation, audit ownership, and IDOR tests. Owner must never be deleted, demoted, or disabled.

## 22. DO NOT BREAK

- Telegram failure never rolls back the primary operation.
- Public/admin content must converge on one DB source of truth.
- Never add fake metrics or claim Fasadof is complete.
- Owner cannot be deleted, demoted, or disabled.
- Permissions must be enforced server-side.
- No secret may reach client code, logs, reports, or Git.
- Do not reintroduce `next/link` until its exact production failure is fixed upstream and retested.
- Do not patch generated bundles or `node_modules`.

## 23. Remaining Work

- P0: database-backed users/roles/permissions, profile, team UI/APIs, lockout protection.
- P0: services schema and working Works/Services/Tariffs/Settings CRUD; seed/migrate existing content; public DB rendering.
- P0: obtain approved legal operator/retention/consent text and replace placeholder.
- P1: complete admin dialog UI, visitor reply delivery, Telegram event tests, weather UI/persistence.
- P1: complete inventory-based interaction, responsive, security, and cross-browser QA.
- P2: R2 upload/media management and remaining visual polish.

## 24. Last Known Good State

Date: 2026-09-12 (Europe/Moscow). Recovery implementation commit: `babc9408786d16d94380fa3805db5cad1bfce50c` (the following documentation-only commit records this hash). Production build and the navigation smoke passed after the fix; full QA has not passed.

## 25. Instructions for Next AI

Before changing code: read this file; run `git status`; inspect current diffs; reproduce the target bug; make a scoped plan; preserve user changes and secrets; implement; run proportionate tests; update both handoff files with evidence; report every unresolved P0 honestly. Start with RBAC/data source, not decoration.

## 26. Final pass — 2026-09-19

- Hero keeps `100dvh` and now has explicit desktop compact modes through 680px height.
- The shared process flow is a deliberate 3-column tablet grid and vertical mobile sequence.
- Service cards have CSS window controls; the green control links to `#work-formats`. Desktop and mobile menus include «Форматы работы»; legacy `#tariffs` remains as an alias.
- Benefits use 4 columns desktop, 2×2 tablet and one column mobile; lime display text on the light block was changed to the existing black token.
- Fasadof system items now live in `project_blocks` as `SYSTEM_ITEM`, seeded by `drizzle/0004_fasadof_system_items.sql`. The same accessible accordion renders on home and `/work/fasadof`; the Works editor exposes `TITLE|SHORT|DETAIL` rows and saves them back to the same source.
- Telegram notifications are formatted as short Russian human-readable messages with Moscow time and useful admin links. Duplicate `CONVERSATION_CREATED` notification on the first visitor message was removed.
- Existing phone/Telegram/MAX/VK/Instagram assets are rendered by `ContactLink` with accessible labels.
- Verified: `npm ci` PASS, typecheck PASS, 9/9 tests PASS, lint PASS with 3 image optimization warnings, production build PASS, production `/`, `/health` (including DB) and `/admin/login` return 200. Accordion expand and green-control anchor passed in the production browser.
- Not verified / blockers: configured Telegram token does not match Bot API token syntax, so real `getMe` and `sendMessage` FAIL. Correct owner password is not available as plaintext, so correct-login and restart-session E2E were not run. Conventional VPS persistence is still not implemented: runtime remains D1/R2 and `DATABASE_URL` is documentation only. Contacts and several homepage/case texts still originate in `data/site.ts`, so full public/admin single-source CMS is incomplete. Full requested responsive screenshot matrix and every admin CRUD journey were not completed.
- Therefore `VPS READY: NO`.
