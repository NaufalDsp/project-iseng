import { sql, ensureSchema } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// DELETE /api/gratitude/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = decodeURIComponent(params.id);
    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    await ensureSchema();

    const url = new URL(req.url);
    const u = url.searchParams.get("username")?.trim().toLowerCase();
    if (!u) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM gratitude WHERE id = ${id}::uuid AND username = ${u};
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
