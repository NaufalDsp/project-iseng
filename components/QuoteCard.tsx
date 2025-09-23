"use client";
import { useEffect, useState } from "react";

type Quote = { content: string; author?: string };

export default function QuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);

  async function fetchQuote() {
    try {
      const res = await fetch("/api/quote");
      const data = await res.json();
      setQuote({ content: data.content, author: data.author });
    } catch {
      setQuote({ content: "Setiap langkah kecil itu berarti.", author: "—" });
    }
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="p-6 rounded-xl border border-gray-100">
      <img
        src="https://source.unsplash.com/300x200/?wholesome,positivity"
        alt="wholesome"
        className="rounded-lg w-full h-48 object-cover mb-4"
      />
      <blockquote className="text-lg italic">“{quote?.content}”</blockquote>
      <div className="text-sm text-gray-500 mt-2">{quote?.author}</div>
      <button
        onClick={fetchQuote}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:scale-105 transition"
      >
        Quote Baru
      </button>
    </div>
  );
}
