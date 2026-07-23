# Prep Up Gwalior

Monorepo layout:

```
prep-up-gwalior/
├── client/              # Next.js (Vercel / Docker)
├── server/              # Express API (VPS / Docker)
├── docker-compose.yml   # Postgres + server + client
└── package.json         # local monorepo scripts
```

## Local development

```bash
# install (from repo root)
npm install
npm install --prefix client
npm install --prefix server

# copy env files
cp client/.env.example client/.env.local
cp server/.env.example server/.env

# database + seed
npm run seed

# run both (client :3000, server :5000)
npm run dev
```

Useful scripts:

| Script | What it does |
|--------|----------------|
| `npm run dev` | Client + server together |
| `npm run dev:client` | Next.js only |
| `npm run dev:server` | API only |
| `npm run seed` | Prisma push + seed |
| `npm run build` | Build client |

## Deploy

### Docker (local / VPS)

```bash
# build + run Postgres + API + Next.js
docker compose up --build -d

# site:  http://localhost:3000
# API:   http://localhost:5000
# DB:    localhost:5434
```

Optional seed after first boot:

```bash
docker compose exec server npm run seed
```

Upload files persist in the `uploads` Docker volume.

### Client (Vercel)
- Set **Root Directory** to `client`
- Env: `NEXT_PUBLIC_API_URL=https://your-api-domain.com`

### Server (company VPS)
- Deploy with Docker (`server/Dockerfile`) or run Node directly from `server/`
- Env: `FRONTEND_URL`, `API_PUBLIC_URL`, `DATABASE_URL`, `JWT_SECRET`, admin credentials
- Persist `uploads/` (volume or disk)
