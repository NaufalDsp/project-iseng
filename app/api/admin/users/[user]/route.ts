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

// DELETE /api/admin/users/[user]
export async function DELETE(
  _request: Request,
  { params }: { params: { user: string } }
) {
  try {
    const user = decodeURIComponent(params.user || "");
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Missing user parameter" }), { status: 400 });
    }

    const map = await readAll();
    if (!Object.prototype.hasOwnProperty.call(map, user)) {
      return new NextResponse(JSON.stringify({ error: "User tidak ditemukan" }), { status: 404 });
    }

    delete map[user];
    await writeAll(map);

    return NextResponse.json({ success: true, user });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), { status: 500 });
  }
}
