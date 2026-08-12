FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY prisma ./prisma/

# Install all deps (including devDeps needed for remix build)
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client and build Remix app
RUN npx prisma generate && npm run build

# Prune devDependencies for smaller runtime image
RUN npm prune --production

EXPOSE 3000

# Run DB migrations on start, then serve
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
