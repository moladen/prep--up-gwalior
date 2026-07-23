# Prep Up Gwalior

Monorepo layout:

```
prep-up-gwalior/
├── client/   # Next.js (Vercel)
└── server/   # Express API (company VPS)
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

### Client (Vercel)
- Set **Root Directory** to `client`
- Env: `NEXT_PUBLIC_API_URL=https://your-api-domain.com`

### Server (company VPS)
- Deploy the `server/` folder
- Env: `FRONTEND_URL`, `API_PUBLIC_URL`, `DATABASE_URL`, `JWT_SECRET`, admin credentials
- Persist `server/uploads/` on disk
