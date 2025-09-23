"use client";
import { useState } from "react";
import ExportNotes from "./ExportNotes";

export default function GratitudeWall({ username }: { username: string }) {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addNote = () => {
    if (input.trim() === "") return;
    setNotes([...notes, input]);
    setInput("");
  };

  const clearNotes = () => {
    setNotes([]);
  };

  return (
    <div className="p-3 sm:p-4 rounded-xl shadow-md bg-white flex flex-col justify-between">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Gratitude Wall 💜</h2>
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

      {notes.length > 0 ? (
        <ul className="mb-4 space-y-1 max-h-48 overflow-y-auto pr-1">
          {notes.map((note, idx) => (
            <li key={idx} className="text-gray-800 text-sm sm:text-base">
              ⭐ {note}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic mb-4 text-sm">
          Belum ada catatan — ayo mulai!
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <ExportNotes notes={notes} name={username} />
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
