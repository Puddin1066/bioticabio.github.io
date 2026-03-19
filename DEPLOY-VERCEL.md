# Deploy to Vercel and use bioticabio.com

This project is set up to deploy the **Jekyll site** to Vercel. The API under `apps/api` (Express + SQLite + worker) is not deployed here; use a long-running host (e.g. Railway, Render) for that.

## 1. Install and deploy

```bash
npm install
npm run deploy
```

First run will prompt you to log in to Vercel (`vercel login`) and link the project. For production:

```bash
npm run deploy:prod
```

## 2. Add bioticabio.com

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Domains**.
2. Add **bioticabio.com** (and optionally **www.bioticabio.com**).
3. At your DNS provider, add the records Vercel shows (usually **A** or **CNAME**).
4. Wait for DNS to propagate; Vercel will issue SSL automatically.

`_config.yml` already has `url: https://bioticabio.com`.

## 3. CI/CD: connect GitHub for auto-deploys

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**.
2. **Import** your GitHub repo (e.g. `bioticabio/bioticabio.github.io`). Authorize Vercel for GitHub if prompted.
3. Leave build settings as-is (Vercel uses `vercel.json`: Jekyll build, output `_site`). Click **Deploy**.
4. After the first deploy: **Project** → **Settings** → **Domains** → add **bioticabio.com** and configure DNS.

Every push to `main` (and PRs as previews) will trigger a new deployment.
