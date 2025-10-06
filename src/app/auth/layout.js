import Link from "next/link";

export const metadata = {
  title: "Autoryzacja – Wypożyczalnia Sprzętu",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="mb-6">
        <Link href="/">
          <p className="text-2xl font-bold">Wypożyczalnia Sprzętu</p>
        </Link>
      </header>
      <main className="w-full max-w-md bg-white p-6 rounded shadow">
        {children}
      </main>
    </div>
  );
}
