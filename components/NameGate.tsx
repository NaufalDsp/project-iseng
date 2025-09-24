"use client";
import { useState } from "react";

export default function NameGate({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const trimmed = name.trim();

    // coba buat user di server supaya admin bisa melihatnya
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: trimmed }),
      });
    } catch (err) {
      // tidak menghalangi UX, hanya log untuk debugging
      // eslint-disable-next-line no-console
      console.warn("Gagal membuat user di server:", err);
    }

    localStorage.setItem("username", trimmed);
    onSubmit(trimmed);
  }

  return (
    // parent centering container: cukup tinggi untuk memusatkan tanpa memenuhi layar
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] px-4">
      {/* gradient box dibuat lebih besar (lebih lebar dan berpadding) */}
      <div
        className="w-full max-w-2xl py-16 px-8 my-6
          bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200
          rounded-3xl overflow-hidden shadow-sm"
      >
        {/* wrapper agar form tetap kecil dan terpusat di dalam gradient besar */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-4 w-full max-w-sm"
          >
            <h1 className="text-2xl font-semibold">Masukkan Namamu</h1>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama panggilanmu"
              className="border px-4 py-2 rounded-lg w-full"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:scale-105 transition"
            >
              Mulai 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
