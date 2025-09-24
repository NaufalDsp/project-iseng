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

export async function GET() {
  try {
    const map = await readAll();
    return NextResponse.json(map);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new NextResponse(JSON.stringify({ error: msg ?? "Server error" }), { status: 500 });
  }
}
