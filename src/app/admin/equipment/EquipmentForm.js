"use client";
import React, { useState, useEffect } from "react";
import api from "../../../lib/api";

export default function EquipmentForm({ equipment, onSuccess, onCancel }) {
  const [name, setName] = useState(equipment?.name || "");
  const [description, setDescription] = useState(equipment?.description || "");
  const [category, setCategory] = useState(equipment?.category._id || "");
  const [brand, setBrand] = useState(equipment?.specifications.brand || "");
  const [model, setModel] = useState(equipment?.specifications.model || "");
  const [serialNumber, setSerialNumber] = useState(
    equipment?.specifications.serialNumber || ""
  );
  const [yearManufactured, setYearManufactured] = useState(
    equipment?.specifications.yearManufactured || ""
  );
  const [condition, setCondition] = useState(
    equipment?.specifications.condition || "good"
  );
  const [quantity, setQuantity] = useState(
    equipment?.availability.quantity || 1
  );
  const [status, setStatus] = useState(
    equipment?.availability.status || "available"
  );
  const [branch, setBranch] = useState(
    equipment?.availability.location.branch || ""
  );
  const [warehouse, setWarehouse] = useState(
    equipment?.availability.location.warehouse || ""
  );
  const [shelf, setShelf] = useState(
    equipment?.availability.location.shelf || ""
  );
  const [images, setImages] = useState(equipment?.media.images || []);
  const [documents, setDocuments] = useState(equipment?.media.documents || []);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    if (equipment) {
      setName(equipment.name);
      setDescription(equipment.description || "");
      setCategory(equipment.category._id);
      const specs = equipment.specifications;
      setBrand(specs.brand || "");
      setModel(specs.model || "");
      setSerialNumber(specs.serialNumber || "");
      setYearManufactured(specs.yearManufactured || "");
      setCondition(specs.condition || "good");
      const avail = equipment.availability;
      setQuantity(avail.quantity);
      setStatus(avail.status);
      setBranch(avail.location.branch || "");
      setWarehouse(avail.location.warehouse || "");
      setShelf(avail.location.shelf || "");
      setImages(equipment.media.images || []);
      setDocuments(equipment.media.documents || []);
    }
  }, [equipment]);

  const handleImageChange = (index, field, value) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    setImages(updated);
  };

  const addImage = () =>
    setImages([...images, { url: "", alt: "", isPrimary: false }]);
  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i));

  const handleDocChange = (index, field, value) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  };

  const addDoc = () =>
    setDocuments([...documents, { name: "", url: "", type: "manual" }]);
  const removeDoc = (i) =>
    setDocuments(documents.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category) {
      setError("Nazwa i kategoria są wymagane");
      return;
    }
    const payload = {
      name,
      description,
      category,
      specifications: {
        brand,
        model,
        serialNumber,
        yearManufactured: Number(yearManufactured),
        condition,
      },
      availability: {
        status,
        quantity: Number(quantity),
        location: { branch, warehouse, shelf },
      },
      media: { images, documents },
    };
    try {
      if (equipment) await api.put(`/equipment/${equipment._id}`, payload);
      else await api.post("/equipment", payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Błąd zapisu");
    }
  };

  const conditionMap = {
    new: "Nowy",
    excellent: "Bardzo dobry",
    good: "Dobry",
    fair: "Używany",
    poor: "Zły",
  };

  const statusMap = {
    available: "Dostępny",
    reserved: "Zarezerwowany",
    maintenance: "W serwisie",
    rented: "Wypożyczony",
    unavailable: "Niedostępny",
    retired: "Wycofany",
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-2xl space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {equipment ? "Edytuj sprzęt" : "Nowy sprzęt"}
        </h2>
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <label>
            <span>Nazwa</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Kategoria</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-2 py-1"
            >
              <option value="">-- wybierz --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label className="col-span-2">
            <span>Opis</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
        </div>

        <h3 className="font-semibold">Specyfikacje</h3>
        <div className="grid grid-cols-3 gap-4">
          <label>
            <span>Marka</span>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Model</span>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Nr seryjny</span>
            <input
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Rok produkcji</span>
            <input
              type="number"
              value={yearManufactured}
              onChange={(e) => setYearManufactured(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Stan</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border px-2 py-1"
            >
              {["new", "excellent", "good", "fair", "poor"].map((s) => (
                <option key={s} value={s}>
                  {conditionMap[s]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h3 className="font-semibold">Dostępność</h3>
        <div className="grid grid-cols-3 gap-4">
          <label>
            <span>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border px-2 py-1"
            >
              {[
                "available",
                "reserved",
                "rented",
                "maintenance",
                "retired",
              ].map((s) => (
                <option key={s} value={s}>
                  {statusMap[s]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Ilość</span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Oddział</span>
            <input
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Magazyn</span>
            <input
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
          <label>
            <span>Półka</span>
            <input
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              className="w-full border px-2 py-1"
            />
          </label>
        </div>

        <h3 className="font-semibold">Media – obrazy</h3>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="URL"
              value={img.url}
              onChange={(e) => handleImageChange(i, "url", e.target.value)}
              className="border px-2 py-1 flex-grow"
            />
            <input
              placeholder="Alt"
              value={img.alt}
              onChange={(e) => handleImageChange(i, "alt", e.target.value)}
              className="border px-2 py-1"
            />
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={img.isPrimary}
                onChange={(e) =>
                  handleImageChange(i, "isPrimary", e.target.checked)
                }
              />
              Główny
            </label>
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="text-red-600"
            >
              Usuń
            </button>
          </div>
        ))}
        <button type="button" onClick={addImage} className="text-blue-600">
          Dodaj obraz
        </button>

        <h3 className="font-semibold">Media – dokumenty</h3>
        {documents.map((doc, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder="Nazwa"
              value={doc.name}
              onChange={(e) => handleDocChange(i, "name", e.target.value)}
              className="border px-2 py-1"
            />
            <input
              placeholder="URL"
              value={doc.url}
              onChange={(e) => handleDocChange(i, "url", e.target.value)}
              className="border px-2 py-1 flex-grow"
            />
            <select
              value={doc.type}
              onChange={(e) => handleDocChange(i, "type", e.target.value)}
              className="border px-2 py-1"
            >
              {["manual", "warranty", "certificate"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeDoc(i)}
              className="text-red-600"
            >
              Usuń
            </button>
          </div>
        ))}
        <button type="button" onClick={addDoc} className="text-blue-600">
          Dodaj dokument
        </button>

        <div className="flex justify-end gap-2 mt-4">
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
