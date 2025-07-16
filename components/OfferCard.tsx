"use client";
import React from "react";

interface OfferCardProps {
  offer: {
    id: string;
    type: string;
    location: {
      city: string;
      district: string;
      neighborhood: string;
    };
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
    title: string;
  };
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 18, margin: 8, maxWidth: 340 }}>
      <img src={offer.image_url} alt={offer.type} style={{ width: "100%", borderRadius: 8, marginBottom: 10 }} />
      <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>{offer.title}</div>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</div>
      <div style={{ color: "#2563eb", fontWeight: 600, marginBottom: 4 }}>{offer.location.city}, {offer.location.district}, {offer.location.neighborhood}</div>
      <div style={{ marginBottom: 4 }}><b>Price:</b> {offer.price.toLocaleString()} PLN</div>
      <div style={{ marginBottom: 4 }}><b>Rooms:</b> {offer.number_of_rooms} | <b>Bathrooms:</b> {offer.number_of_bathrooms}</div>
      <div style={{ marginBottom: 4 }}><b>Square footage:</b> {offer.square_footage} sqft</div>
      {offer.garden_available && (
        <div style={{ marginBottom: 4 }}><b>Garden:</b> Yes{offer.garden_size_sqft ? `, ${offer.garden_size_sqft} sqft` : ""}</div>
      )}
      <div style={{ marginBottom: 6 }}><b>Description:</b> {offer.description}</div>
      <div style={{ marginBottom: 8 }}><b>Amenities:</b> {offer.amenities.join(", ")}</div>
      {offer.listing_url && (
        <a
          href={offer.listing_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "8px 20px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 15,
            transition: "background 0.15s"
          }}
        >
          View Listing
        </a>
      )}
    </div>
  );
};

export default OfferCard; 