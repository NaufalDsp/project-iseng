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

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const userParam = (url.searchParams.get("username") ?? url.searchParams.get("user") ?? "").trim().toLowerCase();
    if (!userParam) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    await ensureSchema();
    await sql`DELETE FROM gratitude WHERE lower(username) = ${userParam};`;

    // 204: sukses tanpa body
    return new Response(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), {
      status: 500,
    });
  }
}
