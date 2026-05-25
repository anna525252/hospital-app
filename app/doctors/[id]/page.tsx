"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Doctor, Patient } from "@/types";

export default function DoctorPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    async function loadData() {
      const [doctorRes, patientsRes] = await Promise.all([
        fetch(`/api/doctors/${id}`),
        fetch("/api/patients"),
      ]);

      if (!doctorRes.ok) {
        router.push("/doctors");
        return;
      }

      const doctorData = await doctorRes.json();
      const patientsData = await patientsRes.json();

      setDoctor(doctorData);

      setPatients(patientsData.items.filter((p: Patient) => p.doctorId === id));
    }

    loadData();
  }, [id, router]);

  async function deleteDoctor() {
    const ok = confirm("Удалить врача?");
    if (!ok) return;

    await fetch(`/api/doctors/${id}`, {
      method: "DELETE",
    });

    router.push("/doctors");
  }

  if (!doctor) {
    return (
      <div className="py-8 text-sm text-slate-400 animate-pulse">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition mb-6"
      >
        ← Назад к врачам
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
            <Image
              src={
                doctor.gender === "male"
                  ? "/images/doctors/male.svg"
                  : "/images/doctors/female.svg"
              }
              alt="doctor"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 leading-tight break-words">
              {doctor.fullName}
            </h1>

            <p className="text-sm text-slate-400 mt-0.5">
              {doctor.specialization}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className={`w-2 h-2 rounded-full ${
                doctor.isAvailable ? "bg-emerald-400" : "bg-red-400"
              }`}
            />

            <span
              className={`text-sm font-medium ${
                doctor.isAvailable ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {doctor.isAvailable ? "Доступен" : "На приёме"}
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 mb-5" />

        <div className="mb-5">
          <div className="flex">
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-0.5">Стаж</p>

              <p className="font-semibold text-slate-800">
                {doctor.experience} лет
              </p>
            </div>

            <div className="w-px bg-slate-100" />

            <div className="flex-1 pl-4">
              <p className="text-xs text-slate-400 mb-0.5">Email</p>

              <p className="font-semibold text-slate-800 break-all">
                {doctor.email || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">
            Пациенты врача
          </p>

          {patients.length === 0 ? (
            <p className="text-sm text-slate-400">Пациентов пока нет</p>
          ) : (
            <div className="space-y-2">
              {patients.map((patient) => {
                const initials = patient.fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("");

                return (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="group flex items-center gap-3 rounded-2xl hover:bg-slate-50 transition-all p-2 -mx-2"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[linear-gradient(135deg,#0B82C6,#00A482)]">
                      <span className="text-white text-sm font-bold">
                        {initials}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">
                        {patient.fullName}
                      </p>

                      <p className="text-xs text-slate-400">
                        {patient.diagnosis}
                      </p>
                    </div>

                    <span className="ml-auto text-cyan-400 group-hover:translate-x-1 transition-transform text-sm">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/doctors/${id}/edit`}
          className="flex-1 rounded-full h-11 flex items-center justify-center text-white font-semibold text-sm hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 bg-[linear-gradient(135deg,#0B82C6,#00A482)]"
        >
          Редактировать
        </Link>

        <button
          onClick={deleteDoctor}
          className="flex-1 rounded-full h-11 border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-200"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
