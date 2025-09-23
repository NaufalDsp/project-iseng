import "./globals.css";
export const metadata = { title: "Mood Booster" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">{children}</div>
      </body>
    </html>
  );
}
