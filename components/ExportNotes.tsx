"use client";
export default function ExportNotes({
  notes,
  name,
}: {
  notes: string[];
  name: string;
}) {
  const handleExport = () => {
    const header = `✨ Catatan Semangat untuk ${name} ✨\n\n`;
    const greeting = `Halo ${name}!\nSemoga hari-harimu penuh warna, tawa, dan semangat baru 🌈💜\n\n`;
    const divider = "------------------------------\n\n";
    const body = notes.map((note, idx) => `⭐ ${note}`).join("\n");
    const footer = `\n\n------------------------------\nTetaplah percaya diri, ${name}! Kamu luar biasa 🚀\n`;

    const content = header + greeting + divider + body + footer;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catatan_${name}.txt`;
    a.click();
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-500 text-white px-3 py-2 rounded w-full sm:w-auto text-sm sm:text-base"
    >
      Export Catatan 🎁
    </button>
  );
}
