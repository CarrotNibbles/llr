FROM oven/bun:alpine AS build
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Serve on Node rather than Bun: Next.js only supports Node in production, and under Bun the V8 heap flags in NODE_OPTIONS are silently ignored.
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Kubernetes sets HOSTNAME to the pod name, so override it. Bind dual-stack like `next start` does: the next-intl middleware rewrite proxies to `localhost`, which may resolve to ::1.
ENV HOSTNAME=::

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
