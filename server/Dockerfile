# Prep Up Gwalior — API (Express + Prisma)
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate

COPY src ./src

RUN mkdir -p uploads

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
VOLUME ["/app/uploads"]

# db push on boot (safe for first deploy); then start API
CMD ["sh", "-c", "npx prisma db push --skip-generate && node src/index.js"]
