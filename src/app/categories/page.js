"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Błąd pobierania kategorii");
        return res.json();
      })
      .then((data) => setCategories(data.data))
      .catch(() => setError("Nie udało się pobrać kategorii"));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Kategorie</h1>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <li key={cat._id} className="p-4 border rounded hover:shadow">
            <Link href={`/equipment?category=${cat._id}`}>
              <p className="text-blue-600 hover:underline">{cat.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
