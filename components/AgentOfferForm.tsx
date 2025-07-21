"use client";
import React, { useState } from "react";

const initialState = {
  title: "",
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
  const [form, setForm] = useState({
    title: "",
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
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
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
        title: form.title,
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
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : String(error) || "Unknown error");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select id="type" name="type" value={form.type} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input id="city" name="city" value={form.city} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
          <input id="district" name="district" value={form.district} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Neighborhood</label>
          <input id="neighborhood" name="neighborhood" value={form.neighborhood} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input id="price" name="price" value={form.price} onChange={handleChange} type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="number_of_rooms" className="block text-sm font-medium text-gray-700">Number of rooms</label>
          <input id="number_of_rooms" name="number_of_rooms" value={form.number_of_rooms} onChange={handleChange} type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="number_of_bathrooms" className="block text-sm font-medium text-gray-700">Number of bathrooms</label>
          <input id="number_of_bathrooms" name="number_of_bathrooms" value={form.number_of_bathrooms} onChange={handleChange} type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700">Square footage</label>
          <input id="square_footage" name="square_footage" value={form.square_footage} onChange={handleChange} type="number" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input id="garden_available" name="garden_available" type="checkbox" checked={form.garden_available} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="garden_available" className="text-sm font-medium text-gray-700">Garden available</label>
        </div>
        <div>
          <label htmlFor="garden_size_sqft" className="block text-sm font-medium text-gray-700">Garden size (sqft)</label>
          <input id="garden_size_sqft" name="garden_size_sqft" value={form.garden_size_sqft} onChange={handleChange} type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
          <input id="amenities" name="amenities" value={form.amenities} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input id="image_url" name="image_url" value={form.image_url} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="listing_url" className="block text-sm font-medium text-gray-700">Offer URL</label>
          <input id="listing_url" name="listing_url" value={form.listing_url} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
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