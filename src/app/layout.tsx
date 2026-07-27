import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horse Racing Bet Calculator",
  description: "Internal business tool for calculating and managing horse racing bets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
