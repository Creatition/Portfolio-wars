/** Environment variable handling for the API service. */

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export const env = {
  /** HTTP port. Railway sets this automatically. */
  PORT: Number(process.env.PORT ?? 3001),

  /** Bind host. 0.0.0.0 inside Railway, 127.0.0.1 for local dev. */
  HOST: process.env.HOST ?? "0.0.0.0",

  /**
   * Comma-separated list of allowed CORS origins.
   * In production, set this to your Cloudflare Pages URL,
   *   e.g. "https://portfolio-wars.pages.dev,https://portfoliowars.com"
   * In dev, defaults to localhost.
   */
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean),

  NODE_ENV: process.env.NODE_ENV ?? "development"
};
