FROM node:20-alpine

WORKDIR /app

# Copy lockfile + package.json so npm ci can use the exact resolved versions
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install from lockfile — fast, deterministic, includes devDeps
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client and build Remix app
RUN npx prisma generate && npm run build

# Prune devDependencies for smaller runtime image
RUN npm prune --production

EXPOSE 3000

# Run DB migrations on start, then serve
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
