# 📜 SnippetVault

A lightweight web dashboard for managing code snippets across machines via a central REST API. Save, search, copy, and organize snippets with an intuitive UI. Built for solo developers who want speed, clarity, and visual organization without heavy SaaS overhead.

**Design Philosophy:** Web-first dashboard for visual search, tag management, stats, and inline editing. No bloat, no complex auth, no WebSockets—just instant sync and one source of truth.

---

## 📦 Tech Stack

| Layer            | Technology           | Version | Purpose                                           |
| ---------------- | -------------------- | ------- | ------------------------------------------------- |
| **Frontend**     | Angular (Standalone) | 21.2    | Lightweight dashboard, routing, state via Signals |
| **Backend**      | NestJS + Express     | 10.0    | REST API, validation, auth middleware             |
| **Database**     | MongoDB + Mongoose   | 8.0     | Snippet storage, full-text search, indexing       |
| **Testing**      | Vitest               | Latest  | Unit tests, fast iteration                        |
| **Styling**      | SCSS + CSS Variables | -       | Global theming, lightweight utilities             |
| **Code Quality** | Prettier             | 3.8     | Unified formatting across monorepo                |

---

## 🗂️ Project Structure

This is an **npm workspaces monorepo** with two packages:

```
snippet-vault/
├── web/                    # Angular dashboard
├── api/                    # NestJS REST API
├── package.json           # Root workspace config
└── tsconfig.json          # Shared TypeScript base
```

### `/web` — Angular Dashboard

- **Routing:** `/` (Dashboard), `/library` (Full Search/Filter), `/snippet/:id` (View/Edit)
- **Components:** Standalone, with Signals for state management
- **Features:** Global search, tag filtering, language filtering, inline editor, copy to clipboard
- **UI Library:** PrimeNG for components, custom SCSS styling

### `/api` — NestJS Backend

- **Modules:** Auth (API key middleware), Snippet (CRUD + search)
- **Database:** Mongoose schemas with full-text indexing on title/content
- **Endpoints:** Standard REST (POST/GET/PATCH/DELETE) + `/stats` + `/export/json`
- **Validation:** class-validator + class-transformer DTOs

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ with npm 11+
- **MongoDB** (local or Atlas connection string)

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/you/snippet-vault.git
cd snippet-vault
npm install
```

### Environment Setup

Create a `.env` file in the root (or set env vars):

```bash
# API Configuration
VAULT_API_KEY=your-secure-api-key-here
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/snippets
PORT=3000
NODE_ENV=development

# Web Dashboard
ANGULAR_API_URL=http://localhost:3000/api
```

### Development Scripts

```bash
# Start all services
npm start

# Or start individually:
npm run dev:web      # Angular on http://localhost:4200
npm run dev:api      # NestJS API on http://localhost:3000

# Run tests
npm run test:web
npm run test:api

# Format code
npm run format
```

---

## 🏗️ Building

```bash
# Build all packages
npm run build:web
npm run build:api

# Build artifacts:
# - web/dist/        → Angular production bundle
# - api/dist/        → Compiled NestJS code
```

---

## 🧪 Testing

### Web (Angular + Vitest)

```bash
npm run test:web
```

### API (NestJS)

```bash
npm run test:api
```

---

## 🔌 API Reference

All endpoints require the `Authorization: Bearer <VAULT_API_KEY>` header.

| M
| `GET` | `/api/snippets?q=search&tags=tag1&language=ts` | Search/filter snippets |
| `GET` | `/api/snippets/stats` | Get dashboard stats (counts, top langs) |
| `GET` | `/api/snippets/:id` | Get single snippet |
| `PATCH` | `/api/snippets/:id` | Update snippet (content, tags, etc.) |
| `ethod | Endpoint | Description |
|--------|----------|-------------|
| `POST`|`/api/snippets`| Create a new snippet |
|`GET`|`/api/snippets?q=search&tags=tag1&language=ts`| Search/filter snippets |
|`GET`|`/api/snippets/stats`| Get dashboard stats (counts, top langs) |
|`GET`|`/api/snippets/:id`| Get single snippet |
|`PATCH`|`/api/snippets/:id`| Update snippet (content, tags, etc.) |
|`DELETE`|`/api/snippets/:id`| Delete snippet |
|`GET`|`/api/export/json` | Export all snippets as JSON |

---

## 📐 Architecture Notes

- **State Management:** Angular Signals + HttpClient (no NgRx)
- **Styling:** SCSS with CSS Variables for theming; minimal utility classes
- **Single-User:** One API key per deployment; no OAuth or role-based access
- **Offline Resilience:** Web shows loading skeletons on network issues
- **Security:** All DTOs validated server-side; rate limiting recommended (100 req/min)

---

run build:web

# Deploy web/dist/ to Vercel

````

### Backend (NestJS) → Render/Railway

```bash
npm

### Backend (NestJS) → Render/Railway
```bash
npm run build:api
# Set env vars: MONGO_URI, VAULT_API_KEY, PORT, NODE_ENV
# Deploy api/dist/ + package.json
```

### Database → MongoDB Atlas
1. Create a free cluster
2. Add IP allowlist (or 0.0.0.0/0 for dev)
3. Copy connection string to `MONGO_URI` env var
- **Indent:** 2 spaces
- **Quotes:** Single quotes
- **Print Width:** 100 characters
- **Component Names:** ShoWeb shows loading skeletons on network issue
- **File Naming:** kebab-case for routes/features
- **TypeScript:** `strict: true`, `strictTemplates: true`

---

## 🤝 Contributing

This is a solo project. For issues or feature requests, see [spec.md](spec.md).

---

## 📄 License

MIT
rt form (`App`, `Dashboard`) — not `AppComponent`
````
