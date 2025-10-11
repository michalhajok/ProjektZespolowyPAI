"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import api from "../../lib/api";
import useAuth from "../../hooks/useAuth";

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const statusMap = {
    pending: "Oczekująca",
    confirmed: "Potwierdzona",
    active: "Aktywna",
    overdue: "Zaległa",
    cancelled: "Anulowany",
    completed: "Zakończony",
  };

  const load = async () => {
    try {
      if (user?.role === "admin") {
        const { data } = await api.get("/reservations");
        setReservations(data.data.items);
        return;
      } else if (user) {
        const { data } = await api.get("/reservations/?user=" + user.id);
        setReservations(data.data.items);
        return;
      }
    } catch {
      setError("Nie udało się pobrać rezerwacji");
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <p>Musisz być zalogowany, aby zobaczyć rezerwacje.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Moje rezerwacje</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <ul className="space-y-4">
        {reservations.map((r) => (
          <li key={r._id} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              <Link href={`/reservations/${r._id}`}>
                <p className="text-blue-600 hover:underline">
                  Rezerwacja #{r._id.slice(-6)}
                </p>
              </Link>
              {r.status === "reserved" && (
                <button
                  onClick={async () => {
                    await api.patch(`/reservations/${r._id}`, {
                      status: "cancelled",
                    });
                    load();
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Anuluj
                </button>
              )}
            </div>
            <p>
              <strong>Sprzęt:</strong> {r.equipment.name}
            </p>
            <p>
              <strong>Okres:</strong>{" "}
              {new Date(r.dates.startDate).toLocaleDateString()} –{" "}
              {new Date(r.dates.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {statusMap[r.status]}
            </p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
