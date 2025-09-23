"use client";
import { useEffect, useState } from "react";
import QuoteCard from "../components/QuoteCard";
import GratitudeWall from "../components/GratitudeWall";
import NameGate from "../components/NameGate";

export default function Home() {
  const [name, setName] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setName(stored);
  }, []);

  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  const handleLogout = () => {
    // pastikan modal ditutup
    setShowConfirm(false);
    localStorage.removeItem("username");
    setName(null);
  };

  const handleNameSubmit = (n: string) => {
    // jaga-jaga kalau state modal masih true
    setShowConfirm(false);
    setName(n);
  };

  if (!name) {
    return <NameGate onSubmit={handleNameSubmit} />; // gunakan handler baru
  }

  return (
    <div className="max-w-4xl mx-auto my-6 sm:my-10">
      <main className="relative bg-white/70 backdrop-blur rounded-none sm:rounded-2xl p-4 sm:p-8">
        {/* Tombol Keluar */}
        <button
          onClick={() => setShowConfirm(true)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xs sm:text-sm rounded-md px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-medium shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          aria-haspopup="dialog"
          aria-expanded={showConfirm}
        >
          Keluar
        </button>
        <h1 className="text-lg sm:text-3xl font-semibold mb-2 sm:mb-4">
          Halooo, {name}! 👋
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          Semoga harimu menyenangkan 🌈
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          <div>
            <QuoteCard />
          </div>
          <div>
            <GratitudeWall username={name} />
          </div>
        </div>
        {/* Modal Konfirmasi */}
        {showConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white w-full max-w-sm rounded-xl p-5 shadow-lg animate-fade-in">
              <p className="text-sm sm:text-base font-medium mb-4">
                yakin nih mau keluar? :(
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-xs sm:text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  engga maw
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs sm:text-sm rounded-md bg-red-500 text-white hover:bg-red-600 font-medium"
                >
                  yakin nich
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
