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
    setShowEditModal(true);
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
      {/* EditOfferModal will be implemented and shown here */}
      {showEditModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[400px] max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Offer</h2>
            {/* TODO: EditOfferModal form goes here */}
            <button className="mt-4 px-4 py-2 bg-gray-400 text-white rounded font-bold" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage; 