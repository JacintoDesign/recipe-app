# Recipes

A full-stack Progressive Web App for discovering recipes from TheMealDB. The app features offline-ready browsing, favorite recipes stored locally, and a Node.js proxy server that keeps the API key secure.

## Features

- React + Vite frontend styled with Tailwind CSS and shadcn/ui-inspired components.
- Node.js/Express backend proxy that forwards requests to TheMealDB and caches category data.
- Installable PWA with service worker, manifest, offline fallback page, and runtime caching strategies.
- IndexedDB favorites (works fully offline): add, view, and remove recipes without a network connection.
- Search, browse categories, recipe details, and favorites view with skeleton loaders, error boundaries, and toasts.
- Dark/system/light theme toggle with persistence.
- Accessible design: semantic markup, keyboard focus states, alt text, skip link.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Sonner toasts.
- **Backend:** Node.js 20+, Express, TypeScript, node-fetch, NodeCache, Helmet, Compression, CORS.
- **Storage & PWA:** IndexedDB via `idb`, Service Worker, Web App Manifest.

## Project Structure

```
recipe-app/
├── README.md
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── index.ts
│       └── routes/
│           └── mealdb.ts
└── client/
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── index.html
    ├── postcss.config.cjs
    ├── tailwind.config.cjs
    ├── public/
    │   ├── manifest.webmanifest
    │   ├── offline.html
    │   └── icons/
    │       ├── icon-192.png
    │       ├── icon-512.png
    │       └── icon-maskable-512.png
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── router.tsx
        ├── styles/globals.css
        ├── sw.js
        ├── components/
        │   ├── app-header.tsx
        │   ├── category-chips.tsx
        │   ├── empty-state.tsx
        │   ├── error-boundary.tsx
        │   ├── meal-card.tsx
        │   ├── meal-list.tsx
        │   ├── offline-banner.tsx
        │   ├── offline-toast.tsx
        │   ├── theme-provider.tsx
        │   ├── theme-toggle.tsx
        │   └── ui/
        │       ├── badge.tsx
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── input.tsx
        │       ├── skeleton.tsx
        │       └── sonner.tsx
        ├── hooks/
        │   └── use-online-status.ts
        ├── lib/
        │   ├── api.ts
        │   ├── queryClient.ts
        │   └── utils.ts
        ├── pages/
        │   ├── Details.tsx
        │   ├── Favorites.tsx
        │   └── Home.tsx
        ├── features/
        │   └── favorites/
        │       ├── db.ts
        │       └── favorites-context.tsx
        └── types/
            └── meal.ts
```

## Setup & Development

### Prerequisites

- Node.js 20+
- npm 10+

### Backend (server)

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Environment variables in `.env`:

- `MEALDB_API_BASE` (default: `https://www.themealdb.com/api/json/v1`)
- `MEALDB_API_KEY` (default: `1` for development)
- `PORT` (default: `5174`)
- `CACHE_TTL_MS` (default: `600000`)
- `CLIENT_ORIGIN` (optional: comma-separated list for CORS)

### Frontend (client)

```bash
cd client
npm install
npm run dev
```

The Vite dev server runs at http://localhost:5173 and proxies `/api` to the backend (http://localhost:5174). Adjust `VITE_SERVER_URL` in `.env` if deploying.

### shadcn/ui Setup Notes

This project includes pre-built components modeled after shadcn/ui. If you want the CLI for generating additional components:

```bash
# inside client/
npm install -D shadcn-ui@latest
npx shadcn-ui init
```

Follow prompts to integrate with Tailwind + Vite. Components in `src/components/ui` follow the same patterns and can be extended.

## PWA Features

- `manifest.webmanifest`: includes app metadata, icons, theme color, and standalone display.
- `src/sw.js`: custom service worker that precaches the app shell, caches `/api` responses with network-first strategy, and provides offline fallback for navigation.
- Install prompts via browser; ensure served over HTTPS (or localhost) for testing.

### Offline Testing

1. Run `npm run dev` in both `server` and `client` folders.
2. Open http://localhost:5173 in Chrome.
3. In DevTools > Application > Service Workers, check “Offline”.
4. Navigate through the app; previously loaded pages and saved favorites remain available.
5. Favorites can be added/removed offline if their details have been fetched at least once.

## Caching Strategies

- **App Shell**: precached during install (`APP_SHELL_ASSETS`).
- **API Responses**: `/api/*` uses network-first with cache fallback for offline access to previously fetched meals/searches.
- **Images**: stale-while-revalidate—cached versions show while fetching latest.
- **Offline Fallback**: `offline.html` served for navigation when both network and cache miss.

To adjust caching, edit `client/src/sw.js`:

- Update `CACHE_VERSION` to bust caches.
- Modify route matching or caching logic in `networkFirst`/`staleWhileRevalidate` handlers.

## Scripts

- **Server**
  - `npm run dev` – development with `ts-node-dev`
  - `npm run build` – TypeScript build to `dist`
  - `npm run start` – run built server
- **Client**
  - `npm run dev` – Vite dev server
  - `npm run build` – TypeScript check + Vite build
  - `npm run preview` – preview production build

## Deployment Notes

- **Server**: Deploy to services like Render, Railway, or Fly.io. Set environment variables for API base, key, and CORS origins.
- **Client**: Deploy static build (e.g., Netlify, Vercel). Configure environment variable `VITE_SERVER_URL` to point to deployed server. Ensure HTTPS for PWA installability.

## Post-Generation Checklist

- [ ] Run `npm install` in both `server` and `client` directories.
- [ ] Generate additional shadcn components if needed.
- [ ] Replace placeholder icons under `client/public/icons` with branded assets.
- [ ] Configure production domains in `CLIENT_ORIGIN` and `VITE_SERVER_URL`.
- [ ] Verify PWA installability in Lighthouse/Audits.

