import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const parts = pathname.split("/").filter(Boolean); // ["api","notes","<index>"]
    const notesIdx = parts.findIndex((p) => p === "notes");
    const indexStr = notesIdx !== -1 ? parts[notesIdx + 1] ?? "" : "";
    const username =
      url.searchParams.get("username")?.trim().toLowerCase() ?? "";

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const idx = Number(indexStr);
    if (!Number.isFinite(idx) || idx < 0) {
      return NextResponse.json({ error: "Index tidak valid" }, { status: 400 });
    }

    await ensureSchema();

    // Ambil id berdasarkan urutan terbaru (DESC) untuk username tsb pada offset = idx
    const sel = await sql`
      SELECT id
      FROM gratitude
      WHERE lower(username) = ${username}
      ORDER BY created_at DESC
      OFFSET ${idx}
      LIMIT 1;
    `;

    if (sel.rows.length === 0) {
      return NextResponse.json(
        { error: "Index di luar jangkauan" },
        { status: 404 }
      );
    }

    // remove any: type the row explicitly
    const [row] = sel.rows as Array<{ id: string }>;
    const noteId = row.id;

    const del = await sql`DELETE FROM gratitude WHERE id = ${noteId}::uuid;`;
    if (del.rowCount === 0) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg ?? "Server error" }, { status: 500 });
  }
}
