import { NextRequest } from "next/server";
import { addDocumentToVectorStore, Property } from "@/lib/vectorStore";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOffers = Array.isArray(body) ? body : [body];
    const offersWithId = newOffers.map((offer: any) => ({
      ...offer,
      id: offer.id || generateId(),
    }));
    for (const offer of offersWithId) {
      if (!offer.title) throw new Error('Offer title is required');
      await addDocumentToVectorStore(offer);
    }
    return new Response(JSON.stringify({ success: true, offers: offersWithId }), { status: 200 });
  } catch (err: any) {
    console.error("[ERROR] /api/offers POST:", err);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), { status: 500 });
  }
} 