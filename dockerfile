FROM oven/bun:alpine AS builder
WORKDIR /app


COPY package.json bun.lock ./
COPY prisma ./prisma/


RUN bun install --frozen-lockfile


COPY . .


FROM oven/bun:alpine AS runner
WORKDIR /app


ENV NODE_ENV=production


COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/src ./src

EXPOSE 7000


CMD ["bun", "run", "src/index.ts"]