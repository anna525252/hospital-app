"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Patient } from "@/types";

export default function PatientPage() {
  const params = useParams();
  const id = String(params.id);

  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    async function loadPatient() {
      const res = await fetch(`/api/patients/${id}`);

      if (!res.ok) {
        router.push("/patients");
        return;
      }

      setPatient(await res.json());
    }

    loadPatient();
  }, [id, router]);

  async function deletePatient() {
    const ok = confirm("Удалить пациента?");
    if (!ok) return;

    await fetch(`/api/patients/${id}`, {
      method: "DELETE",
    });

    router.push("/patients");
  }

  if (!patient) {
    return (
      <div className="py-8 text-sm text-white px-4">
        Загрузка...
      </div>
    );
  }

  const initials = patient.fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-lg mx-auto">
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition mb-5 sm:mb-6"
        >
          ← Назад к пациентам
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[linear-gradient(135deg,#0B82C6,#00A482)]">
              <span className="text-white font-bold text-base sm:text-lg leading-none">
                {initials}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight break-words">
                {patient.fullName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Поступил:{" "}
                {new Date(patient.admittedAt).toLocaleDateString("ru-RU")}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-2 h-2 rounded-full ${
                  patient.isCritical ? "bg-red-400" : "bg-emerald-400"
                }`}
              />

              <span
                className={`text-xs sm:text-sm font-medium ${
                  patient.isCritical ? "text-red-500" : "text-emerald-600"
                }`}
              >
                {patient.isCritical ? "Критическое" : "Стабильное"}
              </span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-5" />

          <div className="mb-5">
            <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-0">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-0.5">Возраст</p>
                <p className="font-semibold text-slate-800">
                  {patient.age} лет
                </p>
              </div>

              <div className="hidden sm:block w-px bg-slate-100" />

              <div className="flex-1 sm:pl-4">
                <p className="text-xs text-slate-400 mb-0.5">Диагноз</p>
                <p className="font-semibold text-slate-800 break-words">
                  {patient.diagnosis}
                </p>
              </div>
            </div>

            {patient.notes && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-0.5">Заметки</p>
                <p className="font-semibold text-slate-800 break-words">
                  {patient.notes}
                </p>
              </div>
            )}
          </div>

          {patient.doctor && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">
                Лечащий врач
              </p>

              <Link
                href={`/doctors/${patient.doctor.id ?? ""}`}
                className="group flex items-center gap-3 rounded-2xl hover:bg-slate-50 transition-all p-2 -mx-2"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                  <Image
                    src={
                      patient.doctor.gender === "male"
                        ? "/images/doctors/male.svg"
                        : "/images/doctors/female.svg"
                    }
                    alt="doctor"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm break-words">
                    {patient.doctor.fullName}
                  </p>

                  <p className="text-xs text-slate-400">
                    {patient.doctor.specialization}
                  </p>
                </div>

                <span className="ml-auto text-cyan-400 group-hover:translate-x-1 transition-transform text-sm">
                  →
                </span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/patients/${id}/edit`}
          className="flex-1 rounded-full h-16 sm:h-11 flex items-center justify-center text-white font-semibold text-base sm:text-sm hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 bg-[linear-gradient(135deg,#0B82C6,#00A482)]"
        >
          Редактировать
        </Link>

        <button
          onClick={deletePatient}
          className="flex-1 rounded-full h-16 sm:h-11 border border-red-200 text-red-500 font-semibold text-base sm:text-sm hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-200"
        >
          Удалить
        </button>
      </div>
      </div>
    </div>
  );
}