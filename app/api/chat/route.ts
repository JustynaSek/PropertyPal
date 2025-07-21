import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getVectorStore } from '@/lib/vectorStore';
import { Document } from '@langchain/core/documents';

// Initialize OpenAI client
const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log("[DEBUG] Incoming message:", message);

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const vectorStore = await getVectorStore();
    const retrievedDocs: Document[] = await vectorStore.similaritySearch(message, 5);
    console.log("[DEBUG] Retrieved docs:", retrievedDocs);

    const formattedRetrievedDocuments = retrievedDocs.length > 0
      ? retrievedDocs.map(doc => {
          const propertyId = doc.metadata.id;
          // Ensure pageContent is clean and ready for parsing by renderAssistantMessage
          // The pageContent should already be in a "Key: Value" format from vectorStore.ts
          return `${doc.pageContent}\nLink: [View Offer](https://example.com/offers/${propertyId})`;
        }).join('\n\n--- Offer Separator ---\n\n')
      : "No relevant properties were retrieved from the database based on the current query.";

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `You are PropertyPal, an expert real estate agent. Your primary goal is to help users find suitable houses and apartments from the provided list of offers. You are friendly, helpful, and professional.

        **CRITICAL INSTRUCTIONS:**
        1.  **Source of Truth:** You MUST use ONLY the "Available Properties (Context)" provided below. Do NOT use any external information or make up details.
        2.  **Matching Logic & Persuasion:** Carefully analyze the user's preferences from their message and compare them against the details of *each* property in the provided context. For every property you recommend, you MUST provide a concise, compelling explanation (1-3 sentences) *why* this specific offer is suitable for the user, directly linking its features to their stated preferences. Be persuasive, like a real estate agent trying to convince a client.
        3.  **Output Format:** For each recommended property, present its details in a clear, user-friendly format. Each detail should be on a new line, starting with the property name (e.g., "Type:", "Location:", "Price:"). DO NOT use Markdown bolding (like **) in your output for these titles; the frontend will handle the styling.
        4.  **Link Inclusion:** For every recommended property, include the link provided in the context. Present it as "Link: [View Offer](URL_HERE)".
        5.  **Garden Details:** If a property has a garden, explicitly mention its size (e.g., "Garden: Yes (1500 sq ft)").
        6.  **No Matches Found:** If, after reviewing ALL properties in the "Available Properties (Context)", you genuinely cannot find any suitable offers that match the user's preferences, politely state that no matching offers were found within the current listings and ask if they have other preferences.
        7.  **Off-Topic Guardrail:** If the user asks a question that is NOT related to finding real estate offers (e.g., general knowledge, personal opinions, or tasks outside real estate recommendations), you MUST politely decline to answer and redirect them back to finding properties. For example, "I am PropertyPal, your real estate assistant. I can only help you with finding properties. How can I assist you with your property search today?"
        8.  **IMPORTANT: After your human-readable response, output a JSON array of the recommended offer IDs (from the context) in the following format, on a new line by itself:**
        \`\`\`json
        { "recommended_offer_ids": ["id1", "id2", ...] }
        \`\`\`
        This must be valid JSON and must appear after your main response, so the system can extract which offers you actually recommended.
        `,
      },
      {
        role: "user",
        content: `
        My property preferences are: "${message}".

        Please review the following properties and list any that match my criteria. For each match, explain why it's a great fit for me. If you find no matches, inform me politely.

        ---
        Available Properties (Context - sorted by relevance):
        ${formattedRetrievedDocuments}
        ---

        Recommendations:
        `,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.5,
      max_tokens: 800,
    });

    const assistantResponse = completion.choices[0].message?.content || "I apologize, I couldn't process that request.";
    console.log("[DEBUG] OpenAI response:", assistantResponse);

    // Try to extract recommended_offer_ids from the LLM response
    let recommendedOfferIds: string[] = [];
    const match = assistantResponse.match(/```json\s*({[\s\S]*?})\s*```/);
    if (match) {
      try {
        const json = JSON.parse(match[1]);
        if (Array.isArray(json.recommended_offer_ids)) {
          recommendedOfferIds = json.recommended_offer_ids;
        }
      } catch (e) {
        console.error('[ERROR] Failed to parse recommended_offer_ids JSON:', e);
      }
    }

    // Remove the JSON block from the assistant response before sending to the frontend
    const cleanedResponse = assistantResponse.replace(/```json[\s\S]*?```/, '').trim();

    // Always include offers array in the response, but only those recommended by the LLM if possible
    let offers: any[] = [];
    if (recommendedOfferIds.length > 0) {
      offers = retrievedDocs.filter(doc => recommendedOfferIds.includes(doc.metadata.id)).map(doc => ({
        id: doc.metadata.id,
        title: doc.metadata.title || '',
        type: doc.metadata.type || '',
        location: doc.metadata.location || '',
        price: doc.metadata.price || '',
        rooms: doc.metadata.rooms || '',
        bathrooms: doc.metadata.bathrooms || '',
        square_footage: doc.metadata.square_footage || '',
        garden: doc.metadata.garden || false,
        garden_size: doc.metadata.garden_size || '',
        description: doc.metadata.description || '',
        amenities: doc.metadata.amenities || [],
        link: `https://example.com/offers/${doc.metadata.id}`
      }));
    } else {
      offers = retrievedDocs.length > 0
        ? retrievedDocs.map(doc => ({
            id: doc.metadata.id,
            title: doc.metadata.title || '',
            type: doc.metadata.type || '',
            location: doc.metadata.location || '',
            price: doc.metadata.price || '',
            rooms: doc.metadata.rooms || '',
            bathrooms: doc.metadata.bathrooms || '',
            square_footage: doc.metadata.square_footage || '',
            garden: doc.metadata.garden || false,
            garden_size: doc.metadata.garden_size || '',
            description: doc.metadata.description || '',
            amenities: doc.metadata.amenities || [],
            link: `https://example.com/offers/${doc.metadata.id}`
          }))
        : [];
    }

    return NextResponse.json({ response: cleanedResponse, offers });

  } catch (error) {
    console.error('[ERROR] Chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}