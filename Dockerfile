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

# Build the web app from the correct directory
# The node_modules are available at /repo/node_modules which Next.js will find
WORKDIR /repo/apps/web
RUN npm run build

############################
# 3) Runtime = pure standalone
############################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone Next.js app with correct structure
COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public

CMD ["node", "apps/web/server.js"]