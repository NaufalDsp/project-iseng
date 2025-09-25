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
  { text: "Setiap langkah kecil mendekatkanmu pada tujuan.", author: "Anonim" },
  { text: "Istirahat juga bagian dari produktivitas.", author: "Anonim" },
  { text: "Kesalahan bukan akhir, melainkan guru terbaik.", author: "Anonim" },
  { text: "Mulailah dari yang ada, lakukan yang kamu bisa.", author: "Anonim" },
  { text: "Kamu tidak sendirian, selalu ada harapan.", author: "Anonim" },
  { text: "Prosesmu unik, hargai ritmemu sendiri.", author: "Anonim" },
  { text: "Satu hari pada satu waktu.", author: "Anonim" },
  {
    text: "Terima kasih, diriku, sudah bertahan sejauh ini.",
    author: "Anonim",
  },
  {
    text: "Ketenangan datang saat kamu percaya pada dirimu.",
    author: "Anonim",
  },
  { text: "Lakukan dengan hati, hasil akan mengikuti.", author: "Anonim" },
  { text: "Coba lagi, dengan cara yang lebih lembut.", author: "Anonim" },
  {
    text: "Kamu pantas mendapatkan istirahat dan kedamaian.",
    author: "Anonim",
  },
  { text: "Tidak harus besar, yang penting konsisten.", author: "Anonim" },
  { text: "Bersyukur atas kemajuan kecil hari ini.", author: "Anonim" },
  { text: "Keberanian adalah memulai meski takut.", author: "Anonim" },
  { text: "Kebaikan pada diri sendiri adalah kekuatan.", author: "Anonim" },
  { text: "Hari buruk bukan hidup yang buruk.", author: "Anonim" },
  { text: "Kamu tumbuh pelan-pelan, dan itu baik.", author: "Anonim" },
  {
    text: "Fokus pada langkah selanjutnya, bukan seluruh tangga.",
    author: "Anonim",
  },
  { text: "Doa dan usaha adalah pasangan yang baik.", author: "Anonim" },

  // 20 quotes tambahan (lebih panjang / reflektif beberapa)
  {
    text: "Belajar menerima ketidaksempurnaan adalah langkah pertama menuju kebebasan; biarkan diri tumbuh tanpa tekanan yang tidak perlu.",
    author: "Anonim",
  },
  {
    text: "Ada keindahan dalam proses yang lambat: tiap langkah menanamkan pengalaman yang tidak akan kamu dapatkan jika semua berjalan cepat.",
    author: "Anonim",
  },
  {
    text: "Saat merasa kehilangan arah, ingat kembali apa yang membuatmu tersenyum dahulu; terkadang jawaban ada pada hal-hal sederhana itu.",
    author: "Anonim",
  },
  {
    text: "Hargai orang yang menemanimu di saat sunyi, karena kehadiran mereka adalah bukti bahwa kamu tidak benar-benar sendiri.",
    author: "Anonim",
  },
  {
    text: "Jangan takut mengubah rencana, asal tujuan tetap menuntunmu pada versi dirimu yang lebih baik.",
    author: "Anonim",
  },
  {
    text: "Ketika beban terasa berat, bagi cerita itu pada seseorang yang kamu percaya; berbagi tidak membuatmu lemah, malah meringankan langkah.",
    author: "Anonim",
  },
  {
    text: "Sukses bukan tentang siapa paling cepat, melainkan siapa yang tetap bertahan dengan integritas pada setiap langkah.",
    author: "Anonim",
  },
  {
    text: "Belajar berkata tidak adalah bentuk cinta pada diri sendiri; batas yang sehat membuka ruang untuk kebahagiaan yang lebih tulus.",
    author: "Anonim",
  },
  {
    text: "Biarkan dirimu berduka ketika perlu, tapi jangan lupa bangkit lagi — kesembuhan seringkali dimulai dengan satu napas panjang.",
    author: "Anonim",
  },
  {
    text: "Kadang yang paling sulit adalah memulai lagi setelah retak; beri waktu pada proses penyambungan, perlahan namun pasti.",
    author: "Anonim",
  },
  {
    text: "Bukan beban yang menentukan siapa kamu, melainkan bagaimana kamu memikulnya sambil tetap menjaga hati.",
    author: "Anonim",
  },
  {
    text: "Mimpi besar butuh ketekunan, tetapi langkah kecil yang konsistenlah yang akhirnya membentuk cerita besar itu.",
    author: "Anonim",
  },
  {
    text: "Jangan menunda kebahagiaan dengan alasan 'nanti'; hidup berlangsung sekarang, dan momen sederhana pantas dinikmati.",
    author: "Anonim",
  },
  {
    text: "Saat kau memberi maaf, kau membebaskan diri sendiri dari beban yang tak terlihat; maaf itu hadiah untuk hatimu.",
    author: "Anonim",
  },
  {
    text: "Tulislah surat untuk masa depanmu sendiri: ingatkan tentang kekuatan yang telah kau tunjukkan hari-hari sulit itu.",
    author: "Anonim",
  },
  {
    text: "Perubahan besar seringkali berawal dari keputusan kecil yang diambil berulang kali; jangan remehkan kebiasaan baik.",
    author: "Anonim",
  },
  {
    text: "Jika saat ini kau belum menemukan tempat yang sesuai, ingatkan diri bahwa perjalanan menemukan 'rumah' kadang memerlukan waktu dan keberanian.",
    author: "Anonim",
  },
  {
    text: "Kritik bisa menjadi cermin — pilihlah cermin yang jujur dan melatihmu, bukan yang mematahkan semangat.",
    author: "Anonim",
  },
  {
    text: "Kebahagiaan tidak selalu gemerlap; seringkali ia hadir dalam secangkir teh hangat, obrolan singkat, atau tidur yang nyenyak.",
    author: "Anonim",
  },
  {
    text: "Bertumbuh berarti kadang meninggalkan kebiasaan lama yang nyaman tetapi menghambat; itu wajar dan bagian dari proses menjadi lebih utuh.",
    author: "Anonim",
  },
  // Tambahan 10 kutipan bermakna
  {
    text: "Kesunyian adalah sahabat yang setia, ia mengajarkan kita untuk mendengar suara hati.",
    author: "Anonim",
  },
  {
    text: "Kebahagiaan sejati datang dari dalam diri, bukan dari apa yang kita miliki.",
    author: "Anonim",
  },
  {
    text: "Ketika satu pintu tertutup, pintu lain akan terbuka. Tetaplah berharap.",
    author: "Anonim",
  },
  {
    text: "Jangan takut untuk bermimpi besar, karena mimpi adalah awal dari segala pencapaian.",
    author: "Anonim",
  },
  {
    text: "Hidup adalah perjalanan panjang, nikmati setiap langkahnya.",
    author: "Anonim",
  },
  {
    text: "Kegagalan adalah kesempatan untuk memulai lagi dengan lebih bijaksana.",
    author: "Anonim",
  },
  {
    text: "Cinta adalah kekuatan terbesar yang bisa mengubah dunia.",
    author: "Anonim",
  },
  {
    text: "Jangan pernah meremehkan kekuatan dari sebuah senyuman.",
    author: "Anonim",
  },
  {
    text: "Setiap hari adalah kesempatan untuk menjadi lebih baik dari hari sebelumnya.",
    author: "Anonim",
  },
  {
    text: "Kebahagiaan adalah pilihan, pilihlah untuk bahagia setiap hari.",
    author: "Anonim",
  },
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
      <p className="italic text-base sm:text-lg text-gray-800">
        “{quote.text}”
      </p>
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
