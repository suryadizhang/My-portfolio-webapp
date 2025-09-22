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

# Copy source first, then overlay node_modules to avoid overwriting
COPY . .
COPY --from=deps /repo/node_modules ./node_modules

# Change to apps/web directory and run build there for proper path resolution
WORKDIR /repo/apps/web
RUN npm run build

############################
# 3) Runtime = pure standalone
############################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone structure to match workflow expectations
# The workflow expects /app/standalone/server.js
COPY --from=builder /repo/apps/web/.next/standalone/apps/web ./standalone
COPY --from=builder /repo/apps/web/.next/static ./standalone/.next/static  
COPY --from=builder /repo/apps/web/public ./standalone/public

# Now server.js should be at ./standalone/server.js as workflow expects
CMD ["node", "standalone/server.js"]