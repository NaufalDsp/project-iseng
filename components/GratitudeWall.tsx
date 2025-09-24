"use client";
import { useState, useEffect } from "react";
import ExportNotes from "./ExportNotes";

export default function GratitudeWall({
  username,
}: {
  username?: string | null;
}) {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchNotes = async () => {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/notes?user=${encodeURIComponent(username)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Gagal memuat catatan");
        const data: string[] = await res.json();
        if (mounted) setNotes(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg ?? "Terjadi kesalahan");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNotes();
    return () => {
      mounted = false;
    };
  }, [username]);

  const addNote = async () => {
    if (input.trim() === "" || !username) return;
    setError(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim(), user: username }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Gagal menyimpan catatan");
      }
      const json = await res.json();
      const savedNote = json?.note ?? input.trim();
      setNotes((s) => [...s, savedNote]);
      setInput("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan saat menyimpan");
    }
  };

  const clearNotes = async () => {
    if (!username) return;
    setError(null);
    try {
      const res = await fetch(
        `/api/notes?user=${encodeURIComponent(username)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Gagal menghapus catatan");
      }
      setNotes([]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan saat menghapus");
    }
  };

  // Hapus satu note berdasarkan index
  const deleteNote = async (index: number) => {
    if (!username) return;
    setError(null);
    try {
      const res = await fetch(
        `/api/notes/${index}?user=${encodeURIComponent(username)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        // coba ambil pesan error dari body kalau ada
        const body = await res.text();
        throw new Error(body || "Gagal menghapus catatan");
      }
      // update state lokal (atau gunakan notes yang dikembalikan oleh API jika ingin)
      setNotes((prev) => prev.filter((_, i) => i !== index));
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
      <p className="text-gray-600 text-xs sm:text-sm mb-4">
        Tulis satu hal kecil yang bikin kamu tersenyum hari ini.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
        <input
          type="text"
          placeholder="Contoh: Kopi pagi enak ☕"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded text-sm sm:text-base w-full"
        />
        <button
          onClick={addNote}
          className="bg-purple-500 text-white px-3 py-2 rounded w-full sm:w-auto text-sm sm:text-base"
        >
          Tambahkan
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 text-sm mb-4">Memuat catatan...</p>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {notes.length > 0 ? (
        <ul className="mb-4 space-y-1 max-h-48 overflow-y-auto pr-1">
          {notes.map((note, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between text-gray-800 text-sm sm:text-base"
            >
              <span className="mr-2">⭐ {note}</span>
              <button
                onClick={() => deleteNote(idx)}
                className="ml-2 text-xs text-red-600 hover:opacity-80 px-2 py-1 rounded"
                aria-label={`Hapus catatan ${idx + 1}`}
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
        <ExportNotes notes={notes} name={username ?? ""} />
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
