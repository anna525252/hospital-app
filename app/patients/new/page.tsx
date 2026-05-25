"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Doctor } from "@/types";

const input =
  "w-full rounded-2xl border border-slate-200 px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 transition";

export default function NewPatientPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [isCritical, setIsCritical] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDoctors() {
      const res = await fetch("/api/doctors?limit=100");
      const data = await res.json();

      setDoctors(data.items);
    }

    fetchDoctors();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const ageNumber = Number(age);

    if (fullName.trim().length < 3) {
      setError("ФИО должно содержать минимум 3 символа");
      setLoading(false);
      return;
    }

    if (fullName.trim().length > 100) {
      setError("Полное имя не должно превышать 100 символов");
      setLoading(false);
      return;
    }

    if (ageNumber < 1 || ageNumber > 120) {
      setError("Возраст должен быть от 1 до 120 лет");
      setLoading(false);
      return;
    }

    if (diagnosis.trim().length < 3) {
      setError("Диагноз должен содержать минимум 3 символа");
      setLoading(false);
      return;
    }

    if (diagnosis.trim().length > 200) {
      setError("Диагноз не должен превышать 200 символов");
      setLoading(false);
      return;
    }

    if (notes.length > 500) {
      setError("Заметки не должны превышать 500 символов");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        age: Number(age),
        diagnosis,
        doctorId,
        isCritical,
        notes,
      }),
    });

    if (!res.ok) {
      const data = await res.json();

      setError(data.error || "Что-то пошло не так");
      setLoading(false);
      return;
    }

    router.push("/patients");
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Link
        href="/patients"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition mb-8"
      >
        ← Назад к пациентам
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Добавление пациента
        </h1>

        <div className="w-full h-0.5 rounded-full bg-[linear-gradient(90deg,#0B82C6,#00A482)]" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-7">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Полное имя *
            </label>

            <input
              type="text"
              required
              minLength={3}
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иванов Иван"
              className={input}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Возраст
            </label>

            <input
              type="number"
              required
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="0"
              className={input}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Диагноз *
            </label>

            <input
              type="text"
              required
              minLength={3}
              maxLength={200}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Введите диагноз"
              className={input}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Врач *
            </label>

            <div className="relative">
              <select
                required
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className={`${input} appearance-none pr-12 bg-white`}
              >
                <option value="">Выбрать врача</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>

              <img
                src="/images/arrow.svg"
                alt=""
                className="invert pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Заметки
            </label>

            <textarea
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительная информация"
              className={`${input} resize-none`}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="font-semibold text-slate-800">
                Критическое состояние
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Пациент требует повышенного внимания
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCritical(!isCritical)}
              className={`relative w-14 h-8 rounded-full transition-all ${
                isCritical ? "bg-red-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  isCritical ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full h-12 text-white font-semibold hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 bg-[linear-gradient(135deg,#0B82C6,#00A482)]"
          >
            {loading ? "Сохранение..." : "Добавить пациента"}
          </button>
        </form>
      </div>
    </div>
  );
}
