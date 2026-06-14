"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-5 z-50 w-full px-4 sm:px-8 md:px-16 mt-6 sm:mt-10">
      <div className="mx-auto flex w-full max-w-6xl min-h-15 items-center justify-between rounded-[30px] px-5 sm:px-7 py-3 bg-white/90 backdrop-blur">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.svg" width={32} height={32} alt="logo" />
            <p className="font-extrabold">Hospital</p>
          </div>
        </Link>

        <div className="hidden sm:flex gap-4 font-semibold">
          <Link href="/">Главная</Link>
          <Link href="/doctors">Врачи</Link>
          <Link href="/patients">Пациенты</Link>
        </div>

        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden fixed top-24 left-4 right-4 bg-white/95 rounded-[20px] z-50 flex flex-col gap-4 font-semibold px-6 py-5 shadow-md">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Главная
          </Link>
          <Link href="/doctors" onClick={() => setMenuOpen(false)}>
            Врачи
          </Link>
          <Link href="/patients" onClick={() => setMenuOpen(false)}>
            Пациенты
          </Link>
        </div>
      )}
    </nav>
  );
}