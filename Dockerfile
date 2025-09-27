# --- deps ---
FROM node:20-alpine AS deps
WORKDIR /repo

# Copy only the manifests so CI cache works well
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/config/package.json packages/config/package.json

# Install workspace deps (keep devDeps, we need them for build)
RUN npm ci

# --- builder ---
FROM node:20-alpine AS builder
WORKDIR /repo

# node_modules from deps + full source
COPY --from=deps /repo/node_modules ./node_modules
COPY . .

# Build the web app (Next 15 with output: 'standalone')
WORKDIR /repo/apps/web
ENV NODE_ENV=production
RUN npm run build

# --- runner (final artifact layout for extraction or direct run) ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone output to /app, so server.js is at /app/server.js
COPY --from=builder /repo/apps/web/.next/standalone/apps/web ./
# Copy the rest of the monorepo standalone structure needed
COPY --from=builder /repo/apps/web/.next/standalone/node_modules ./node_modules
COPY --from=builder /repo/apps/web/.next/standalone/packages ./packages
# Static files + public assets  
COPY --from=builder /repo/apps/web/.next/static ./.next/static
COPY --from=builder /repo/apps/web/public ./public

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]