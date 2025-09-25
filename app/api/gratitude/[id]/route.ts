import { sql, ensureSchema } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  try {
    // ✅ Ambil ID dari URL tanpa params
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const id = decodeURIComponent(parts[parts.length - 1]);

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    await ensureSchema();

    const username = url.searchParams.get("username")?.trim().toLowerCase();
    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM gratitude WHERE id = ${id}::uuid AND username = ${username};
    `;

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg ?? "Server error" }, { status: 500 });
  }
}
