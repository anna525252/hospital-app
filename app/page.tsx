import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0 pl-30">
      <div className="relative z-10 flex items-center h-full w-full max-w-6xl mx-auto px-16">
        <div className="flex flex-col flex-1 max-w-lg items-center">
          <p className="text-cyan-400 text-sm font-medium tracking-[0.25em] uppercase mb-6">
            Медицинская платформа
          </p>

          <h1 className="text-white font-bold leading-tight mb-4 text-center text-[48px]">
            Учёт врачей и пациентов
          </h1>

          <div className="w-[400px] h-[2px] mb-6 rounded-full bg-[linear-gradient(90deg,#0B82C6,#00A482)]" />

          <p className="text-slate-400 text-base leading-relaxed mb-10 text-center">
            Платформа для ведения картотеки медицинского персонала и истории
            лечения пациентов.
          </p>

          <div className="flex gap-5">
            <Link href="/doctors">
              <button className="rounded-full h-12 px-8 font-bold text-white text-sm hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 transition-all duration-200 bg-[linear-gradient(135deg,#0B82C6,#00A482)]">
                Список врачей
              </button>
            </Link>

            <Link href="/patients">
              <button className="rounded-full h-12 px-8 font-bold text-white text-sm border border-white/25 bg-white/10 hover:bg-white/20 hover:border-white/50 active:scale-95 transition-all duration-200">
                Список пациентов
              </button>
            </Link>
          </div>
        </div>

        <div className="relative flex-shrink-0 flex items-center justify-center w-[420px] h-[420px]">
          <div className="absolute rounded-full w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(11,130,198,0.12)_0%,rgba(0,164,130,0.06)_100%)] border border-[#0B82C633]" />

          <div className="absolute rounded-full w-[360px] h-[360px] bg-[radial-gradient(circle,rgba(11,130,198,0.2)_0%,rgba(0,164,130,0.12)_100%)] border border-[#00A48259]" />

          <div className="absolute top-[78px] left-[78px] w-2.5 h-2.5 rounded-full bg-cyan-500 opacity-70" />

          <div className="absolute top-[78px] right-[78px] w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-70" />

          <div className="absolute bottom-[78px] left-[78px] w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-70" />

          <div className="absolute bottom-[78px] right-[78px] w-2.5 h-2.5 rounded-full bg-cyan-500 opacity-70" />

          <div className="relative rounded-full overflow-hidden w-[300px] h-[300px] border-2 border-[#0d9dd9]">
            <Image
              src="/images/placeholder.jpg"
              alt="Медицинский персонал"
              fill
              sizes="300px"
              quality={100}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
