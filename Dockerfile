# Base Image
FROM node:20-alpine AS base

# Global install pnpm
RUN npm i -g pnpm

# Create app directory
WORKDIR /app

# Dependencies
FROM base AS dependencies

# A wildcard is used to ensure both package.json AND package-lock.json or pnpm-lock.yaml are copied
COPY package.json pnpm-lock.yaml ./

# Install app dependencies
RUN pnpm install --frozen-lockfile

# Copy Prisma schema
COPY prisma ./prisma
RUN pnpm prisma generate

# Builder
FROM dependencies AS builder

# Bundle app source
COPY . .

# Build app
RUN pnpm build

# Production Image
FROM base AS production

# Set environment
ENV NODE_ENV=production

# Bundle app source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]
