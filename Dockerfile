FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy built files
COPY dist ./dist

# Default command (override in docker-compose)
CMD ["node", "dist/main-bot/index.js"]
