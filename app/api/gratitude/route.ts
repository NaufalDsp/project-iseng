export const runtime = "nodejs";
import { sql, ensureSchema } from "@/lib/db";

type Item = { id: string; text: string; createdAt: number };

export async function GET(req: Request) {
  await ensureSchema(); // perbaikan: panggil sebagai fungsi
  const url = new URL(req.url);
  const u = url.searchParams.get("username")?.trim().toLowerCase();
  if (!u) return new Response("Bad Request", { status: 400 });

  const { rows } = await sql<{
    id: string;
    text: string;
    created_at: string;
  }>`
    SELECT id::text, text, EXTRACT(EPOCH FROM created_at) * 1000 AS created_at
    FROM gratitude
    WHERE username = ${u}
    ORDER BY created_at DESC;
  `;

  const items: Item[] = rows.map((r) => ({
    id: r.id,
    text: r.text,
    createdAt: Number(r.created_at),
  }));

  return Response.json(items);
}

export async function POST(req: Request) {
  await ensureSchema(); // perbaikan: panggil sebagai fungsi
  try {
    const { username, text } = await req.json();
    const u = username?.trim().toLowerCase();
    if (!u || typeof text !== "string" || !text.trim()) {
      return new Response("Bad Request", { status: 400 });
    }

    const id = crypto.randomUUID();
    const t = text.trim();

    await sql`
      INSERT INTO gratitude (id, username, text)
      VALUES (${id}::uuid, ${u}, ${t});
    `;

    const { rows } = await sql<{ created_at: string }>`
      SELECT EXTRACT(EPOCH FROM created_at) * 1000 AS created_at
      FROM gratitude WHERE id = ${id}::uuid;
    `;

    const item: Item = {
      id,
      text: t,
      createdAt: Number(rows?.[0]?.created_at ?? Date.now()),
    };

    return Response.json(item, { status: 201 });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await ensureSchema(); // perbaikan: panggil sebagai fungsi
  const url = new URL(req.url);
  const u = url.searchParams.get("username")?.trim().toLowerCase();
  if (!u) return new Response("Bad Request", { status: 400 });

  await sql`DELETE FROM gratitude WHERE username = ${u};`;
  return new Response(null, { status: 204 });
}
