"use client";
import Link from "next/link";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <p className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Wypożyczalnia Sprzętu
            </p>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/categories">
              <p className="text-gray-700 hover:text-blue-600 font-medium">
                Kategorie
              </p>
            </Link>
            <Link href="/equipment">
              <p className="text-gray-700 hover:text-blue-600 font-medium">
                Sprzęt
              </p>
            </Link>

            {user ? (
              <>
                <Link href="/reservations">
                  <p className="text-gray-700 hover:text-blue-600 font-medium">
                    Moje rezerwacje
                  </p>
                </Link>

                {user.role === "admin" && (
                  <div className="flex space-x-4">
                    <Link href="/admin/categories">
                      <p className="text-orange-600 hover:text-orange-700 font-medium">
                        Zarządzaj kategoriami
                      </p>
                    </Link>
                    <Link href="/admin/equipment">
                      <p className="text-orange-600 hover:text-orange-700 font-medium">
                        Zarządzaj sprzętem
                      </p>
                    </Link>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Witaj, {user.firstName}!
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Wyloguj
                  </button>
                </div>
              </>
            ) : (
              <Link href="/auth/login">
                <p className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Zaloguj się
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
