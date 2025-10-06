"use client";
import React, { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import useAuth from "../../../hooks/useAuth";
import Layout from "../../../components/Layout";
import api from "../../../lib/api";

export default function CategoriesAdminPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch {
      setError("Nie udało się pobrać kategorii");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <Layout>
        <p>Brak uprawnień</p>
      </Layout>
    );
  }

  const handleDelete = async (id) => {
    if (!confirm("Na pewno usunąć tę kategorię?")) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Zarządzanie kategoriami</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Dodaj kategorię
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nazwa</th>
            <th className="p-2 border">Opis</th>
            <th className="p-2 border">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">{cat.description || "-"}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => {
                    setEditing(cat);
                    setShowForm(true);
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Usuń
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <CategoryForm
          category={editing}
          onSuccess={() => {
            setShowForm(false);
            load();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </Layout>
  );
}
