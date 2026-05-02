# Ananya — The House of Sarees

## Overview

pnpm workspace monorepo. Two artifacts: a React + Vite luxury saree brand website, and a Node.js/Express/MongoDB API server.

## Artifacts

| Artifact | Dir | Preview Path |
|---|---|---|
| Luxury Saree Brand (frontend) | `artifacts/saree-brand` | `/` |
| API Server (backend) | `artifacts/api-server` | `/api` |

## Stack

**Frontend (`artifacts/saree-brand`):**
- React 18 + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion (page transitions + Reorder DnD)
- Wouter (client-side routing)
- React Icons

**Backend (`artifacts/api-server`):**
- Node.js 24 + Express + TypeScript (ESM, built with esbuild)
- MongoDB + Mongoose
- JWT authentication (jsonwebtoken + bcryptjs)
- Cloudinary image uploads (multer + cloudinary)

## Design Tokens

| Token | Value |
|---|---|
| Background | `#FAF7F2` |
| Gold | `#B8973E` |
| Pale Gold | `#D4AF72` |
| Charcoal | `#2C2A26` |
| Admin sidebar | `#16151A` |
| Admin bg | `#F4F3F1` |

Fonts: Cormorant Garamond (serif) + DM Sans (sans) via Google Fonts `@import` in `index.css`.

## Key Files

### Frontend
- `src/App.tsx` — Router with `AuthProvider` + `NotificationProvider` wrappers; `SocketListener` component subscribes to real-time events
- `src/lib/socket.ts` — Singleton `socket.io-client` instance; connects to `/api/socket.io`
- `src/components/NotificationToast.tsx` — Premium animated toast system (Framer Motion slide-in, auto-dismiss, progress bar, 4 kinds: new_saree/admin_message/success/error)
- `src/contexts/AuthContext.tsx` — JWT auth context (localStorage token persistence)
- `src/services/api.ts` — All API functions, `UISaree` type, `normalizeSaree()`, token helpers (`getToken`, `clearToken`)
- `src/pages/admin-login.tsx` — Calls real `loginAdmin()` API, redirects on success
- `src/pages/admin-dashboard.tsx` — Auth-guarded; fetches sarees + collections from API; live stats + category breakdown; `BroadcastPanel` for sending real-time announcements
- `src/pages/admin-content.tsx` — Auth-guarded; fetches homepage content; saves via `updateHomepage()`
- `src/pages/collections.tsx` — Fetches sarees from API with skeleton + static fallback
- `src/pages/saree-detail.tsx` — Fetches single saree with skeleton + static fallback
- `src/data/sarees.ts` — Static fallback data (12 sarees) — kept for offline/no-backend mode

### Backend
- `src/index.ts` — Express bootstrap; `createServer(app)` + `initSocket(server)` for Socket.io; MongoDB and Cloudinary failures are non-fatal
- `src/socket/index.ts` — Socket.io singleton (`initSocket`, `getIo`); path `/api/socket.io`; logs connect/disconnect/join events
- `src/models/Saree.ts` — Mongoose saree model
- `src/models/Collection.ts` — Mongoose collection model
- `src/routes/auth.ts` — `POST /api/auth/login` (JWT)
- `src/routes/sarees.ts` — CRUD saree routes
- `src/routes/collections.ts` — CRUD collection routes
- `src/routes/homepage.ts` — GET/PUT homepage content
- `src/routes/upload.ts` — Cloudinary image upload
- `src/routes/broadcast.routes.ts` — `POST /api/broadcast` (JWT-protected)
- `src/controllers/broadcast.controller.ts` — Emits `admin_message` event to all socket clients
- `build.mjs` — esbuild bundler

## Required Secrets (not yet set)

| Secret | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary project name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Without these the API server still starts and serves requests — it just returns 503 for DB/upload routes.

## Auth Flow

- Admin logs in at `/admin` → `POST /api/auth/login` → JWT stored in `localStorage` under key `ananya_admin_token`
- `AuthContext` exposes `token`, `setToken`, `clearToken`
- Dashboard and content pages auth-guard via `getToken()` → redirect to `/admin` if absent

## API Base URL

`/api` — proxied by the shared Replit reverse proxy from the frontend's dev server.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/saree-brand run dev` — start frontend dev server
- `pnpm --filter @workspace/api-server run dev` — build + start API server
