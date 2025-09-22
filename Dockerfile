# syntax=docker/dockerfile:1.6

############################
# 1) Dependencies
############################
FROM node:20-alpine AS deps
WORKDIR /repo

# Copy root manifests and workspace structure
COPY package.json package-lock.json ./
COPY apps/ apps/
COPY packages/ packages/

# Install dependencies for all workspaces
RUN npm ci

############################
# 2) Build apps/web
############################
FROM node:20-alpine AS builder
WORKDIR /repo
ENV NEXT_TELEMETRY_DISABLED=1

# Bring installed node_modules and then the source
COPY --from=deps /repo/node_modules ./node_modules
COPY . .

# Build the web app using workspace command
RUN npm run -w @portfolio/web build

############################
# 3) Runtime = pure standalone
############################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Put the standalone output in a stable place
COPY --from=builder /repo/apps/web/.next/standalone ./standalone
COPY --from=builder /repo/apps/web/.next/static ./standalone/.next/static
COPY --from=builder /repo/apps/web/public ./standalone/public

CMD ["node", "standalone/server.js"]