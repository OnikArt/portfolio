# OnikArt: Vercel + Neon + Vercel Blob

This is the current deployment path. There is no external application server. Vinext + Nitro builds Vercel Functions for pages and route handlers. Do not use the old standalone server or an external rewrite.

## 1. Prepare services

1. Create separate Neon PostgreSQL databases or branches for Preview and Production. In Neon Connection Details, enable **Pooled connection** and copy its connection string for the runtime `DATABASE_URL`. Do not commit it. Prefer a Vercel Function region near the Neon region. The application reuses one `pg.Pool` per warm instance with `max: 2`; the pooled Neon URL is still required because multiple instances may run concurrently. Back up Production and test restoration separately.
2. In the Vercel project Storage tab, create a **Public** Vercel Blob store. Connect it to Preview and Production as needed. Vercel supplies `BLOB_READ_WRITE_TOKEN`; keep it server-side. Public access is necessary for work images displayed without authentication. Git-tracked `public/images`, `public/fonts` and `public/icons` are not copied to Blob.
3. Have a Telegram bot and destination chat ready if notifications are wanted. Keep `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` server-side. The site remains functional if Telegram is temporarily unavailable; failed deliveries appear in `notification_events`.

## 2. Import GitHub repository into Vercel

1. Review and commit the intended working-tree changes, then push them to GitHub. Do not commit `.env*`, local generated output or secrets.
2. Create a Vercel project from that repository, root directory `/`. The committed `vercel.mjs` selects framework `nitro` and build command `npm run build:vercel`. Use `npm ci` for installation. Do **not** select a Next.js build, `npm run build`, `dist/standalone`, `public` as output, or an external-origin rewrite.
3. Choose a supported Node.js major in Vercel Build and Deployment settings. This repository requires Node `>=22.13`; the verified local Nitro Vercel preset emitted `nodejs24.x`. Node 24.x is the preferred match; verify the actual runtime shown in the build output. Do not silently choose Node 20.x.
4. Do not override Output Directory with `public` or `.output`. This installed Nitro preset writes the Vercel Build Output API directly to `.vercel/output`, including `config.json`, `static/` and `functions/__server.func/`.

### Environment variables

Set values separately for Preview and Production. Only names are documented here:

| Purpose | Variable |
| --- | --- |
| Core | `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL` |
| Admin | `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` |
| Storage | `BLOB_READ_WRITE_TOKEN` |
| Telegram (when enabled) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` |

`DATABASE_URL` must be the **pooled** Neon connection string in Vercel. `NEXT_PUBLIC_SITE_URL` is the public HTTPS origin for the environment; it is not a secret. `ADMIN_PASSWORD_HASH` is a bcrypt hash, never plaintext. `ADMIN_SESSION_SECRET` must be consistent across functions. Never put tokens into `NEXT_PUBLIC_*` variables. Do not set `BACKEND_ORIGIN`, `UPLOADS_DIR` or `ADMIN_BOOTSTRAP_PASSWORD` for this architecture.

## 3. Controlled database setup

Deploying Functions does **not** run migrations or seed. For a new database, perform migration **once**, in a trusted shell with explicit credentials for the intended Neon branch/database:

```bash
npm run db:migrate
```

This applies versioned SQL from `drizzle-pg/`; it changes schema, not sample content. A direct Neon connection is suitable for this controlled migration session if the provider requires it; keep the Vercel runtime `DATABASE_URL` pooled. Verify the target database before invoking the command. Do not run migration on every Function startup, in a route handler, or automatically on each deployment.

The optional `npm run db:seed` inserts the real default services, tariffs, Fasadof case blocks, settings and owner role. It is **not** a migration; invoke it only after reviewing its content and only for an intended new database. Do not run it repeatedly or blindly against an existing Production database. Existing Fasadof records with the legacy text ID remain supported by the media API; new project IDs are UUIDs.

## 4. Preview deployment and smoke tests

Deploy to **Preview**, not Production. Inspect the build: `.vercel/output/config.json` must route requests to `__server.func`, and `static/` must contain site assets. A successful build alone does not prove runtime behavior. After the controlled migration, test with disposable Preview data only:

- **Public:** `/`, navigation, works, services, tariffs, mobile menu, responsive layout and browser console. Confirm the Fasadof case and CMS changes appear without a redeploy.
- **Server:** `/health` returns 200 with database `ok`; verify SSR HTML, RSC navigation, a safe API GET and an authorized API POST. A database outage should return sanitized 503 from `/health`.
- **Admin:** owner login/logout, secure HttpOnly cookie, dashboard, staff permissions, CRUD, publishing/draft/featured/reorder and structured project blocks.
- **Leads:** submit one identifiable Preview test lead, check PostgreSQL persistence and admin visibility; check Telegram success or a recorded `FAILED` status without a failed user submission.
- **Chat:** visitor message, DB persistence, admin list/reply, visitor polling receives reply, close and rating. Confirm no process-local conversation state is needed.
- **Media:** authorized PNG/JPEG/WebP upload, Blob URL and CMS display; replace cover, delete project, and confirm old managed objects are deleted. Redeploy Preview and confirm remaining images persist. The server-side upload limit is **4 MB** because Vercel Functions limit the whole request body to about 4.5 MB. Larger files require a separately designed direct client upload flow.
- **Telegram:** test endpoint, successful delivery, and failure behavior; failure must not turn a persisted lead/chat action into an error. Do not expose the bot token in logs.
- **Security:** inspect client assets for leaked environment values; confirm admin APIs reject unauthenticated requests, media type/signature/size checks, safe project IDs and no open CORS policy.

### Existing `/media/<key>` records

New uploads store absolute public Blob URLs in PostgreSQL. Old filesystem media cannot appear on Vercel automatically. The old `/media/<uuid>.<ext>` route is retained as a redirect for objects manually imported into the same Blob store under `legacy/<uuid>.<ext>`. Before shutting down any old storage, inventory and copy its files with the original keys, then verify the redirect and CMS images. If old files are unavailable, those historical URLs will return 404; do not claim them migrated.

## 5. Production release

After Preview passes: create/verify the Production Neon database and Blob store, configure Production ENV, back up any existing data, perform the controlled Production migration once, and optionally seed only if appropriate for a new database. Deploy Production from the reviewed commit, then connect the domain and set `NEXT_PUBLIC_SITE_URL` to its final HTTPS origin. Recheck `/health`, admin login, public pages, one real upload, lead/chat persistence, and `notification_events`; monitor Vercel Function logs and Neon connection usage. Do not perform these steps automatically as part of build.

## Known limits

- Login and lead rate limits are per warm Function instance, not distributed. Add shared rate limiting later if abuse or traffic warrants it.
- Blob cleanup is attempted after DB success. Any failed deletion is recorded as a `STORAGE` / `MEDIA_DELETE_FAILED` notification for manual follow-up; there is no background retry worker yet.
- The old standalone Node and VPS files are historical; they are not a fallback production deployment architecture.
- Vinext `1.0.0-beta.5` and Nitro `3.0.260903-beta` require live Preview checks of cookies, SSR/RSC, form uploads and API routing before Production approval.
