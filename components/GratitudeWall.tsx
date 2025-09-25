"use client";
import { useState, useEffect } from "react";
import ExportNotes from "./ExportNotes";

type Item = { id: string; text: string; createdAt: number };

export default function GratitudeWall({
  username,
}: {
  username?: string | null;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uname = username?.trim().toLowerCase() ?? "";

  useEffect(() => {
    if (!uname) return;
    let ignore = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/gratitude?username=${encodeURIComponent(uname)}`
        );
        if (!res.ok) throw new Error("Gagal memuat catatan");
        const data: Item[] = await res.json();
        if (!ignore) setItems(data);
      } catch (e: unknown) {
        if (!ignore) {
          const msg = e instanceof Error ? e.message : String(e);
          setError(msg);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [uname]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || !uname) return;
    setError(null);
    try {
      const res = await fetch("/api/gratitude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname, text: t }),
      });
      if (!res.ok) throw new Error("Gagal menambah catatan");
      const item: Item = await res.json();
      setItems((prev) => [item, ...prev]);
      setText("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  };

  const clearNotes = async () => {
    if (!uname) return;
    setError(null);
    try {
      const res = await fetch(
        `/api/gratitude?username=${encodeURIComponent(uname)}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) {
        const txt = await res.text();
        throw new Error(txt || "Gagal menghapus catatan");
      }
      setItems([]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan saat menghapus");
    }
  };

  // Hapus satu note berdasarkan id
  const deleteNote = async (id: string) => {
    if (!uname) return;
    setError(null);
    try {
      const res = await fetch(
        `/api/gratitude/${encodeURIComponent(id)}?username=${encodeURIComponent(
          uname
        )}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) {
        const body = await res.text();
        throw new Error(body || "Gagal menghapus catatan");
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan saat menghapus");
    }
  };

  return (
    <div className="p-3 sm:p-4 rounded-xl shadow-md bg-white flex flex-col justify-between">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">
        Gratitude Wall 💜
      </h2>
      <p className="text-gray-600 text-xs font-semibold sm:text-sm mb-4">
        Tulis satu hal kecil yang bikin kamu tersenyum hari ini.
      </p>

      <form
        onSubmit={submit}
        className="flex flex-col sm:flex-row gap-2 mb-4 w-full"
      >
        <input
          type="text"
          placeholder="Contoh: Ngopi pagi wenak banget ☕"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded text-sm sm:text-base w-full"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-3 py-2 rounded w-full sm:w-auto text-sm sm:text-base"
        >
          Tambahkan
        </button>
      </form>

      {loading && (
        <p className="text-gray-500 text-sm mb-4">Memuat catatan...</p>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {items.length > 0 ? (
        <ul className="mb-4 space-y-1 max-h-48 overflow-y-auto pr-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between text-gray-800 text-sm sm:text-base"
            >
              <span className="mr-2">⭐ {item.text}</span>
              <button
                onClick={() => deleteNote(item.id)}
                className="ml-2 text-xs text-red-600 hover:opacity-80 px-2 py-1 rounded"
                aria-label={`Hapus catatan ${item.id}`}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <p className="text-gray-400 italic mb-4 text-sm">
            Belum ada catatan — ayo mulai!
          </p>
        )
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <ExportNotes
          notes={items.map((item) => item.text)}
          name={username ?? ""}
        />
        <button
          onClick={clearNotes}
          className="bg-red-500 text-white px-3 py-2 rounded w-full sm:w-auto text-sm sm:text-base"
        >
          Hapus Semua 🗑️
        </button>
      </div>
    </div>
  );
}
