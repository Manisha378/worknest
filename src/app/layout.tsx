import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkNest - Your productivity workspace",
  description: "Organize your projects, tasks, and notes in one clean workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}