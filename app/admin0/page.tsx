"use client";
import { useEffect, useState } from "react";

type NotesMap = Record<string, string[]>;

export default function AdminPage() {
  const [data, setData] = useState<NotesMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notes", { cache: "no-store" });
      if (!res.ok) throw new Error(`Gagal memuat: ${res.status}`);
      const json: NotesMap = await res.json();
      setData(json);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const refresh = () => fetchAll();

  const deleteNote = async (user: string, idx: number) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/notes/${idx}?user=${encodeURIComponent(user)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Gagal menghapus note`);
      }
      await fetchAll();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan saat menghapus note");
    } finally {
      setBusy(false);
    }
  };

  const clearUser = async (user: string) => {
    if (!confirm(`Hapus semua note untuk "${user}"?`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes?user=${encodeURIComponent(user)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Gagal menghapus semua note`);
      }
      await fetchAll();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan saat menghapus semua note");
    } finally {
      setBusy(false);
    }
  };

  const deleteUser = async (user: string) => {
    if (
      !confirm(
        `Yakin ingin menghapus user "${user}" beserta semua catatannya? Tindakan ini tidak dapat dikembalikan.`
      )
    )
      return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Gagal menghapus user`);
      }
      await fetchAll();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? "Terjadi kesalahan saat menghapus user");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={refresh} className="px-3 py-1 bg-gray-200 rounded">
            Refresh
          </button>
          <button
            onClick={() => {
              if (confirm("Reload server?")) location.reload();
            }}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Reload
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Memuat data...</p>}
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <div className="space-y-4">
        {Object.keys(data).length === 0 && !loading ? (
          <p className="text-sm text-gray-500">Belum ada user atau catatan.</p>
        ) : (
          Object.entries(data).map(([user, notes]) => (
            <div key={user} className="border rounded p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{user}</div>
                  <div className="text-xs text-gray-500">
                    {notes.length} note(s)
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => clearUser(user)}
                    disabled={busy}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded disabled:opacity-60"
                  >
                    Hapus Notes
                  </button>
                  <button
                    onClick={() => deleteUser(user)}
                    disabled={busy}
                    className="px-2 py-1 text-sm bg-red-700 text-white rounded disabled:opacity-60"
                  >
                    Hapus User
                  </button>
                </div>
              </div>

              <ul className="space-y-2">
                {notes.length === 0 && (
                  <li className="text-xs text-gray-400">Tidak ada catatan.</li>
                )}
                {notes.map((note, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="text-sm flex-1">
                      <span className="mr-2 text-yellow-500">⭐</span>
                      <span>{note}</span>
                    </div>
                    <div>
                      <button
                        onClick={() => deleteNote(user, idx)}
                        disabled={busy}
                        className="px-2 py-1 text-sm text-red-600 rounded hover:bg-red-50 disabled:opacity-60"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
