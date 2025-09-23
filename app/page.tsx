"use client";
import { useEffect, useState } from "react";
import QuoteCard from "../components/QuoteCard";
import GratitudeWall from "../components/GratitudeWall";
import NameGate from "../components/NameGate";

export default function Home() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setName(stored);
  }, []);

  if (!name) {
    return <NameGate onSubmit={(n) => setName(n)} />;
  }

  return (
    <main className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg">
      <h1 className="text-3xl font-semibold mb-4">Halooo, {name}! 👋</h1>
      <p className="text-sm text-gray-600 mb-6">
        Semoga harimu menyenangkan 🌈
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <QuoteCard />
        </div>
        <div>
          <GratitudeWall />
        </div>
      </div>
    </main>
  );
}
