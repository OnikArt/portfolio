# OnikArt GitHub Pages: static public showcase

GitHub Pages is a **second, static deployment target**, not a replacement for the Vinext + Nitro full-stack application. `npm run build:pages` exports only the public showcase to `dist-pages/`. `npm run build:vercel` continues to build the complete site, admin, APIs, CMS, chat, PostgreSQL, Blob uploads and Telegram for Vercel.

## What is published

The Pages build exports `/`, `/works/`, `/tariffs/`, `/privacy/`, and one `/work/<slug>/` directory per published project in `data/public-snapshot.ts` (currently `fasadof`). Homepage sections for services, work, pricing, about and contact use the same components and stylesheet as full-stack OnikArt. Static files come from the Git-tracked `public/` directory. Pages never connects to PostgreSQL during the build or in the browser.

The snapshot contains **only reviewed public content** already present in `data/site.ts` and `scripts/db-seed.mjs`: service descriptions, tariff descriptions, Fasadof project text and public case blocks. CMS changes on Vercel do not automatically reach Pages. To update the static site, review published content, update `data/public-snapshot.ts`, and run the Pages build again. Do not copy users, roles, leads, conversations, ratings, analytics, audit logs, notification events, admin settings, credentials or tokens into the snapshot.

Pages has no `/admin`, `/api/*`, auth, server analytics, runtime media upload or custom backend chat. The chat launcher is absent. The contact form is replaced only in the Pages build by direct links to the existing public phone, Telegram and MAX contacts. Full-stack behavior is unchanged.

## Build locally

From the repository root, with Node 24 and installed dependencies:

```bash
npm ci
npm run build:pages
```

The command uses Vinext's `output: "export"` in the **isolated** `pages-site/` route tree and emits `dist-pages/`. Vinext's prerender phase opens a temporary `127.0.0.1` listener, so local firewall/sandbox rules must permit loopback. No database or secret ENV is required. The build verifies required HTML/assets, base-path references and absence of server-only markers. Do not upload `pages-site/dist/` or `.vercel/output/` to GitHub Pages.

By default the local base path is the repository directory name, for example `/OnikArt`. Override with `PAGES_BASE_PATH=/` for a root-hosted custom domain. Set non-secret `PAGES_SITE_URL=https://owner.github.io/OnikArt` when you want canonical URLs and a sitemap in a local build. The URL must be HTTPS and its path must match the base path. If omitted locally, canonical and sitemap are intentionally omitted rather than pointing to an invented or Vercel domain.

## GitHub Actions deployment

1. Commit and push the reviewed repository changes to the branch named `main`, or update the branch filter in `.github/workflows/deploy-pages.yml` to your actual publishing branch.
2. In the GitHub repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**. Do not select “Deploy from a branch”.
3. The workflow checks out the repository, installs with `npm ci` on Node 24, runs `npm run build:pages`, uploads `dist-pages/` using `actions/upload-pages-artifact`, and deploys with `actions/deploy-pages`. It needs no application secrets.
4. For a project repository, the standard URL is `https://<owner>.github.io/<repository>/`. The workflow derives the base path and site URL from GitHub repository metadata. Confirm the published route `/work/fasadof/` opens directly and after refresh; verify fonts, CSS, images, mobile navigation and contact links.

The repository's `main` branch is the workflow trigger; `workflow_dispatch` also allows a manual run after the workflow file is present in GitHub. This task does not push code or enable Pages settings.

## Custom domain later

Do not change DNS until the owner chooses the domain. In repository **Settings → Secrets and variables → Actions → Variables**, set `PAGES_BASE_PATH` to `/` and `PAGES_SITE_URL` to the final `https://custom-domain.example` origin, then configure the custom domain in GitHub Pages settings and update DNS following GitHub's instructions. Rebuild so asset URLs, canonical links, robots and sitemap use the root path. These are public build settings, not secrets.

## Return to full-stack Vercel

`npm run build:vercel` remains independent and emits `.vercel/output` with the server Function and all full-stack routes. Use [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for Preview validation and controlled database migration. Do not point the full-stack domain at Pages expecting admin, leads or chat to work.

## Limits

- Pages is a reviewed snapshot, not live CMS. New published slugs appear after they are added to the snapshot and rebuilt.
- Only Git-tracked media can be guaranteed in Pages; runtime Blob uploads are not exported. A public Blob URL may be referenced as an ordinary external image only after review.
- Static contact links do not create leads or notification events. Chat and authenticated features are unavailable.
- The existing `/privacy/` page contains a visible legal-content placeholder. The owner must approve complete legal text before treating either target as a production public launch.
