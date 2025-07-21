import { OpenAIEmbeddings } from "@langchain/openai";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { Index } from "@upstash/vector";
import { Document } from "langchain/document";

export type Property = {
  id: string;
  title: string;
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
};

let vectorStore: UpstashVectorStore | null = null;

export async function getVectorStore() {
  if (vectorStore) return vectorStore;

  const embeddings = new OpenAIEmbeddings();
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });
  vectorStore = new UpstashVectorStore(embeddings, { index });

  return vectorStore;
}

export async function addDocumentToVectorStore(property: Property) {
  const vectorStore = await getVectorStore();
  const pageContent = `
    ${property.type} in ${property.location.city}, ${property.location.district}, ${property.location.neighborhood}.
    Price: ${property.price}, Rooms: ${property.number_of_rooms}, Bathrooms: ${property.number_of_bathrooms},
    Square footage: ${property.square_footage}, Garden: ${property.garden_available ? "Yes" : "No"},
    Description: ${property.description}, Amenities: ${property.amenities.join(", ")}
  `;
  const doc = new Document({
    pageContent,
    metadata: { ...property },
    id: property.id // Ensure the vector ID matches the property ID
  });
  await vectorStore.addDocuments([doc]);
}

export async function listAllOffersFromVectorStore(): Promise<Property[]> {
  // Use the Upstash Index directly for range scan
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });
  let offers: Property[] = [];
  let cursor = "";
  do {
    const res = await index.range({
      cursor,
      limit: 100,
      includeMetadata: true,
      includeData: false,
    });
    // Only include vectors with valid metadata for Property
    offers = offers.concat(
      res.vectors
        .filter((v: { metadata?: Record<string, unknown> }) => v.metadata && typeof v.metadata.id === 'string' && typeof v.metadata.title === 'string')
        .map((v: { id: string; metadata?: Record<string, unknown> }) => ({
          ...(v.metadata as Property),
          vectorId: v.id
        }))
    );
    cursor = res.nextCursor;
  } while (cursor);
  return offers;
} 