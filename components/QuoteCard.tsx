"use client";
import { useState, useEffect, useCallback } from "react";

const quotes = [
  { text: "Jangan pernah menyerah pada hari buruk.", author: "Anonim" },
  { text: "Setiap hari adalah kesempatan baru.", author: "Anonim" },
  { text: "Kamu lebih kuat dari yang kamu kira.", author: "Anonim" },
  { text: "Bahagia itu sederhana, cukup dengan bersyukur.", author: "Anonim" },
  { text: "Hidupmu berharga, jangan lupakan itu.", author: "Anonim" },
  {
    text: "Kegagalan adalah bagian dari perjalanan menuju sukses.",
    author: "Anonim",
  },
  { text: "Tersenyumlah, itu obat paling sederhana.", author: "Anonim" },
  { text: "Waktu sulit tidak akan berlangsung selamanya.", author: "Anonim" },
  {
    text: "Langkah kecil hari ini lebih baik daripada tidak sama sekali.",
    author: "Anonim",
  },
  {
    text: "Keajaiban terjadi pada mereka yang tidak menyerah.",
    author: "Anonim",
  },
  { text: "Percayalah, badai pasti berlalu.", author: "Anonim" },
  { text: "Kebaikan kecil bisa berdampak besar.", author: "Anonim" },
  { text: "Hari ini adalah hadiah, nikmatilah.", author: "Anonim" },
  {
    text: "Kamu sudah melakukan yang terbaik, jangan lupa apresiasi dirimu.",
    author: "Anonim",
  },
  { text: "Cahaya paling terang datang setelah kegelapan.", author: "Anonim" },
  { text: "Jangan bandingkan prosesmu dengan orang lain.", author: "Anonim" },
  { text: "Senyumanmu bisa mengubah dunia.", author: "Anonim" },
  { text: "Bangkit lagi, selalu ada kesempatan kedua.", author: "Anonim" },
  { text: "Rasa lelahmu hari ini akan jadi cerita esok.", author: "Anonim" },
  { text: "Kamu pantas bahagia.", author: "Anonim" },
];

export default function QuoteBox() {
  const [quote, setQuote] = useState(quotes[0]);
  const [imgUrl, setImgUrl] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const [errorImg, setErrorImg] = useState<string | null>(null);

  const fetchRandomImage = useCallback(async () => {
    setLoadingImg(true);
    setErrorImg(null);
    try {
      // Prioritas: Unsplash API (butuh NEXT_PUBLIC_UNSPLASH_ACCESS_KEY)
      if (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=funny,cute,wholesome&orientation=landscape&content_filter=high&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.urls?.small) {
            setImgUrl(`${data.urls.small}&t=${Date.now()}`);
            setLoadingImg(false);
            return;
          }
        }
      }
      // Fallback bebas API key (selalu random)
      setImgUrl(`https://picsum.photos/600/300?random=${Date.now()}`);
    } catch {
      setErrorImg("Gagal memuat gambar");
      setImgUrl(`https://placekitten.com/600/300?image=${Date.now() % 16}`);
    } finally {
      setLoadingImg(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomImage();
  }, [fetchRandomImage]);

  const getNewQuote = async () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
    fetchRandomImage();
  };

  return (
    <div className="p-3 sm:p-4 rounded-xl shadow-md bg-white flex flex-col justify-between">
      {imgUrl && !loadingImg && (
        <img
          src={imgUrl}
          alt="Random wholesome"
          className="rounded-lg w-full h-40 sm:h-48 object-cover mb-3 sm:mb-4 transition-opacity"
        />
      )}
      {loadingImg && (
        <div className="w-full h-40 sm:h-48 mb-3 sm:mb-4 flex items-center justify-center rounded-lg bg-gray-100 text-xs sm:text-sm text-gray-500">
          Memuat gambar...
        </div>
      )}
      {errorImg && <p className="text-xs text-red-500 mb-2">{errorImg}</p>}
      <p className="italic text-base sm:text-lg text-gray-800">“{quote.text}”</p>
      <p className="mt-2 text-xs sm:text-sm text-gray-600">{quote.author}</p>
      <button
        onClick={getNewQuote}
        disabled={loadingImg}
        className="mt-4 w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loadingImg ? "Memuat..." : "Quote Baru"}
      </button>
    </div>
  );
}
