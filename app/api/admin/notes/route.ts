import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureSchema();
    const { rows } =
      await sql`SELECT username, text FROM gratitude ORDER BY created_at DESC;`;

    const map: Record<string, string[]> = {};
    for (const r of rows as { username: string; text: string }[]) {
      (map[r.username] ||= []).push(r.text);
    }
    return NextResponse.json(map);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), {
      status: 500,
    });
  }
}
