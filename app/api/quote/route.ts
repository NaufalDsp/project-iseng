import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.quotable.io/random", {
      next: { revalidate: 60 * 30 },
    });
    if (!res.ok) throw new Error("External API failed");
    const data = await res.json();
    return NextResponse.json({ content: data.content, author: data.author });
  } catch {
    // fallback
    return NextResponse.json({
      content: "Jangan pernah menyerah pada hari buruk.",
      author: "Anonim",
    });
  }
}
