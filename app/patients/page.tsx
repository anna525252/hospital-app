"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Doctor, Patient } from "@/types";
import Image from "next/image";

const LIMIT = 6;

export default function PatientsPage() {
  const [data, setData] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(LIMIT),
    });

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (doctorFilter) params.set("doctorId", doctorFilter);

    fetch(`/api/patients?${params}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.items);
        setTotalPages(json.pages);
      });
  }, [currentPage, debouncedSearch, doctorFilter]);

  useEffect(() => {
    fetch("/api/doctors?limit=100")
      .then((res) => res.json())
      .then((json) => setDoctors(json.items));
  }, []);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDoctorOpen(false);
      }
    }

    document.addEventListener("mousedown", outside);

    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const hasFilters = search || doctorFilter;

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 relative">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-5">
        <div>
          <p className="text-cyan-400 text-xs font-medium tracking-[0.25em] uppercase mb-2">
            Картотека
          </p>

          <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight">
            Пациенты
          </h1>

          <div className="w-full max-w-84 h-0.5 mt-3 rounded-full bg-[linear-gradient(90deg,#0B82C6,#00A482)]" />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white/10 border border-white/15 rounded-full px-5 py-3 text-sm text-white w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition placeholder:text-white/40"
          />

          <div ref={dropdownRef} className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsDoctorOpen((v) => !v)}
              className="appearance-none bg-white/10 border border-white/15 rounded-full pl-5 pr-10 py-3 text-sm text-white w-full sm:w-[210px] text-left hover:bg-white/15 transition relative"
            >
              <span className="truncate block">
                {doctorFilter
                  ? doctors.find((d) => String(d.id) === doctorFilter)?.fullName
                  : "Все врачи"}
              </span>

              <img
                src="/images/arrow.svg"
                alt=""
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition ${
                  isDoctorOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute top-[56px] left-0 w-full rounded-2xl overflow-hidden bg-[#121826] border border-white/10 z-50 transition ${
                isDoctorOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={() => {
                  setDoctorFilter("");
                  setCurrentPage(1);
                  setIsDoctorOpen(false);
                }}
                className="w-full text-left px-5 py-3 text-sm text-white hover:bg-white/5"
              >
                Все врачи
              </button>

              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setDoctorFilter(String(doctor.id));
                    setCurrentPage(1);
                    setIsDoctorOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm text-white hover:bg-white/5 truncate"
                >
                  {doctor.fullName}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setDoctorFilter("");
                setCurrentPage(1);
              }}
              className="border border-white/15 rounded-full px-4 py-3 text-sm text-white/50 hover:text-red-400 hover:border-red-400/40 transition bg-white/10"
            >
              ✕
            </button>
          )}

          <Link
            href="/patients/new"
            className={`inline-flex items-center justify-center rounded-full h-14 sm:h-11 font-bold text-white text-sm hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 whitespace-nowrap overflow-hidden transition-[width] duration-700 ease-in-out bg-[linear-gradient(135deg,#0B82C6,#00A482)] ${
              hasFilters ? "w-full sm:w-[44px]" : "w-full sm:w-[220px]"
            }`}
          >
            <span className="text-base leading-none shrink-0">+</span>

            <span
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                hasFilters
                  ? "max-w-0 opacity-0 ml-0"
                  : "max-w-[180px] opacity-100 ml-2"
              }`}
            >
              Добавить пациента
            </span>
          </Link>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">Пациенты не найдены</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((patient) => (
            <div
              key={patient.id}
              className="group relative rounded-2xl p-5 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[linear-gradient(135deg,#0B82C6,#00A482)]">
                  <span className="text-white font-bold text-sm leading-none">
                    {patient.fullName
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-gray-900 truncate">
                      {patient.fullName}
                    </h2>
                  </div>

                  <p className="text-sm mt-0.5 text-gray-400">
                    Возраст: {patient.age}
                  </p>
                </div>
              </div>

              <div className="w-full h-px mb-4 bg-gray-100" />

              <div className="flex items-center justify-between">
                {patient.isCritical ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm font-medium text-red-500">
                      Критическое
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium text-emerald-600">
                      Стабильное
                    </span>
                  </div>
                )}

                <Link
                  href={`/patients/${patient.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-500 transition-colors"
                >
                  Подробнее
                  <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-5 py-3 text-sm font-semibold rounded-full text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 border border-white/20 bg-white/10"
          >
            ← Назад
          </button>

          <span className="text-sm text-slate-400 text-center">
            Страница{" "}
            <span className="font-bold bg-[linear-gradient(90deg,#0B82C6,#00A482)] bg-clip-text text-transparent">
              {currentPage}
            </span>{" "}
            из <span className="font-semibold text-white">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-5 py-3 text-sm font-semibold rounded-full text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-cyan-500/20 bg-[linear-gradient(135deg,#0B82C6,#00A482)]"
          >
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}