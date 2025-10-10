"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";
import api from "../../lib/api";

export default function EquipmentListPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("nameAsc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  // Pobierz kategorie
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => console.error("Błąd ładowania kategorii"));
  }, []);

  // Ustaw kategorię z URL-a i oznacz jako zainicjalizowane
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    setIsInitialized(true);
  }, [categoryFromUrl]);

  // Pobierz sprzęt - tylko po inicjalizacji
  useEffect(() => {
    if (!isInitialized) return; // Czekaj na inicjalizację

    setLoading(true);
    setError("");

    const endpoint = selectedCategory
      ? `/equipment?category=${selectedCategory}`
      : "/equipment";

    api
      .get(endpoint)
      .then(({ data }) => setItems(data.data.items))
      .catch(() => setError("Błąd ładowania listy sprzętu"))
      .finally(() => setLoading(false));
  }, [selectedCategory, isInitialized]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // Opcjonalnie: zaktualizuj URL bez przeładowania strony
    const newUrl = categoryId
      ? `/equipment?category=${categoryId}`
      : "/equipment";
    window.history.pushState({}, "", newUrl);
  };

  const sorted = [...items].sort((a, b) => {
    if (sort === "nameAsc") return a.name.localeCompare(b.name);
    if (sort === "nameDesc") return b.name.localeCompare(a.name);
    return 0;
  });

  const selectedCategoryName =
    categories.find((cat) => cat._id === selectedCategory)?.name || "Wszystkie";

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lista sprzętu</h1>
        <p className="text-gray-600">
          Przeglądaj dostępne urządzenia i akcesoria.
        </p>
        {selectedCategory && (
          <p className="text-blue-600 mt-2">
            Kategoria:{" "}
            <span className="font-semibold">{selectedCategoryName}</span>
          </p>
        )}
      </header>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="category" className="text-gray-700">
            Kategoria:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-gray-700">
            Sortuj:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="nameAsc">Nazwa A→Z</option>
            <option value="nameDesc">Nazwa Z→A</option>
          </select>
        </div>

        {selectedCategory && (
          <button
            onClick={() => handleCategoryChange("")}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Wyczyść filtr
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <svg
            role="progressbar"
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
          {sorted.map((eq) => {
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
          <p className="text-gray-500">
            {selectedCategory
              ? "Brak sprzętu w wybranej kategorii."
              : "Brak dostępnego sprzętu."}
          </p>
        </div>
      )}
    </Layout>
  );
}
