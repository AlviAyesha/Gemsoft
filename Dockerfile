# GEMSOFT website: production image for your own server (VPS).
# Build:  docker build -t gemsoft-web .
# Run:    see docker-compose.yml (app + Postgres), or pass DATABASE_URL etc. with -e

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_OUTPUT=standalone
# The build pre-renders pages from the database, so it needs DATABASE_URL and the public site address.
ARG DATABASE_URL
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_GA_ID
# a throwaway secret is enough to build; the real one is passed when the container runs
RUN PAYLOAD_SECRET=build-only-not-secret npm run build:deploy

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build /app/src/design ./src/design
# uploads land here when no S3 bucket is configured; mount a volume on it
RUN mkdir -p media resumes && chown app:app media resumes
USER app
EXPOSE 3000
CMD ["node", "server.js"]
