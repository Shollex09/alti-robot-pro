# AGENTS.md — Base44 dev environment

## What this is
A static PWA (no build step, no backend). Two standalone single-page apps served as flat files:
- `ALTI_Robot_PRO.html` — Ichimoku trading robot (Forex & Crypto). Root `/` serves this.
- `poulailler/index.html` — chicken-coop management app. Reachable at `/poulailler/`.

Plus `manifest.json`, `sw.js` (service worker), and `icon*.png/svg` at the root.

## How it runs here
Served by `nginx:alpine` via `docker-compose.base44.yml`, repo root bind-mounted read-only
at `/usr/share/nginx/html`, exposed on host port 3000. Config in `nginx.base44.conf`.
No live-reload dev server (static files); edit a file and refresh, or call `reload_preview`.

## Setup quirks
- The repo root directory is mode 700 (owner root). nginx's non-root worker can't traverse it,
  causing 403/500. Fix: `chmod 755 .` (and `chmod -R a+r .` so files are world-readable). The
  `.git` dir stays 700 — nginx doesn't serve it, so that's fine.
- `nginx.base44.conf` sets `index index.html ALTI_Robot_PRO.html;` so `/` loads the trading app
  and `/poulailler/` resolves to its `index.html`.

## External data sources (entered in-app, NOT required at boot)
The trading app fetches from public APIs at runtime. API keys are typed into the app's UI
(`apikey-input`), not env vars, so no secrets are needed to boot or render:
- Binance public klines, Frankfurter FX rates — no key needed.
- TwelveData, Finnhub — free API key entered in-app.
- Telegram bot — token + chat ID entered in-app.
- It also references `http://localhost:8765/api/*` (a backend that does not exist in this repo);
  those calls fail silently and don't block rendering.

## Verify
`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → 200, title "ALTI Robot PRO".
`/poulailler/index.html` → 200, title "Gestion du Poulailler".

## No secrets
`.base44/environment.json` lists no secrets — nothing is required at boot.
