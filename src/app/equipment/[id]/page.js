"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "../../../components/Layout";
import api from "../../../lib/api";
import useAuth from "../../../hooks/useAuth";

export default function EquipmentDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [showReserve, setShowReserve] = useState(false);
  const router = useRouter();

  // fetch equipment, update views
  useEffect(() => {
    api.post(`/equipment/${id}/views`).catch(() => {});
    api
      .get(`/equipment/${id}`)
      .then(({ data }) => setItem(data.data))
      .catch(() => setError("Błąd ładowania szczegółów"));
  }, [id]);

  // fetch reviews
  useEffect(() => {
    api
      .get(`/reviews?equipment=${id}`)
      .then(({ data }) => setReviews(data.data?.items))
      .catch(() => {});
  }, [id]);

  console.log(reviews);

  const handleReserve = async () => {
    if (!dates.startDate || !dates.endDate) return;
    try {
      await api.post("/reservations", { equipment: id, dates });
      router.push("/reservations");
    } catch {
      alert("Błąd przy rezerwacji");
    }
  };

  if (error) {
    return (
      <Layout>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline"
        >
          Wróć
        </button>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <p>Ładowanie...</p>
      </Layout>
    );
  }

  const statusMap = {
    available: "Dostępny",
    reserved: "Zarezerwowany",
    maintenance: "W serwisie",
    unavailable: "Niedostępny",
    retired: "Wycofany",
  };

  const conditionMap = {
    new: "Nowy",
    excellent: "Bardzo dobry",
    good: "Dobry",
    fair: "Używany",
    poor: "Zły",
  };

  const primaryImage =
    item.media.images.find((img) => img.isPrimary) || item.media.images[0];

  return (
    <Layout>
      <nav className="text-sm mb-4 flex items-center space-x-1">
        <Link href="/categories">
          <p className="hover:underline">Kategorie</p>
        </Link>
        {" / "}
        <Link href="/equipment">
          <p className="hover:underline"> Sprzęt </p>
        </Link>
        {" / "} {item.name}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              className="w-full h-auto rounded"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
              Brak obrazu
            </div>
          )}
          {item.media.images.length > 1 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {item.media.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={img.alt}
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() =>
                    setItem((prev) => ({
                      ...prev,
                      media: {
                        ...prev.media,
                        images: [
                          img,
                          ...prev.media.images.filter((_, idx) => idx !== i),
                        ],
                      },
                    }))
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
          <p className="text-gray-700 mb-4">{item.description}</p>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Specyfikacje</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <strong>Marka:</strong> {item.specifications.brand}
              </li>
              <li>
                <strong>Model:</strong> {item.specifications.model}
              </li>
              <li>
                <strong>Nr seryjny:</strong>{" "}
                {item.specifications.serialNumber || "–"}
              </li>
              <li>
                <strong>Rok:</strong>{" "}
                {item.specifications.yearManufactured || "–"}
              </li>
              <li>
                <strong>Stan:</strong>{" "}
                {conditionMap[item.specifications.condition]}
              </li>
              {item.specifications.technicalSpecs && (
                <li>
                  <strong>Parametry:</strong>
                  <ul className="ml-4 list-disc">
                    {Array.from(
                      item.specifications.technicalSpecs.entries()
                    ).map(([k, v]) => (
                      <li key={k}>
                        {k}: {v}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Dostępność</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <strong>Status:</strong> {statusMap[item.availability.status]}
              </li>
              <li>
                <strong>Ilość dostępna:</strong>{" "}
                {item.availability.availableQuantity} /{" "}
                {item.availability.quantity}
              </li>
              <li>
                <strong>Oddział:</strong> {item.availability.location.branch}
              </li>
              <li>
                <strong>Magazyn:</strong> {item.availability.location.warehouse}
              </li>
              <li>
                <strong>Półka:</strong> {item.availability.location.shelf}
              </li>
            </ul>
          </section>

          <button
            onClick={() => setShowReserve(true)}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Zarezerwuj
          </button>

          {showReserve && (
            <div className="mb-4 p-4 border rounded">
              <h3 className="font-semibold mb-2">Wybierz daty</h3>
              <label className="block mb-2">
                <span>Od</span>
                <input
                  type="date"
                  value={dates.startDate}
                  onChange={(e) =>
                    setDates((d) => ({ ...d, startDate: e.target.value }))
                  }
                  className="block border px-2 py-1"
                />
              </label>
              <label className="block mb-2">
                <span>Do</span>
                <input
                  type="date"
                  value={dates.endDate}
                  onChange={(e) =>
                    setDates((d) => ({ ...d, endDate: e.target.value }))
                  }
                  className="block border px-2 py-1"
                />
              </label>
              <button
                onClick={handleReserve}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Potwierdź
              </button>
            </div>
          )}

          {item.media.documents.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Dokumenty</h2>
              <ul className="space-y-1">
                {item.media.documents.map((doc, i) => (
                  <li key={i}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {doc.name} ({doc.type})
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recenzje</h2>
        {reviews.length >= 1 ? (
          reviews?.map((r, i) => (
            <div key={i} className="mb-4 p-4 border rounded">
              <p className="font-semibold">{r.user.firstName}</p>
              <p>Ocena: {r.rating} / 5</p>
              <p>{r.comment}</p>
            </div>
          ))
        ) : (
          <p>Brak recenzji</p>
        )}
      </section>
    </Layout>
  );
}
