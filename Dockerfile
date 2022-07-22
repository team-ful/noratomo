# Based on https://github.com/vercel/next.js/tree/canary/examples/with-docker
# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app

# argon2で、Alpine Linuxでは、ビルド時と実行時のnodeのバージョンが違うと実行エラーが発生するため、ソースからビルドする
# ref. https://github.com/ranisalt/node-argon2/issues/302
ENV npm_config_build_from_source true

# argon2のビルド必要なツールをインストール
RUN apk add make g++ python3 git
RUN yarn global add -g node-pre-gyp

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
