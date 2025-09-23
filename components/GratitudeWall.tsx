"use client";
import { useEffect, useState } from "react";

export default function GratitudeWall() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("gratitudes");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("gratitudes", JSON.stringify(items));
  }, [items]);

  function addItem() {
    if (!text.trim()) return;
    setItems((prev) => [text.trim(), ...prev]);
    setText("");
    // optional: confetti()
  }

  function exportTxt() {
    const blob = new Blob([items.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gratitude.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4 sm:p-6 rounded-xl border border-gray-100">
      <h2 className="text-lg sm:text-xl font-medium mb-2">Gratitude Wall</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4">
        Tulis satu hal kecil yang bikin kamu tersenyum hari ini.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: Kopi pagi enak ☕"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg w-full sm:w-auto"
        >
          Tambahkan
        </button>
      </div>

      <div className="mt-4 space-y-2 max-h-56 sm:max-h-48 overflow-auto">
        {items.length === 0 ? (
          <div className="text-sm text-gray-400">
            Belum ada catatan — ayo mulai!
          </div>
        ) : (
          items.map((it, idx) => (
            <div
              key={idx}
              className="p-2 rounded-md bg-gray-50 flex justify-between items-center"
            >
              <div className="text-sm">{it}</div>
              <button
                onClick={() =>
                  setItems((prev) => prev.filter((_, i) => i !== idx))
                }
                className="text-xs text-red-500"
              >
                hapus
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={exportTxt}
          className="px-3 py-2 border rounded-lg w-full sm:w-auto"
        >
          Export (.txt)
        </button>
        <button
          onClick={() => {
            if (confirm("Hapus semua catatan?")) {
              setItems([]);
              localStorage.removeItem("gratitudes");
            }
          }}
          className="px-3 py-2 border rounded-lg text-red-600 w-full sm:w-auto"
        >
          Hapus Semua
        </button>
      </div>
    </div>
  );
}
