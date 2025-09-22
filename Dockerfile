# Multi-stage Docker build for Next.js standalone
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy all package.json files to ensure proper workspace resolution
COPY package*.json ./

# Create directory structure for workspace packages
RUN mkdir -p packages/config packages/ui packages/utils apps/web

# Copy individual package.json files
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY apps/web/package.json ./apps/web/

# Install all dependencies including dev dependencies for building
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the web application with standalone output
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the complete standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./standalone/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./standalone/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run the standalone server
CMD ["node", "standalone/server.js"]