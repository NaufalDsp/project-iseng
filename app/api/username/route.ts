export const runtime = "nodejs";
import { sql, ensureSchema } from "@/lib/db";

export async function POST(req: Request) {
  try {
    if (!process.env.POSTGRES_URL) {
      return Response.json(
        { error: "Server DB not configured (POSTGRES_URL missing)" },
        { status: 500 }
      );
    }
    await ensureSchema(); // perbaikan: panggil sebagai fungsi

    const { username } = await req.json();
    if (!username || typeof username !== "string") {
      return Response.json({ error: "Bad Request" }, { status: 400 });
    }
    const key = username.trim().toLowerCase();
    if (!key) return Response.json({ error: "Bad Request" }, { status: 400 });

    const result = await sql`
      INSERT INTO users (username) VALUES (${key})
      ON CONFLICT (username) DO NOTHING;
    `;
    if (result.rowCount === 0) {
      return Response.json({ error: "Username sudah dipakai" }, { status: 409 });
    }
    return Response.json({ ok: true });
  } catch (e: unknown) {
    console.error("POST /api/username failed:", e);
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ error: msg || "Internal Server Error" }, { status: 500 });
  }
}
