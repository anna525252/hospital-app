"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Doctor } from "@/types";
import Image from "next/image";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/api/doctors?page=${currentPage}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.items);
        setTotalPages(data.pages);
      });
  }, [currentPage]);

  return (
    <div className="min-h-screen py-10 px-6 relative">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-cyan-400 text-xs font-medium tracking-[0.25em] uppercase mb-2">
            Медицинский персонал
          </p>

          <h1 className="text-white font-bold text-3xl leading-tight">Врачи</h1>

          <div className="w-84 h-[2px] mt-3 rounded-full bg-[linear-gradient(90deg,#0B82C6,#00A482)]" />
        </div>

        <Link
          href="/doctors/new"
          className="inline-flex items-center gap-2 rounded-full h-11 px-7 font-bold text-white text-sm hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 bg-[linear-gradient(135deg,#0B82C6,#00A482)]"
        >
          <span className="text-base leading-none">+</span>
          Добавить врача
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor: Doctor) => (
          <div
            key={doctor.id}
            className="group relative rounded-2xl p-5 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                <Image
                  src={
                    doctor.gender === "male"
                      ? "/images/doctors/male.svg"
                      : "/images/doctors/female.svg"
                  }
                  alt={
                    doctor.gender === "male" ? "male doctor" : "female doctor"
                  }
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-gray-900 leading-tight truncate">
                    {doctor.fullName}
                  </h2>
                </div>

                <p className="text-sm mt-0.5 text-gray-400">
                  {doctor.specialization}
                </p>
              </div>
            </div>

            <div className="w-full h-px mb-4 bg-gray-100" />

            <div className="flex items-center justify-between">
              {doctor.isAvailable ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium text-emerald-600">
                    Доступен
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-red-500">
                    На приёме
                  </span>
                </div>
              )}

              <Link
                href={`/doctors/${doctor.id}`}
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

      {doctors.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2 text-sm font-semibold rounded-full text-white border border-white/20 bg-white/10 hover:bg-white/15 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            ← Назад
          </button>

          <span className="text-sm text-slate-400">
            Страница{" "}
            <span className="font-bold bg-[linear-gradient(90deg,#0B82C6,#00A482)] bg-clip-text text-transparent">
              {currentPage}
            </span>{" "}
            из <span className="font-semibold text-white">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2 text-sm font-semibold rounded-full text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-cyan-500/20 bg-[linear-gradient(135deg,#0B82C6,#00A482)]"
          >
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}