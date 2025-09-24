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

// POST /api/users  { user }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = (body?.user ?? "").toString().trim();
    if (!user) return new NextResponse(JSON.stringify({ error: "Missing user in body" }), { status: 400 });

    const map = await readAll();
    if (!Array.isArray(map[user])) {
      map[user] = [];
      await writeAll(map);
    }
    return NextResponse.json({ success: true, user });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), { status: 500 });
  }
}
