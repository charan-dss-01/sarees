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
- `src/pages/admin-dashboard.tsx` — Auth-guarded; fetches sarees + collections + analytics from API; live stat cards (total sarees, collections, enquiries, catalogue value); `MonthlyUploadsChart` (recharts BarChart, last 12 months); `BroadcastPanel` for real-time announcements
- `src/pages/admin-content.tsx` — Auth-guarded; fetches homepage content; saves via `updateHomepage()`
- `src/pages/collections.tsx` — Fetches sarees from API with skeleton + static fallback
- `src/pages/saree-detail.tsx` — Fetches single saree with skeleton + static fallback
- `src/data/sarees.ts` — Static fallback data (12 sarees) — kept for offline/no-backend mode

### Backend
- `src/index.ts` — Express bootstrap; `connectDB()` → `seedAdmin()` on boot; `createServer(app)` + `initSocket(server)`; MongoDB/Cloudinary failures are non-fatal warnings
- `src/utils/seedAdmin.ts` — Creates first admin user on boot if no users exist (reads ADMIN_EMAIL/ADMIN_PASSWORD env vars, defaults: admin@ananya.com / Ananya@2025!)
- `src/socket/index.ts` — Socket.io singleton (`initSocket`, `getIo`); path `/api/socket.io`
- `src/middlewares/auth.ts` — JWT `protect` middleware; reads `Authorization: Bearer <token>`
- `src/middlewares/validate.ts` — `requireString`, `requireEmail`, `requirePassword`, `requirePositiveNumber`, `validateMongoId`, `parsePagination`
- `src/middlewares/error.ts` — Central error handler: AppError→JSON, CastError→400, ValidationError→422, duplicate→409, buffering timeout→503, JWT→401, Multer→413, else→500
- `src/middlewares/upload.ts` — multer memory storage; `uploadSingle` (field: `image`) + `uploadMultiple` (field: `images`, max 10); JPEG/PNG/WebP/AVIF only; 10 MB limit
- `src/middlewares/sanitize.ts` — Custom NoSQL injection sanitizer (Express 5 compatible)
- `src/models/User.ts` — Admin user; bcrypt hash on save; `comparePassword()`
- `src/models/Saree.ts` — Fields: title, price, fabric, images[], collection (ref); indexes: collection+createdAt, fabric, title text
- `src/models/Collection.ts` — Fields: name (unique), image; index: name unique
- `src/models/HomepageContent.ts` — Fields: heroImages[], featuredCollections[], banners[]
- `src/models/Enquiry.ts` — Fields: sareeId (ObjectId?), sareeTitle; indexes: createdAt, sareeId
- `src/routes/auth.routes.ts` — `POST /api/auth/login`, `GET /api/auth/me` (JWT)
- `src/routes/collection.routes.ts` — `GET /api/collections`, `GET /api/collections/:id`, `POST` (JWT+upload), `PUT /:id` (JWT+upload), `DELETE /:id` (JWT; blocks if sarees exist)
- `src/routes/saree.routes.ts` — `GET /api/sarees` (paginated, filterable by collection/fabric), `GET /api/sarees/:id`, `POST` (JWT+upload), `PUT /:id` (JWT+upload; cleans old Cloudinary images), `DELETE /:id` (JWT; cleans Cloudinary images)
- `src/routes/homepage.routes.ts` — `GET /api/homepage`, `PUT /api/homepage` (JWT+upload; upserts single doc)
- `src/routes/analytics.routes.ts` — `GET /api/analytics` (public; 12-month aggregation)
- `src/routes/enquiry.routes.ts` — `POST /api/enquiry` (public), `GET /api/enquiry` (JWT; last 50)
- `src/routes/broadcast.routes.ts` — `POST /api/broadcast` (JWT; emits `admin_message` to all sockets)
- `src/controllers/collection.controller.ts` — DELETE blocks with 409 if sarees still reference the collection; UPDATE deletes old Cloudinary image on replace
- `src/controllers/saree.controller.ts` — DELETE + UPDATE both clean up replaced Cloudinary images (best-effort, non-blocking)
- `src/controllers/analytics.controller.ts` — Parallel Promise.all aggregation; full 12-month window always present (zeros for empty months)
- `src/services/cloudinary.service.ts` — `uploadToCloudinary` (stream upload) + `deleteFromCloudinary`
- `src/utils/jwt.ts` — `signToken` (7d expiry by default) + `verifyToken`; throws if JWT_SECRET missing
- `src/utils/AppError.ts` — Operational error class with `statusCode`
- `build.mjs` — esbuild ESM bundler

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
