import { NextRequest } from "next/server";
import { addDocumentToVectorStore, listAllOffersFromVectorStore, Property } from "@/lib/vectorStore";
// import offersData from "@/lib/data/offers.json";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function GET() {
  try {
    const offers = await listAllOffersFromVectorStore();
    return new Response(JSON.stringify({ offers }), { status: 200 });
  } catch (error: unknown) {
    const errMsg = (error instanceof Error) ? error.message : String(error);
    return new Response(JSON.stringify({ error: errMsg || "Unknown error" }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOffers: Property[] = Array.isArray(body) ? body : [body];
    const offersWithId: Property[] = newOffers.map((offer) => ({
      ...offer,
      id: offer.id || generateId(),
    }));
    for (const offer of offersWithId) {
      if (!offer.title) throw new Error('Offer title is required');
      await addDocumentToVectorStore(offer);
    }
    return new Response(JSON.stringify({ success: true, offers: offersWithId }), { status: 200 });
  } catch (error: unknown) {
    const errMsg = (error instanceof Error) ? error.message : String(error);
    console.error("[ERROR] /api/offers POST:", error);
    return new Response(JSON.stringify({ error: errMsg || "Unknown error" }), { status: 500 });
  }
} 