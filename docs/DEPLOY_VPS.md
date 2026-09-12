# ONIKART — Ubuntu VPS

Use Node.js 22 LTS, Nginx, systemd and HTTPS. Keep `/etc/onikart/onikart.env`, the database and uploads outside the Git checkout.

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
cd /opt/onikart/current
npm ci
npm run db:generate
npm run build
sudo cp deploy/onikart.service /etc/systemd/system/onikart.service
sudo systemctl daemon-reload && sudo systemctl enable --now onikart
sudo cp deploy/nginx.conf /etc/nginx/sites-available/onikart
sudo ln -s /etc/nginx/sites-available/onikart /etc/nginx/sites-enabled/onikart
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Required runtime variables are listed without values in `.env.example`. Generate `ADMIN_SESSION_SECRET` with `openssl rand -base64 48`. Generate a bcrypt/Argon2id password hash with an audited password utility; never put the plaintext password in Git. Telegram requires a newly issued bot token and the destination chat ID.

The current Sites build uses D1/R2. Before a conventional VPS launch, select one authoritative VPS persistence adapter (PostgreSQL recommended, or SQLite in `/var/lib/onikart`) and run the checked migration set. Do not run production on an ephemeral database. Back up the database daily, retain encrypted off-host copies, and back up `/var/lib/onikart/uploads` with matching retention. Test restores before launch.

Smoke checks: `/`, `/health`, `/work/fasadof`, `/admin/login`, lead submission, chat create/reload/reply/close/rating and Telegram test. Logs: `journalctl -u onikart -f`.
