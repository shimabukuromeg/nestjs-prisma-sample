#==================================================
# Build Layer
FROM --platform=linux/amd64 node:20 as build

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma

RUN yarn install --non-interactive --frozen-lockfile

RUN yarn prisma generate

COPY . .

RUN yarn build

#==================================================
# Package install Layer
FROM --platform=linux/amd64 node:20 as node_modules

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma

RUN yarn install --non-interactive --frozen-lockfile --prod

RUN yarn prisma generate

#==================================================
# Run Layer
FROM --platform=linux/amd64 node:20-slim as node

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist /app/dist
COPY --from=build /app/prisma /app/prisma
COPY --from=node_modules /app/package.json /app/yarn.lock ./
COPY --from=node_modules /app/node_modules /app/node_modules

CMD ["/usr/local/bin/yarn", "start:prod"]
