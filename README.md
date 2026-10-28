# Rezi UI

A shadcn-compatible component registry and its docs site, built with Next.js 16, Tailwind CSS v4 and Radix.

Live at https://reziui.rezianislami.workers.dev. Consumers install components with the shadcn CLI:

```bash
npx shadcn@latest registry add @reziui=https://reziui.rezianislami.workers.dev/r/{name}.json
npx shadcn@latest add @reziui/theme
npx shadcn@latest add @reziui/button
```

## Development

```bash
npm install
npm run dev            # http://localhost:3000
npm test               # Vitest + Testing Library
npm run lint
npm run registry:build # registry/ → public/r/*.json
```

Components live in `registry/reziui/`, are listed in `registry.json`, and are documented in `content/docs/`. After adding or changing a component, run `npm run registry:build` and commit the regenerated `public/r/*.json` — the deployed site serves those files as-is, and a test fails when one is missing.

## Deployment

The site is a static export (`output: "export"` → `out/`) served by Cloudflare Workers Static Assets; see `wrangler.toml`. There is no server: the docs search index is emitted at build by `app/api/search` and searched in the browser.

```bash
npm run build && npx wrangler@4.147.0 versions upload   # preview URL, production untouched
npm run build && npx wrangler@4.147.0 deploy            # production
npx wrangler@4.147.0 rollback                           # previous version
```

With Workers Builds connected to the GitHub repo, use build command `npm run build` and deploy command `npx wrangler deploy`.

Gotchas:

- Everything is computed at build, including the "New" labels on docs pages, so they only change on the next deploy.
- The registry URL is stored in every consumer's `components.json`. Changing the domain breaks existing installs unless the old host redirects `/r/*` to the new one.
