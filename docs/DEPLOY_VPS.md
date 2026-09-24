# Historical VPS deployment guide — not the current production architecture

OnikArt now targets Vercel Functions + Neon PostgreSQL + Vercel Blob. Use [VERCEL_DEPLOY.md](../VERCEL_DEPLOY.md) for new Preview and Production deployments. The instructions below are retained only as historical reference and must not be combined with the Vercel configuration.

# ONIKART — Ubuntu VPS deployment

The production target is Node.js 22+, PostgreSQL, systemd, Nginx and HTTPS. Keep the environment file, PostgreSQL data and uploaded media outside the Git checkout.

## 1. Host and database

```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx
sudo -u postgres createuser --pwprompt onikart
sudo -u postgres createdb --owner onikart onikart
sudo install -d -o onikart -g onikart -m 0750 /var/lib/onikart/uploads
sudo install -d -o root -g onikart -m 0750 /etc/onikart
```

Install Node.js 22 or newer from the distribution/channel approved for the server. Put the release in `/opt/onikart/current` and run `npm ci` followed by `npm run build`.

Create `/etc/onikart/onikart.env` with mode `0640`, owned by `root:onikart`. Use the names in `.env.example`. `DATABASE_URL` must be a PostgreSQL URL whose database path is `/onikart`; set `UPLOADS_DIR=/var/lib/onikart/uploads`. Generate `ADMIN_SESSION_SECRET` with `openssl rand -base64 48`. Keep database passwords, admin hashes and Telegram tokens out of Git and logs.

## 2. Migrate and seed

Run migrations before switching traffic. The seed is idempotent and contains only real default/system content—no synthetic leads, reviews or metrics.

```bash
cd /opt/onikart/current
set -a
. /etc/onikart/onikart.env
set +a
npm run db:migrate
npm run db:seed
npm run db:test
```

`db:test` creates a uniquely named temporary settings row, verifies insert/read/update, reconnects to PostgreSQL to verify restart persistence, then deletes only that test row.

## 3. Service, proxy and TLS

```bash
sudo cp deploy/onikart.service /etc/systemd/system/onikart.service
sudo systemctl daemon-reload
sudo systemctl enable --now onikart
sudo cp deploy/nginx.conf /etc/nginx/sites-available/onikart
sudo ln -s /etc/nginx/sites-available/onikart /etc/nginx/sites-enabled/onikart
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Replace the example domains first. The app listens only on `127.0.0.1:3000`; Nginx is the public entry point. Inspect logs with `journalctl -u onikart -f`.

## 4. Verification

Verify `/`, `/health`, `/work/fasadof`, `/admin/login`, owner login, a permitted admin CRUD journey, lead submission, chat create/reload/reply/close/rating, and Telegram test. `/health` must return HTTP 200 with both `app` and `database` equal to `ok`; it returns 503 if PostgreSQL is unavailable.

## 5. Backups and rollback

- Nightly: create a custom-format `pg_dump`, then copy encrypted backups off-host.
- Back up `/var/lib/onikart/uploads` with matching retention so database media records and files can be restored together.
- Regularly restore both into a disposable host and run the smoke checks.
- Keep the previous application release. For rollback, stop traffic, restore a compatible database backup when needed, point `/opt/onikart/current` to the previous release, and restart the service.
- Do not roll back only application files after a destructive schema migration.

Cloudflare D1/R2 metadata and the old SQLite migrations are legacy compatibility artifacts, not the production persistence path. Runtime data access uses only `DATABASE_URL`; media uses the filesystem adapter rooted at `UPLOADS_DIR`.
