FROM node:20-alpine

WORKDIR /app

# Copy lockfile + package.json so npm ci can use the exact resolved versions
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install from lockfile — includes all deps (devDeps needed for prisma generate)
RUN npm ci --legacy-peer-deps

# Copy pre-built source (build/ committed — skips remix build on Render)
COPY . .

# Generate Prisma client for the target platform (Alpine linux-musl)
RUN npx prisma generate

# Render Docker web services default to PORT=10000
EXPOSE 10000

# Run DB migrations (best-effort) then serve; ; not && so server starts even if migrate errors
CMD ["sh", "-c", "npx prisma migrate deploy; npm run start"]
