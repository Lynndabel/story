# Celo AI Finance Dashboard

NoahAI-powered personal finance assistant for the Celo ecosystem. The dashboard verifies a wallet with Self Protocol, fetches live balances/transactions from Celoscan + viem, and turns that signal into actionable AI guidance.

## Features

1. **Identity & Reputation** – Verify wallets against Self Protocol (SDK or REST fallback) and surface reputation scores.
2. **Live Balances & History** – Pull CELO and cUSD balances plus the latest on-chain transactions via Celoscan and viem.
3. **AI Insights** – Forward wallet activity to NoahAI for spending analysis, forecasting, categorization, and advice.
4. **Mockable Dev Experience** – Toggle high-fidelity demo data when API keys are unavailable so contributors always see a populated dashboard.

## Architecture Snapshot

```
Wallet (wagmi) ─┬─▶ Self Protocol SDK / REST → Identity card
                ├─▶ Celoscan API              → Transaction history
                ├─▶ viem RPC                  → Balance cards
                └─▶ NoahAI REST               → AI insights & advice

Optional: Mock data layer intercepts all calls when `NEXT_PUBLIC_USE_MOCKS=true`
```

## Prerequisites

- Node.js 18+
- npm 9+ (or yarn/pnpm/bun if you prefer)
- Celo wallet address for testing
- API keys listed below (or enable mock mode)

## Environment Variables

Create `.env.local` and populate the following keys:

| Name | Description |
| --- | --- |
| `NEXT_PUBLIC_CELOSCAN_API_KEY` | Required to fetch historical transactions from Celoscan. |
| `NEXT_PUBLIC_NOAHAI_API_KEY` | Required to talk to NoahAI for spending analysis. |
| `NEXT_PUBLIC_SELF_API_KEY` | Self Protocol SDK key. If omitted, REST fallback is attempted. |
| `NEXT_PUBLIC_SELF_VERIFY_URL` | REST verification endpoint (used when SDK or key unavailable). |
| `NEXT_PUBLIC_USE_MOCKS` | Set to `true` to use bundled demo data instead of live APIs. |

> Tip: keep mock mode enabled when onboarding new contributors so they can see a fully populated dashboard without provisioning credentials.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the dashboard. When mock mode is on you’ll see a banner explaining that the content is simulated.

## Testing

Unit tests use [Vitest](https://vitest.dev) for the shared lib utilities:

```bash
npm test
```

Add new tests under `src/lib/__tests__/` and keep them deterministic by mocking network layers.

## Deployment & CI

1. **Vercel / Next.js App Router** – This project is optimized for Vercel. Make sure to add all environment variables (and disable `NEXT_PUBLIC_USE_MOCKS`).
2. **CI pipeline** – Run `npm run lint` and `npm test` on every pull request. A simple GitHub Actions workflow might look like:
   - Checkout → `npm ci`
   - `npm run lint`
   - `npm test`
   - Optional: `npm run build`
3. **Secrets management** – Store API keys in Vercel, GitHub Encrypted Secrets, or HashiCorp Vault. Never commit them to git.

## Contributing

1. Enable mock mode unless you have real API keys.
2. Implement features with accessibility and responsive layout in mind (Tailwind utility classes are already configured).
3. Keep modules pure and add regression tests for any new data transformation logic.

Happy building!
