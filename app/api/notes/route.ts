import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");

type NotesMap = Record<string, string[]>;

async function readAll(): Promise<NotesMap> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as NotesMap;
  } catch {
    // file mungkin belum ada
  }
  return {};
}

async function writeAll(map: NotesMap) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(map, null, 2), "utf-8");
}

// GET /api/notes?user=...
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user = url.searchParams.get("user");
    if (!user) return new NextResponse(JSON.stringify({ error: "Missing user parameter" }), { status: 400 });

    const map = await readAll();
    const notes = map[user] ?? [];
    return NextResponse.json(notes);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), { status: 500 });
  }
}

// POST { user, content }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = (body?.content ?? "").toString().trim();
    const user = (body?.user ?? "").toString().trim();
    if (!user) return new NextResponse(JSON.stringify({ error: "Missing user in body" }), { status: 400 });
    if (!content) return new NextResponse(JSON.stringify({ error: "Content kosong" }), { status: 400 });

    const map = await readAll();
    if (!Array.isArray(map[user])) map[user] = [];
    map[user].push(content);
    await writeAll(map);

    return new NextResponse(JSON.stringify({ note: content }), { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), { status: 500 });
  }
}

// DELETE all for user: /api/notes?user=...
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const user = url.searchParams.get("user");
    if (!user) return new NextResponse(JSON.stringify({ error: "Missing user parameter" }), { status: 400 });

    const map = await readAll();
    map[user] = [];
    await writeAll(map);

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), { status: 500 });
  }
}
