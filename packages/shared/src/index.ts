/**
 * @pw/shared — single source of truth for Portfolio Wars types, tRPC router,
 * and (for the MVP) mock data. Consumed by both apps/web and apps/api.
 */
export * from "./types";
export * from "./mock";
export { appRouter } from "./router";
export type { AppRouter } from "./router";
