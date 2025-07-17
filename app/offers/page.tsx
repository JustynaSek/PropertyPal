"use client";
import React, { useEffect, useState } from "react";

interface Offer {
  vectorId: string; // Upstash vector's UUID
  id: string;
  title: string;
  type: string;
  location: { city: string; district: string; neighborhood: string };
  price: number;
  number_of_rooms: number;
  number_of_bathrooms: number;
  square_footage: number;
  garden_available: boolean;
  garden_size_sqft?: number;
  description: string;
  amenities: string[];
  image_url: string;
  listing_url?: string;
}

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Offer | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/offers");
        if (!res.ok) throw new Error("Failed to fetch offers");
        const data = await res.json();
        setOffers(data.offers || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setEditForm({ ...offer });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editForm) return;
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setEditForm((prev) =>
      prev ? {
        ...prev,
        [name]: fieldValue
      } : null
    );
  };

  const handleEditFormArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm((prev) =>
      prev ? {
        ...prev,
        [name]: value.split(",").map((v) => v.trim()).filter(Boolean)
      } : null
    );
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    setEditLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/offers/${editForm.vectorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error("Failed to update offer");
      const updated = await res.json();
      setOffers((prev) => prev.map((o) => o.vectorId === editForm.vectorId ? updated.offer : o));
      setShowEditModal(false);
      setSelectedOffer(null);
      setEditForm(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (offer: Offer) => {
    if (!window.confirm(`Are you sure you want to delete offer: ${offer.title}?`)) return;
    try {
      const res = await fetch(`/api/offers/${offer.vectorId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete offer");
      setOffers((prev) => prev.filter((o) => o.vectorId !== offer.vectorId));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Offers List</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Location</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.vectorId} className="border-t">
                <td className="p-2 font-semibold">{offer.title}</td>
                <td className="p-2">{offer.type}</td>
                <td className="p-2">{offer.location.city}, {offer.location.district}, {offer.location.neighborhood}</td>
                <td className="p-2">{offer.price.toLocaleString()} PLN</td>
                <td className="p-2">
                  <div className="flex gap-2 items-center">
                    {offer.listing_url && (
                      <a
                        href={offer.listing_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800 transition"
                        title="View Listing"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        View
                      </a>
                    )}
                    <button
                      className="inline-flex items-center px-2 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-indigo-100 rounded transition"
                      onClick={() => handleEdit(offer)}
                      title="Edit Offer"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"/></svg>
                      Edit
                    </button>
                    <button
                      className="inline-flex items-center px-2 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded transition"
                      onClick={() => handleDelete(offer)}
                      title="Delete Offer"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[400px] max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Offer</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input type="text" name="title" value={editForm.title} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Title" required />
              <input type="text" name="type" value={editForm.type} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Type" required />
              <input type="text" name="city" value={editForm.location.city} onChange={e => setEditForm(f => f ? ({ ...f, location: { ...f.location, city: e.target.value } }) : null)} className="w-full border p-2 rounded" placeholder="City" required />
              <input type="text" name="district" value={editForm.location.district} onChange={e => setEditForm(f => f ? ({ ...f, location: { ...f.location, district: e.target.value } }) : null)} className="w-full border p-2 rounded" placeholder="District" required />
              <input type="text" name="neighborhood" value={editForm.location.neighborhood} onChange={e => setEditForm(f => f ? ({ ...f, location: { ...f.location, neighborhood: e.target.value } }) : null)} className="w-full border p-2 rounded" placeholder="Neighborhood" required />
              <input type="number" name="price" value={editForm.price} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Price" required />
              <input type="number" name="number_of_rooms" value={editForm.number_of_rooms} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Number of Rooms" required />
              <input type="number" name="number_of_bathrooms" value={editForm.number_of_bathrooms} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Number of Bathrooms" required />
              <input type="number" name="square_footage" value={editForm.square_footage} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Square Footage" required />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="garden_available" checked={editForm.garden_available} onChange={handleEditFormChange} />
                Garden Available
              </label>
              <input type="number" name="garden_size_sqft" value={editForm.garden_size_sqft || ""} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Garden Size (sqft)" />
              <textarea name="description" value={editForm.description} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Description" required />
              <input type="text" name="amenities" value={editForm.amenities.join(", ")} onChange={handleEditFormArrayChange} className="w-full border p-2 rounded" placeholder="Amenities (comma separated)" />
              <input type="text" name="image_url" value={editForm.image_url} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Image URL" />
              <input type="text" name="listing_url" value={editForm.listing_url || ""} onChange={handleEditFormChange} className="w-full border p-2 rounded" placeholder="Listing URL" />
              <div className="flex gap-2 mt-4">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</button>
                <button type="button" className="px-4 py-2 bg-gray-400 text-white rounded font-bold" onClick={() => { setShowEditModal(false); setSelectedOffer(null); setEditForm(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage; 