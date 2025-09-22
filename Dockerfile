# syntax=docker/dockerfile:1.6
# Pin base image with digest for reproducible builds
FROM node:20.11.1-alpine@sha256:6e80991f69cc7722c561e5d14d5e72ab47c0d6b6cfb3ae50fb9cf9a7b30fdf97 AS base
WORKDIR /repo

# Copy package manifests for workspace dependency resolution
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/config/package.json packages/config/package.json

# Copy workspace sources BEFORE install to satisfy file: links
COPY packages/ui packages/ui
COPY packages/utils packages/utils
COPY packages/config packages/config

# Install dependencies reproducibly for the whole workspace
RUN npm ci --include-workspace-root --workspaces

# ---------- Build ----------
FROM base AS build

# Copy the rest (web app source, tsconfigs, etc.)
COPY . .

# Fail early if critical config files are missing
RUN test -f tsconfig.base.json || (echo "❌ tsconfig.base.json missing" && exit 1)
RUN test -f apps/web/next.config.js || (echo "❌ next.config.js missing" && exit 1)

# Build workspace packages first (if they emit dist/)
RUN npm run build --workspace=@portfolio/utils --if-present || true
RUN npm run build --workspace=@portfolio/ui --if-present || true
RUN npm run build --workspace=@portfolio/config --if-present || true

# Build Next.js app with standalone output
WORKDIR /repo/apps/web
RUN npm run build

# Verify standalone output was created in monorepo layout
RUN test -f .next/standalone/apps/web/server.js || (echo "❌ Standalone server not found" && ls -la .next/standalone/ && exit 1)

# ---------- Runtime ----------
FROM node:20.11.1-alpine@sha256:6e80991f69cc7722c561e5d14d5e72ab47c0d6b6cfb3ae50fb9cf9a7b30fdf97 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy monorepo standalone layout
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /repo/apps/web/public ./apps/web/public

# Verify server.js is in the correct monorepo path
RUN test -f ./apps/web/server.js || (echo "❌ server.js not found at ./apps/web/server.js" && find . -name "server.js" && exit 1)

EXPOSE 3000
CMD ["node", "apps/web/server.js"]