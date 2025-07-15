"use client";
import React, { useState } from "react";

const initialState = {
  type: "house",
  city: "",
  district: "",
  neighborhood: "",
  price: "",
  number_of_rooms: "",
  number_of_bathrooms: "",
  square_footage: "",
  garden_available: false,
  garden_size_sqft: "",
  description: "",
  amenities: "",
  image_url: "",
  listing_url: ""
};

const AgentOfferForm: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm(f => ({
      ...f,
      [name]: fieldValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const payload = {
        type: form.type,
        location: {
          city: form.city,
          district: form.district,
          neighborhood: form.neighborhood
        },
        price: Number(form.price),
        number_of_rooms: Number(form.number_of_rooms),
        number_of_bathrooms: Number(form.number_of_bathrooms),
        square_footage: Number(form.square_footage),
        garden_available: form.garden_available,
        garden_size_sqft: form.garden_size_sqft ? Number(form.garden_size_sqft) : undefined,
        description: form.description,
        amenities: form.amenities.split(",").map(a => a.trim()).filter(Boolean),
        image_url: form.image_url,
        listing_url: form.listing_url
      };
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to add offer");
      setSuccess("Offer added successfully!");
      setForm(initialState);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Add New Property Offer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <label className="text-gray-700"><span className="font-bold">Type</span>
            <select name="type" value={form.type} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
            </select>
          </label>
          <label className="text-gray-700"><span className="font-bold">City</span>
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700"><span className="font-bold">District</span>
            <input name="district" value={form.district} onChange={handleChange} placeholder="District" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700"><span className="font-bold">Neighborhood</span>
            <input name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="Neighborhood" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700"><span className="font-bold">Price</span>
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700"><span className="font-bold">Number of rooms</span>
            <input name="number_of_rooms" value={form.number_of_rooms} onChange={handleChange} placeholder="Number of rooms" type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
        </div>
        <div className="flex flex-col gap-4">
          <label className="text-gray-700"><span className="font-bold">Number of bathrooms</span>
            <input name="number_of_bathrooms" value={form.number_of_bathrooms} onChange={handleChange} placeholder="Number of bathrooms" type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700"><span className="font-bold">Square footage</span>
            <input name="square_footage" value={form.square_footage} onChange={handleChange} placeholder="Square footage" type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700 inline-flex items-center gap-2"><input name="garden_available" type="checkbox" checked={form.garden_available} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="font-bold">Garden available</span></label>
          <label className="text-gray-700"><span className="font-bold">Garden size (sqft)</span>
            <input name="garden_size_sqft" value={form.garden_size_sqft} onChange={handleChange} placeholder="Garden size (sqft)" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700"><span className="font-bold">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
          <label className="text-gray-700"><span className="font-bold">Amenities (comma separated)</span>
            <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="text-gray-700"><span className="font-bold">Image URL</span>
          <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </label>
        <label className="text-gray-700"><span className="font-bold">Offer URL</span>
          <input name="listing_url" value={form.listing_url} onChange={handleChange} placeholder="Offer URL" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add Offer"}
      </button>
      {success && (
        <div className="text-green-600 mt-4 text-center">
          {success}
        </div>
      )}
      {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      <a href="/" className="block mt-6 text-center text-blue-600 underline font-semibold hover:text-blue-800 transition">← Back to main page</a>
    </form>
  );
};

export default AgentOfferForm; 