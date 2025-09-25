import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const parts = pathname.split("/").filter(Boolean); // ["api","admin","users","<user>"]
    const usersIdx = parts.findIndex((p) => p === "users");
    const raw = usersIdx !== -1 ? parts[usersIdx + 1] ?? "" : "";
    const user = decodeURIComponent(raw).trim();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Missing user parameter" }),
        { status: 400 }
      );
    }

    await ensureSchema();
    const norm = user.toLowerCase();
    const result = await sql`DELETE FROM users WHERE lower(username) = ${norm};`;

    if (result.rowCount === 0) {
      return new NextResponse(
        JSON.stringify({ error: "User tidak ditemukan" }),
        { status: 404 }
      );
    }

    // ON DELETE CASCADE pada gratitude akan menghapus catatan user ini
    return new Response(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), {
      status: 500,
    });
  }
}
