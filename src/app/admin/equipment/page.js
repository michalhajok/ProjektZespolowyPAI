"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Layout from "../../../components/Layout";
import api from "../../../lib/api";
import EquipmentForm from "./EquipmentForm";

export default function EquipmentListPage() {
  const params = useSearchParams();
  const categoryId = params.get("category") || "";
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const load = async () => {
    try {
      let url = "/equipment";
      if (categoryId) url += `?category=${categoryId}`;
      const { data } = await api.get(url);
      setItems(data.data.items);
    } catch {
      setError("Nie udało się pobrać sprzętu");
    }
  };

  const conditionMap = {
    new: "Nowy",
    excellent: "Bardzo dobry",
    good: "Dobry",
    fair: "Używany",
    poor: "Zły",
  };

  useEffect(() => {
    load();
  }, [categoryId]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryId ? "Sprzęt w kategorii" : "Dostępny sprzęt"}
        </h1>
        <p className="text-gray-600">
          Przeglądaj i wybierz sprzęt do wypożyczenia
        </p>
      </div>
      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Dodaj sprzęt
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((eq) => (
          <Link key={eq._id} href={`/equipment/${eq._id}`}>
            <div className="group block bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {eq.media.images?.length > 0 ? (
                  <img
                    src={
                      eq.media.images.find((img) => img.isPrimary)?.url ||
                      eq.media.images[0].url
                    }
                    alt={
                      eq.media.images.find((img) => img.isPrimary)?.alt ||
                      eq.name
                    }
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <div className="text-gray-400">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">Brak zdjęcia</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {eq.name}
                </h2>

                <p className="text-sm text-gray-600 mb-3">
                  {eq.specifications.brand} {eq.specifications.model}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Dostępność:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {eq.availability.availableQuantity} z{" "}
                      {eq.availability.quantity}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stan:</span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${
                        eq.specifications.condition === "new"
                          ? "bg-green-100 text-green-800"
                          : eq.specifications.condition === "excellent"
                          ? "bg-blue-100 text-blue-800"
                          : eq.specifications.condition === "good"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {conditionMap[eq.specifications.condition]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {showForm && (
        <EquipmentForm
          equipment={editing}
          onSuccess={() => {
            setShowForm(false);
            load();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {items.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-xl text-gray-600 mb-2">Brak dostępnego sprzętu</p>
          <p className="text-gray-500">
            Spróbuj ponownie później lub skontaktuj się z nami.
          </p>
        </div>
      )}
    </Layout>
  );
}
