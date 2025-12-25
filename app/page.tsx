"use client";
import {
  useEffect,
  useState,
} from "react";
import NameGate from "../components/NameGate";
import GratitudeWall from "../components/GratitudeWall";
import BlossomBackground from "../components/BlossomBackground";
import QuoteCard from "../components/QuoteCard";

export default function HomePage() {
  const [
    username,
    setUsername,
  ] = useState<
    string | null
  >(null);
  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  useEffect(() => {
    const u =
      localStorage.getItem(
        "username"
      );
    if (u)
      setUsername(u);
  }, []);

  useEffect(() => {
    if (!showConfirm)
      return;
    const onKey = (
      e: KeyboardEvent
    ) => {
      if (
        e.key ===
        "Escape"
      )
        setShowConfirm(
          false
        );
    };
    window.addEventListener(
      "keydown",
      onKey
    );
    return () =>
      window.removeEventListener(
        "keydown",
        onKey
      );
  }, [showConfirm]);

  const handleLogout =
    () => {
      setShowConfirm(
        false
      );
      localStorage.removeItem(
        "username"
      );
      setUsername(null);
    };

  // simpan ke localStorage saat submit dari NameGate
  const handleNameSubmit =
    async (
      name: string
    ) => {
      const usernameKey =
        name.trim();
      if (!usernameKey)
        return;

      try {
        const res =
          await fetch(
            "/api/username",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                {
                  username:
                    usernameKey,
                }
              ),
            }
          );

        // Treat 409 (username already exists) as success to allow re-login
        if (
          !res.ok &&
          res.status !==
            409
        ) {
          let detail =
            "";
          try {
            const data =
              await res.json();
            detail =
              data?.error
                ? `: ${data.error}`
                : "";
          } catch {
            // ignore parse error
          }
          alert(
            `Gagal menyimpan username. Coba lagi${
              detail
                ? ` (${detail})`
                : "."
            }`
          );
          return;
        }
      } catch (e: unknown) {
        const msg =
          e instanceof
          Error
            ? e.message
            : String(e);
        alert(
          `Gagal menyimpan username. Cek koneksi atau server (${msg}).`
        );
        return;
      }

      localStorage.setItem(
        "username",
        usernameKey
      );
      setShowConfirm(
        false
      );
      setUsername(
        usernameKey
      );
    };

  return (
    <>
      <BlossomBackground
        enabled={
          !!username
        }
      />

      {/* jika belum login, tampilkan NameGate */}
      {!username ? (
        <div className="max-w-4xl mx-auto my-6 sm:my-10">
          <NameGate
            onSubmit={
              handleNameSubmit
            }
          />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto my-6 sm:my-10">
          <main className="relative bg-white/70 backdrop-blur rounded-none sm:rounded-2xl p-4 sm:p-8">
            <button
              onClick={() =>
                setShowConfirm(
                  true
                )
              }
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xs sm:text-sm rounded-md px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-medium shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              aria-haspopup="dialog"
              aria-expanded={
                showConfirm
              }>
              Keluar
            </button>
            <h1 className="text-lg sm:text-3xl font-bold mb-2 sm:mb-4">
              Halooo,{" "}
              {username}!
              👋
            </h1>
            <p className="text-xs sm:text-xl font-semibold text-gray-600 mb-4 sm:mb-6">
              Semoga
              harimu
              menyenangkan,
              Semangat!
              ✨
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <QuoteCard />
              </div>
              <div>
                {/* GratitudeWall will load/save via API using this username */}
                <GratitudeWall
                  username={
                    username
                  }
                />
              </div>
            </div>
            {showConfirm && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                role="dialog"
                aria-modal="true">
                <div className="bg-white w-full max-w-sm rounded-xl p-5 shadow-lg animate-fade-in">
                  <p className="text-sm sm:text-base font-medium mb-4">
                    yakin
                    nih
                    mau
                    keluar?
                    :(
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() =>
                        setShowConfirm(
                          false
                        )
                      }
                      className="px-4 py-2 text-xs sm:text-sm rounded-md border border-gray-300 hover:bg-gray-100">
                      engga
                      maw
                    </button>
                    <button
                      onClick={
                        handleLogout
                      }
                      className="px-4 py-2 text-xs sm:text-sm rounded-md bg-red-500 text-white hover:bg-red-600 font-medium">
                      yakin
                      nich
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}
