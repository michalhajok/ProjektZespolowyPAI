"use client";
import React, { useState, useEffect } from "react";
import api from "../../../lib/api";

export default function CategoryForm({ category, onSuccess, onCancel }) {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(category?.name || "");
    setDescription(category?.description || "");
    setError("");
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nazwa jest wymagana");
      return;
    }
    try {
      if (category) {
        await api.put(`/categories/${category._id}`, { name, description });
      } else {
        await api.post("/categories", { name, description });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Błąd zapisu");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">
          {category ? "Edytuj kategorię" : "Nowa kategoria"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <label className="block mb-4">
          <span className="text-gray-700">Nazwa</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Opis (opcjonalnie)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Zapisz
          </button>
        </div>
      </form>
    </div>
  );
}
