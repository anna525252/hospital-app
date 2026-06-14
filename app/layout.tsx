import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
import Navigation from "@/components/navigation";

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
      <body
        className={`${montserrat.className} min-h-screen flex flex-col bg-[#24353C] overflow-x-hidden`}
      >
        <Navigation />

        <div className="absolute top-16 left-8 w-2 h-2 rounded-full bg-cyan-500 opacity-40 hidden sm:block" />
        <div className="absolute top-10 left-14 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-30 hidden sm:block" />
        <div className="absolute bottom-20 left-12 w-2 h-2 rounded-full bg-emerald-400 opacity-25 hidden sm:block" />

        <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex">
          <div className="flex-1 w-full min-w-0 flex flex-col">{children}</div>
        </main>
      </body>
    </html>
  );
}
