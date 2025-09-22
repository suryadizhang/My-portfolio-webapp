# syntax=docker/dockerfile:1.6

############################
# 1) Dependencies
############################
FROM node:20-alpine AS deps
WORKDIR /repo

# Copy only manifests for better caching
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json  
COPY packages/config/package.json packages/config/package.json

RUN npm ci

############################
# 2) Build apps/web
############################
FROM node:20-alpine AS builder
WORKDIR /repo
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /repo/node_modules ./node_modules
COPY . .

# IMPORTANT: build in the web app folder where next.config.js is located
WORKDIR /repo/apps/web
RUN npm run build   # next.config.js already has `output: 'standalone'`

############################
# 3) Runtime = pure standalone
############################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create the standalone tree in a predictable place
# This gives us: /app/standalone/server.js (entry), /app/standalone/.next/static, etc.
COPY --from=builder /repo/apps/web/.next/standalone ./standalone
COPY --from=builder /repo/apps/web/.next/static ./standalone/.next/static
COPY --from=builder /repo/apps/web/public ./standalone/public

# (Optional) default command: allows `docker run IMAGE` to "just work"
CMD ["node", "standalone/server.js"]