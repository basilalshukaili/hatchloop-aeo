FROM node:20-alpine

WORKDIR /app

# Copy lockfile + package.json so npm ci can use the exact resolved versions
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install from lockfile — force devDeps (@remix-run/dev) even if NODE_ENV=production,
# because we now compile the Remix build inside the image (see RUN npm run build below).
RUN npm ci --include=dev --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client for the target platform (Alpine linux-musl)
RUN npx prisma generate

# Compile the Remix build FRESH from the current source on every image build.
# NEVER serve a stale committed build/ artifact — that trap caused the GDPR
# webhook routes to 404 in production (2026-08-13): route source files were
# added but build/ was never recompiled. Building here makes source the single
# source of truth so new routes/pages always ship.
RUN npm run build

# Render Docker web services default to PORT=10000
EXPOSE 10000

# Run DB migrations (best-effort) then serve; ; not && so server starts even if migrate errors
CMD ["sh", "-c", "npx prisma migrate deploy; npm run start"]
