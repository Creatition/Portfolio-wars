/**
 * tRPC router — the type-safe API surface.
 *
 * In production this becomes the boundary into the real services described in
 * Portfolio_Wars_Architecture_Plan.docx §6 (System Architecture). For the MVP
 * we wire each procedure to the mock data layer.
 */

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import superjson from "superjson";

import {
  ALIASES,
  COMPETITIONS,
  PLS_USD,
  getActiveCompetitionsByPeriod,
  getAlias,
  getCompetition,
  getLeaderboard,
  getSiteStats
} from "./mock";

const t = initTRPC.create({ transformer: superjson });

export const appRouter = t.router({
  // ----- Site-wide -----
  health: t.procedure.query(() => ({ ok: true, ts: new Date().toISOString() })),

  siteStats: t.procedure.query(() => getSiteStats()),

  // ----- Competitions -----
  listCompetitions: t.procedure
    .input(z.object({ period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).optional() }).optional())
    .query(({ input }) => {
      if (input?.period) return getActiveCompetitionsByPeriod(input.period);
      return COMPETITIONS;
    }),

  getCompetition: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => getCompetition(input.id)),

  // ----- Leaderboard -----
  getLeaderboard: t.procedure
    .input(z.object({ competitionId: z.string() }))
    .query(({ input }) => getLeaderboard(input.competitionId)),

  // ----- Aliases -----
  listAliases: t.procedure.query(() =>
    ALIASES.map(a => ({ ...a, primaryWallet: a.walletVisible ? a.primaryWallet : "0x••••…••••" }))
  ),

  getAlias: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => getAlias(input.name)),

  // ----- Price feed -----
  plsUsd: t.procedure.query(() => ({ usd: PLS_USD, asOf: new Date().toISOString(), source: "mock" }))
});

export type AppRouter = typeof appRouter;
