"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { FormEvent } from "react";

export default function EditDoctorPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctor() {
      const res = await fetch(`/api/doctors/${id}`);

      if (!res.ok) {
        setError("Врач не найден");
        return;
      }

      const doctor = await res.json();

      setFullName(doctor.fullName || "");
      setSpecialization(doctor.specialization || "");
      setExperience(String(doctor.experience ?? ""));
      setEmail(doctor.email || "");
      setGender(doctor.gender || "female");
      setIsAvailable(doctor.isAvailable);
    }

    loadDoctor();
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const experienceNumber = Number(experience);

    if (fullName.trim().length < 3 || fullName.trim().length > 100) {
      setError("Полное имя должно содержать от 3 до 100 символов");
      setLoading(false);
      return;
    }

    const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;

    if (!nameRegex.test(fullName.trim())) {
      setError("Полное имя может содержать только буквы, пробелы и дефис");
      setLoading(false);
      return;
    }

    if (specialization.trim().length < 2 || specialization.trim().length > 50) {
      setError("Специализация должна содержать от 2 до 50 символов");
      setLoading(false);
      return;
    }

    if (experienceNumber < 0 || experienceNumber > 60) {
      setError("Стаж должен быть от 0 до 60 лет");
      setLoading(false);
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setError("Некорректный формат email");
        setLoading(false);
        return;
      }
    }

    const res = await fetch(`/api/doctors/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        specialization,
        experience: experienceNumber,
        email,
        gender,
        isAvailable,
      }),
    });

    if (!res.ok) {
      const data = await res.json();

      setError(data.error || "Что-то пошло не так");
      setLoading(false);
      return;
    }

    router.push(`/doctors/${id}`);
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Link
        href={`/doctors/${id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition mb-8"
      >
        ← Назад к врачу
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Редактирование врача
        </h1>

        <div
          className="w-136 h-0.5 rounded-full"
          style={{
            background: "linear-gradient(90deg, #0B82C6, #00A482)",
          }}
        />
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
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Специализация *
            </label>

            <input
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="Кардиолог"
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Стаж (лет) *
            </label>

            <input
              type="number"
              required
              min={0}
              max={60}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="10"
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@hospital.com"
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Пол *
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) =>
                    setGender(e.target.value as "male" | "female")
                  }
                  className="w-4 h-4 accent-cyan-600"
                />

                <span className="text-slate-700">Мужской</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) =>
                    setGender(e.target.value as "male" | "female")
                  }
                  className="w-4 h-4 accent-cyan-600"
                />

                <span className="text-slate-700">Женский</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="font-semibold text-slate-800">
                Доступность врача *
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Врач доступен для записи пациентов
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative w-14 h-8 rounded-full transition-all ${
                isAvailable ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  isAvailable ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full h-12 text-white font-semibold hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #0B82C6, #00A482)",
            }}
          >
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>
      </div>
    </div>
  );
}
