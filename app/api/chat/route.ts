import { NextRequest } from "next/server";
import { getVectorStore } from "@/lib/vectorStore";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  try {
    // TEMP: Hardcoded response for testing
    const response = `Here are two property offers I recommend:

Spacious Family House with Large Garden in Sadyba, Mokotow
Price: 1,200,000 PLN
Rooms: 6
Bathrooms: 3
Square Footage: 340 sqft
Garden: Yes (300 sqft)
Description: Nice house with a chimney.
Link: [View Offer](https://example.com/offer1)

Modern Apartment in the Heart of Kazimierz, Krakow
Price: 980,000 PLN
Rooms: 6
Bathrooms: 2
Square Footage: 160 sqft
Garden: Yes (200 sqft)
Description: Renewed two years ago. Available to see only this month!
Amenities: Garden, Chimney
Link: [View Offer](https://example.com/offer2)`;
    const offers = [
      {
        title: "Spacious Family House with Large Garden in Sadyba, Mokotow",
        type: "House",
        location: "Zalesie",
        price: 1200000,
        rooms: 6,
        bathrooms: 3,
        square_footage: 340,
        garden: true,
        garden_size: 300,
        description: "Nice house with a chimney.",
        link: "https://example.com/offer1"
      },
      {
        title: "Modern Apartment in the Heart of Kazimierz, Krakow",
        type: "Apartment",
        location: "Wilkowyja",
        price: 980000,
        rooms: 6,
        bathrooms: 2,
        square_footage: 160,
        garden: true,
        garden_size: 200,
        description: "Renewed two years ago. Available to see only this month!",
        amenities: ["Garden", "Chimney"],
        link: "https://example.com/offer2"
      }
    ];
    return new Response(
      JSON.stringify({ response, offers }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ response: "Sorry, something went wrong.", offers: [] }),
      { status: 500 }
    );
  }
}