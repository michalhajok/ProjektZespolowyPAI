"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import api from "../../lib/api";

export default function EquipmentListPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/equipment")
      .then(({ data }) => setItems(data.data.items))
      .catch(() => setError("Błąd ładowania listy sprzętu"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lista sprzętu</h1>
        <p className="text-gray-600">
          Przeglądaj dostępne urządzenia i akcesoria.
        </p>
      </header>

      {loading && (
        <div className="flex justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((eq) => {
            const img = eq.media.images?.[0];
            return (
              <Link key={eq._id} href={`/equipment/${eq._id}`}>
                <div className="block bg-white border rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {img ? (
                      <img
                        src={img.url}
                        alt={img.alt || eq.name}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <span className="text-gray-400">Brak zdjęcia</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                      {eq.name}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">Brak dostępnego sprzętu.</p>
        </div>
      )}
    </Layout>
  );
}
