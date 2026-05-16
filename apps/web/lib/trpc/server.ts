/**
 * Server-side tRPC caller used by Next.js server components.
 *
 * Talks to the external API service (Railway) over HTTP — the same surface the
 * browser uses. This keeps server components on Cloudflare Pages working
 * without needing the data layer bundled into the edge runtime.
 */

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@pw/shared";

function getApiUrl() {
  // On the server, prefer an explicit internal URL if one is set,
  // otherwise fall back to the public URL.
  const internal = process.env.API_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;
  return (internal || publicUrl || "http://localhost:3001").replace(/\/$/, "");
}

export const serverTrpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getApiUrl()}/trpc`,
      transformer: superjson,
      // Server components run during SSR; ensure we never use a stale cached fetch.
      fetch(input, init) {
        return fetch(input, { ...init, cache: "no-store" });
      }
    })
  ]
});
