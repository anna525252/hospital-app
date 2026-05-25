import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="flex items-center justify-center px-16 mt-10">
            <div className="sticky bg-white/90 top-0 z-50 flex w-full max-w-6xl min-h-15 items-center justify-between rounded-[30px] px-7">
                <Link href="/">
                    <div className="flex w-8 h-8 items-center gap-2">
                        <Image src="/images/logo.svg" width={92} height={92} alt="logo"></Image>
                        <p className="font-extrabold">Hospital</p>
                    </div>
                </Link>

                <div className="flex gap-4 font-semibold">
                    <Link href="/">Главная</Link>
                    <Link href="/doctors">Врачи</Link>
                    <Link href="/patients">Пациенты</Link>
                </div>
            </div>
        </nav>
    );
}