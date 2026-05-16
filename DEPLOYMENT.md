# Deployment Guide

Portfolio Wars deploys as two services:

- **API** (`apps/api`) → **Railway**
- **Web** (`apps/web`) → **Cloudflare Pages**

They communicate over HTTPS. CORS on the API restricts which origins can call it.

---

## Step 1 — Push to GitHub

The monorepo lives in `mvp/`. There's a one-shot script that does `git init`,
sets identity for this repo only, and makes the first commit.

**Windows (cmd):**

```
cd /d "C:\Users\thela\Desktop\Portfolio Wars\mvp"
scripts\init-git.cmd
```

**macOS / Linux / WSL (bash):**

```
cd mvp
bash scripts/init-git.sh
```

Then create a new private repo on GitHub. Either via the web UI, or with the
GitHub CLI:

```
gh repo create portfolio-wars --private --source=. --remote=origin --push
```

If you used the web UI instead, add the remote yourself:

```
git remote add origin git@github.com:<your-handle>/portfolio-wars.git
git push -u origin main
```

---

## Step 2 — Deploy the API to Railway

### 2.1  Create the project

1. Go to https://railway.app and sign in (GitHub recommended).
2. **New Project** → **Deploy from GitHub repo** → select `portfolio-wars`.
3. After the repo is connected, Railway will offer to create a service. Accept.

### 2.2  Point Railway at the API app

Because this is a monorepo, Railway needs to know which app to build:

1. Open the service → **Settings**.
2. Under **Build**, set:
   - **Root Directory:** `apps/api`
   - **Build Command:** *(leave blank — `nixpacks.toml` handles it)*
3. Under **Deploy**, set:
   - **Start Command:** *(leave blank — `nixpacks.toml` handles it)*
   - **Health Check Path:** `/health`

Railway will read `apps/api/nixpacks.toml`, install dependencies from the
monorepo root (so `@pw/shared` resolves), build `@pw/api`, and start the server.

### 2.3  Environment variables

In **Variables**, add:

| Name              | Value                                                              |
|-------------------|--------------------------------------------------------------------|
| `NODE_ENV`        | `production`                                                       |
| `ALLOWED_ORIGINS` | `https://<your-pages>.pages.dev` (add your custom domain later)    |

`PORT` is set automatically by Railway — don't override it.

### 2.4  Get the public URL

After the first successful deploy, open the service → **Settings** → **Networking**
→ **Generate Domain**. You'll get something like
`portfolio-wars-api-production.up.railway.app`.

Test it:

```bash
curl https://portfolio-wars-api-production.up.railway.app/health
# {"ok":true}
```

Save this URL — the web app needs it.

---

## Step 3 — Deploy the Web app to Cloudflare Pages

### 3.1  Create the project

1. Go to https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize Cloudflare to read your GitHub account and pick the `portfolio-wars` repo.

### 3.2  Build settings

Set these on the **Build configuration** step:

| Setting                | Value                                              |
|------------------------|----------------------------------------------------|
| Framework preset       | **Next.js**                                        |
| Build command          | `cd apps/web && npm run build:cf`                  |
| Build output directory | `apps/web/.vercel/output/static`                   |
| Root directory         | `/` *(leave the default)*                          |

### 3.3  Environment variables (Production)

Under **Settings** → **Environment variables** → **Production**, add:

| Name                   | Value                                                              |
|------------------------|--------------------------------------------------------------------|
| `NEXT_PUBLIC_API_URL`  | `https://portfolio-wars-api-production.up.railway.app`             |
| `NODE_VERSION`         | `20`                                                               |
| `NPM_FLAGS`            | `--include-workspace-root --workspaces`                            |

Re-deploy after adding env vars.

### 3.4  Update CORS on Railway

Now that you know the Cloudflare URL (`https://portfolio-wars.pages.dev` or
similar), go back to Railway and update `ALLOWED_ORIGINS` to include it.
Railway will redeploy automatically.

---

## Step 4 — Verify

1. Open `https://<your-site>.pages.dev`.
2. The hero should fill in (server component fetched from Railway).
3. The leaderboard should populate (client-side tRPC call).
4. Click any alias → the profile page loads with their medals and standings.

If the hero shows zeros, the server component couldn't reach the API. Check:
- `NEXT_PUBLIC_API_URL` is set in Cloudflare Pages env vars.
- Railway service is up (`curl /health`).
- `ALLOWED_ORIGINS` on Railway includes your Cloudflare Pages URL exactly.

---

## Custom domain (optional)

### On Cloudflare Pages

**Settings** → **Custom domains** → **Set up a custom domain**. If the domain
is already on Cloudflare, this is a one-click flow.

### On the API

You can give the Railway API a subdomain like `api.portfoliowars.com`:

1. Railway service → **Settings** → **Networking** → **Custom Domain** → add `api.portfoliowars.com`.
2. Railway shows a CNAME target. Add the CNAME in your DNS provider.
3. Update `NEXT_PUBLIC_API_URL` on Cloudflare Pages to the new URL.
4. Update `ALLOWED_ORIGINS` on Railway to your custom web domain.

---

## Local development

```bash
# from mvp/
npm install                        # installs all workspaces

# terminal 1
npm run dev:api                    # API on :3001

# terminal 2
npm run dev:web                    # Web on :3000
```

The web app's `Provider.tsx` defaults `NEXT_PUBLIC_API_URL` to
`http://localhost:3001`, so no env file is needed for local dev.

---

## Things to do before going live

These are out of scope for the MVP but on the path to production:

- Replace the mock data layer in `packages/shared/src/mock.ts` with real DB queries (Neon Postgres recommended — see architecture plan §6).
- Audit the Funding Contract (see `contracts/README.md`).
- Add Sentry to both apps for error tracking.
- Add rate limiting on the API (per-IP and per-alias).
- Add observability — Railway integrates with Better Stack out of the box.
- Geofence sanctioned jurisdictions on the API.
- Add structured logging and a request ID propagated through tRPC.
