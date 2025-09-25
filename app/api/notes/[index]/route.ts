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
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as NotesMap;
    }
  } catch {
    // file mungkin belum ada
  }
  return {};
}

async function writeAll(map: NotesMap) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(map, null, 2), "utf-8");
}

// DELETE /api/notes/[index]?user=...
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);

    // ambil query param ?user=...
    const user = url.searchParams.get("user");
    if (!user) {
      return NextResponse.json({ error: "Missing user parameter" }, { status: 400 });
    }

    // ambil [index] langsung dari pathname
    const parts = url.pathname.split("/");
    const indexStr = parts[parts.length - 1];
    const idx = Number(indexStr);

    if (!Number.isFinite(idx) || idx < 0) {
      return NextResponse.json({ error: "Index invalid" }, { status: 400 });
    }

    const map = await readAll();
    const notes = map[user] ?? [];

    if (idx >= notes.length) {
      return NextResponse.json({ error: "Index di luar jangkauan" }, { status: 404 });
    }

    // hapus note sesuai index
    notes.splice(idx, 1);
    map[user] = notes;
    await writeAll(map);

    return NextResponse.json({ success: true, index: idx });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg ?? "Server error" }, { status: 500 });
  }
}
