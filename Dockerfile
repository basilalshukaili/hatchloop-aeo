FROM node:20-alpine

WORKDIR /app

# Copy lockfile + package.json so npm ci can use the exact resolved versions
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install from lockfile — fast, deterministic, includes devDeps for prisma generate
RUN npm ci --legacy-peer-deps

# Copy pre-built source (build/ committed — skips remix build on Render)
COPY . .

# Generate Prisma client for the target platform
RUN npx prisma generate

# Prune devDependencies for smaller runtime image (prisma CLI is in deps, stays)
RUN npm prune --production

EXPOSE 3000

# Run DB migrations on start, then serve
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
