"use client";
import { useState } from "react";

export default function NameGate({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("username", name.trim());
    onSubmit(name.trim());
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-4"
      >
        <h1 className="text-2xl font-semibold">Masukkan Namamu</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama panggilanmu"
          className="border px-4 py-2 rounded-lg w-64"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:scale-105 transition"
        >
          Mulai 🚀
        </button>
      </form>
    </div>
  );
}
