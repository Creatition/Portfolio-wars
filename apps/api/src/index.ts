/**
 * Portfolio Wars API service.
 * Hosts the tRPC router defined in @pw/shared.
 *
 * Deploys to Railway. Set ALLOWED_ORIGINS env var to your Cloudflare Pages URL.
 */

import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { appRouter, type AppRouter } from "@pw/shared";
import { env } from "./env";

async function main() {
  const app = Fastify({
    logger: { level: env.NODE_ENV === "production" ? "info" : "debug" },
    trustProxy: true,
    maxParamLength: 5_000 // tRPC procedure paths can get long with batching
  });

  await app.register(cors, {
    origin: env.ALLOWED_ORIGINS.length === 1 && env.ALLOWED_ORIGINS[0] === "*"
      ? true
      : env.ALLOWED_ORIGINS,
    credentials: false,
    methods: ["GET", "POST", "OPTIONS"]
  });

  // Health checks (Railway and uptime monitors hit /).
  app.get("/", async () => ({ name: "portfolio-wars-api", ok: true, ts: new Date().toISOString() }));
  app.get("/health", async () => ({ ok: true }));

  // Mount the tRPC router at /trpc.
  await app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: () => ({}),
      onError({ path, error }) {
        app.log.error({ path, error }, "tRPC error");
      }
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"]
  });

  app.log.info({ allowedOrigins: env.ALLOWED_ORIGINS }, "Starting API");
  await app.listen({ port: env.PORT, host: env.HOST });
  app.log.info(`Portfolio Wars API listening on http://${env.HOST}:${env.PORT}`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error("Fatal API startup error:", err);
  process.exit(1);
});
