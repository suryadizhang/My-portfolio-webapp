# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS deps
WORKDIR /repo

# Copy package manifests for workspace dependency resolution
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/config/package.json packages/config/package.json

# Install ALL dependencies including workspaces
RUN npm ci

# ---------- Build ----------
FROM node:20-alpine AS builder
WORKDIR /repo

# Bring installed dependencies
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/package.json ./package.json

# Copy the entire repository (includes tsconfig.base.json and all sources)
COPY . .

# Build Next.js app (transpilePackages will handle workspace compilation)
WORKDIR /repo/apps/web
RUN npm run build

# Verify standalone output was created
RUN ls -la .next/ && test -f .next/standalone/server.js || (echo "ERROR: standalone build failed" && exit 1)

# ---------- Runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone output to expected location
COPY --from=builder /repo/apps/web/.next/standalone ./standalone
COPY --from=builder /repo/apps/web/.next/static ./standalone/.next/static
COPY --from=builder /repo/apps/web/public ./standalone/public

# Verify server.js is in the expected location
RUN test -f ./standalone/server.js || (echo "ERROR: server.js not found at ./standalone/server.js" && exit 1)

# Next standalone includes a server.js in /app/standalone
EXPOSE 3000
CMD ["node", "standalone/server.js"]