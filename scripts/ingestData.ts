import 'dotenv/config';
import { getVectorStore, Property } from "../lib/vectorStore";
import offers from "../lib/data/offers.json";
import { Document } from "langchain/document";

async function main() {
  const vectorStore = await getVectorStore();

  const docs = (offers as Property[]).map((offer) => {
    const pageContent = `
      ${offer.type} in ${offer.location.city}, ${offer.location.district}, ${offer.location.neighborhood}.
      Price: ${offer.price}, Rooms: ${offer.number_of_rooms}, Bathrooms: ${offer.number_of_bathrooms}, 
      Square footage: ${offer.square_footage}, Garden: ${offer.garden_available ? "Yes" : "No"}, 
      Description: ${offer.description}, Amenities: ${offer.amenities.join(", ")}
    `;
    return new Document({
      pageContent,
      metadata: { ...offer }
    });
  });

  await vectorStore.addDocuments(docs);
  console.log("✅ Successfully ingested property data to Upstash Vector!");
}

main().catch((err) => {
  console.error("❌ Error ingesting data:", err);
}); 