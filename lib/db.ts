import { sql } from "@vercel/postgres";

// Fallback: jika hanya ada DATABASE_URL, gunakan sebagai POSTGRES_URL
if (!process.env.POSTGRES_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

// Log bantuan jika env tidak ada
if (!process.env.POSTGRES_URL) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing POSTGRES_URL. Set di .env.local atau link Vercel Postgres. " +
      "Jika hanya punya DATABASE_URL, ini sudah otomatis difallback."
  );
}

// Ensure schema (lazy, sekali per cold start)
let schemaReady: Promise<void> | null = null;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          username TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS gratitude (
          id UUID PRIMARY KEY,
          username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
          text TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      await sql`CREATE INDEX IF NOT EXISTS gratitude_username_idx ON gratitude (username, created_at DESC);`;
    })();
  }
  return schemaReady;
}

export { sql };
