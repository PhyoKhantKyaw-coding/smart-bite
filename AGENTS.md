# Smart Bite - Agent Guidance

## Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server (http://localhost:5173)
pnpm build      # Production build
pnpm lint       # ESLint (only lint - no typecheck script)
```

## Environment

Create `.env` from `.env.example`:
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

## Architecture

- **Roles**: `user` (customer), `delivery` (partner), `admin`
- **Routing**: Role-based protected routes in `src/router/Router.tsx`
  - `/admin` → AdminLayout
  - `/delivery` → DeliveryLayout
  - `/user` → UserLayout
- **Auth**: JWT in localStorage, profile data in sessionStorage
- **State**: Redux Toolkit + TanStack Query

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks/UseAuth.tsx` | Auth flow, JWT decode, role redirect, delivery location tracking |
| `src/configs/axios.ts` | API base URL configuration |
| `src/services/signalRService.ts` | Real-time connection hub |

## Build Quirks

- vite.config.ts polyfills: `stream` → `stream-browserify`, `url` → `url-browserify`
- TailwindCSS v4 uses `@tailwindcss/postcss` (see postcss.config.js)
- Post-install: `find node_modules -name "esbuild" -type f -exec chmod +x {} \;`
- Define `globalThis` for some dependencies

## Testing Login

The app requires a backend with these endpoints:
- POST `/login` - returns JWT with claims: `NameIdentifier`, `Role`, `Name`
- POST `/google-login?idToken={token}`
- POST `/register` - multipart/form-data with user fields + lat/lng

See `SETUP_GUIDE.md` for full backend requirements.

## Referenced Docs

- `SETUP_GUIDE.md` - Auth setup & backend integration
- `SIGNALR_SETUP.md` - Real-time features
- `REALTIME_TRACKING_SETUP.md` - Delivery tracking
- `DELIVERY_LOCATION_GUIDE.md` - Location features