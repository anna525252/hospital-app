import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Montserrat } from "next/font/google";
import Header from "./navigation/header";

export const metadata: Metadata = {
  title: "Система учёта врачей и пациентов",
  description: "Ведение картотеки врачей и пациентов",
};

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${montserrat.className} min-h-screen bg-[#24353C]`}>
        <Header />
        <main className="max-w-6xl mx-auto p-6">
          <div className="absolute top-16 left-8 w-2 h-2 rounded-full bg-cyan-500 opacity-40" />
          <div className="absolute top-10 left-14 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-30" />
          <div className="absolute bottom-20 left-12 w-2 h-2 rounded-full bg-emerald-400 opacity-25" />
          {children}</main>
      </body>
    </html>
  );
}