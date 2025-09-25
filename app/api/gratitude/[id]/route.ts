export const runtime = "nodejs";
import { sql, ensureSchema } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await ensureSchema(); // perbaikan: panggil sebagai fungsi
  const url = new URL(req.url);
  const u = url.searchParams.get("username")?.trim().toLowerCase();
  const id = params.id;
  if (!u || !id) return new Response("Bad Request", { status: 400 });

  const result = await sql`
    DELETE FROM gratitude WHERE id = ${id}::uuid AND username = ${u};
  `;
  if (result.rowCount === 0) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(null, { status: 204 });
}
