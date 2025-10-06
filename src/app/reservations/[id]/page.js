"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import api from "../../../lib/api";
import useAuth from "../../../hooks/useAuth";

export default function ReservationDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [reservation, setReservation] = useState(null);
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const isAdmin = user.role === "admin";
  const [status1, setStatus1] = useState("");
  const possibleStatuses = [
    "pending",
    "confirmed",
    "active",
    "completed",
    "cancelled",
    "overdue",
  ];

  const statusMap = {
    pending: "Oczekująca",
    confirmed: "Potwierdzona",
    active: "Aktywna",
    overdue: "Zaległa",
    cancelled: "Anulowany",
    completed: "Zakończony",
  };

  const router = useRouter();

  const load = async () => {
    try {
      const { data } = await api.get(`/reservations/${id}`);
      setReservation(data.data);
      // ładowanie recenzji dla tej rezerwacji, jeśli istnieje
      const { data: reviewData } = await api.get(`/reviews?reservation=${id}`);
      setReview(reviewData.data[0] || null);
    } catch {
      setError("Błąd ładowania danych");
    }
  };

  useEffect(() => {
    if (user) load();
  }, [id, user]);

  const handleStatusChange = async () => {
    console.log({ status1 });
    await api.patch(`/reservations/${id}/status`, {
      status: status1,
    });
  };

  if (!user)
    return (
      <Layout>
        <p>Musisz być zalogowany.</p>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <p className="text-red-600">{error}</p>
      </Layout>
    );
  if (!reservation)
    return (
      <Layout>
        <p>Ładowanie…</p>
      </Layout>
    );

  const { equipment, dates, status } = reservation;
  const isCompleted = status === "completed";
  const canReview = isCompleted && !review;

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim())
      return alert("Ocena i komentarz są wymagane");
    try {
      await api.post("/reviews", {
        user: user.id,
        equipment: equipment._id,
        reservation: id,
        rating,
        title,
        comment,
      });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Błąd podczas dodawania recenzji");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">
        Rezerwacja #{reservation._id.slice(-6)}
      </h1>
      <p>
        <strong>Sprzęt:</strong>{" "}
        <a
          href={`/equipment/${equipment._id}`}
          className="text-blue-600 hover:underline"
        >
          {equipment.name}
        </a>
      </p>
      <p>
        <strong>Data rozpoczęcia:</strong>{" "}
        {new Date(dates.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Data zakończenia:</strong>{" "}
        {new Date(dates.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {statusMap[status]}
      </p>

      {isAdmin && (
        <div className="mt-4">
          <label className="mr-2 font-semibold">Zmień status:</label>
          <select
            value={statusMap[status1]}
            onChange={(e) => setStatus1(e.target.value)}
            className="border px-2 py-1"
          >
            {[
              reservation.status,
              ...possibleStatuses.filter((s) => s !== reservation.status),
            ].map((s) => (
              <option key={s} value={s}>
                {statusMap[s]}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleStatusChange()}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Zapisz
          </button>
        </div>
      )}

      {isCompleted && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Twoja recenzja</h2>

          {review ? (
            <div className="p-4 border rounded">
              <p className="font-semibold">
                {review.title || `Ocena: ${review.rating}/5`}
              </p>
              <p>Ocena: {review.rating} / 5</p>
              {review.title && <p className="italic">„{review.title}”</p>}
              <p>{review.comment}</p>
            </div>
          ) : (
            canReview && (
              <div className="p-4 border rounded space-y-3">
                <label className="block">
                  <span>Ocena</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="mt-1 block border px-2 py-1"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span>Tytuł (opcjonalnie)</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="mt-1 block border px-2 py-1 w-full"
                  />
                </label>
                <label className="block">
                  <span>Komentarz</span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    className="mt-1 block border px-2 py-1 w-full"
                  />
                </label>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Wyślij recenzję
                </button>
              </div>
            )
          )}
        </section>
      )}

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Wróć
      </button>
    </Layout>
  );
}
