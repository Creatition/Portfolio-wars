# Portfolio Wars

A PulseChain portfolio competition platform.

> Real wallets. Real PLS. Real bragging rights.
> A weekly, monthly, and yearly tournament where the medal is the prize.

See `../Portfolio_Wars_Architecture_Plan.docx` in the parent folder for the full
architecture and `../Portfolio_Wars_Design_Preview.html` for the visual reference.

---

## Monorepo layout

```
mvp/
├── apps/
│   ├── api/          @pw/api — Fastify + tRPC server  →  Railway
│   └── web/          @pw/web — Next.js 14 frontend     →  Cloudflare Pages
├── packages/
│   └── shared/       @pw/shared — types, tRPC router, mock data
├── contracts/        Hardhat sub-project — FundingContract.sol
├── DEPLOYMENT.md     Step-by-step Railway + Cloudflare deploy guide
└── README.md         (this file)
```

This is an **npm workspaces** monorepo. One `npm install` at the root wires
everything up.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Run the API (terminal 1)
npm run dev:api
# → http://localhost:3001/health

# 3. Run the web app (terminal 2)
npm run dev:web
# → http://localhost:3000
```

The web app's tRPC client defaults to `http://localhost:3001` for the API, so
no env file is needed for local dev.

---

## Production deploy

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full walkthrough.

In short:

| Service       | Host              | Build root      | Entry                              |
|---------------|-------------------|------------------|------------------------------------|
| `@pw/api`     | Railway           | `apps/api`       | Fastify on `$PORT`, routes at `/trpc`, health at `/health` |
| `@pw/web`     | Cloudflare Pages  | `/` (monorepo)   | Next.js via `@cloudflare/next-on-pages`           |

CORS is locked down via the `ALLOWED_ORIGINS` env var on the API service —
list every domain the web app can call from.

---

## What's wired

The MVP scaffold is fully runnable with mock data:

- Home page with live leaderboards, tier/period toggles, champion card, medal hierarchy
- Alias profile (`/alias/:name`) — trophy case, active competitions, wallet visibility toggle
- Compete page — league picker (wallet-connect button disabled, awaiting Funding Contract)
- History — past champions
- About — rules and posture
- tRPC API at `/trpc` with: `siteStats`, `listCompetitions`, `getCompetition`, `getLeaderboard`, `listAliases`, `getAlias`, `plsUsd`, `health`

---

## What's not wired (deliberately)

These are next, in order:

1. **Live wallet connect** — Wagmi + WalletConnect on `/compete`
2. **Live chain reads** — Viem reading real PulseChain balances into the API
3. **Persistence** — swap `mock.ts` for Postgres + the indexer pipeline
4. **Funding Contract** — finish EIP-712 voucher verification + book two audits
5. **WebSocket leaderboards** — replace the 8s polling with diff-based push
6. **X handle verify-via-tweet** flow

Each of these maps to a section of the architecture plan.

---

## Useful workspace commands

```bash
npm run dev:web        # Next.js on :3000
npm run dev:api        # Fastify API on :3001
npm run build:web      # Next.js production build
npm run build:api      # TypeScript compile to dist/
npm run typecheck      # tsc --noEmit across all workspaces

# Inside apps/web — extra Cloudflare commands
cd apps/web
npm run build:cf       # @cloudflare/next-on-pages — produces .vercel/output/static
npm run preview:cf     # wrangler pages dev — locally simulate Cloudflare Pages

# Smart contracts (Hardhat)
cd contracts
npm install
npm run compile
npm run test
```

---

## Design system

Tailwind tokens live in `apps/web/tailwind.config.ts`. The crypto-luxe palette
(gold/black/silver/bronze, mint gain, coral loss) is exposed as utility classes
like `bg-gold`, `text-fg-muted`, `border-rule`, `shadow-medal`.

Fonts via Google Fonts (Cormorant Garamond, Inter, JetBrains Mono). For
production, consider migrating to `next/font` to eliminate the FOUC.

---

## License

Private. All rights reserved.
