import { NextRequest } from "next/server";

// The param is now vectorId, not property id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vectorId = params.id;
    console.log('[DELETE] Vector id:', vectorId);
    if (!vectorId) {
      console.error('[DELETE] Missing vector id');
      return new Response(JSON.stringify({ error: "Missing vector id" }), { status: 400 });
    }
    const index = new (await import("@upstash/vector")).Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    });
    const result = await index.delete({ ids: [vectorId] });
    console.log('[DELETE] Upstash delete result:', result);
    return new Response(JSON.stringify({ success: true, deleted: result.deleted }), { status: 200 });
  } catch (error: unknown) {
    const errMsg = (error instanceof Error) ? error.message : String(error);
    console.error('[DELETE] Error:', error);
    return new Response(JSON.stringify({ error: errMsg || "Unknown error" }), { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vectorId = params.id;
    if (!vectorId) {
      return new Response(JSON.stringify({ error: "Missing vector id" }), { status: 400 });
    }
    const body = await req.json();
    const index = new (await import("@upstash/vector")).Index({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    });
    // Only update metadata, not data/embedding
    await index.update({ id: vectorId, metadata: { ...body } });
    return new Response(JSON.stringify({ success: true, offer: { ...body, vectorId } }), { status: 200 });
  } catch (error: unknown) {
    const errMsg = (error instanceof Error) ? error.message : String(error);
    console.error('[PUT] Error:', error);
    return new Response(JSON.stringify({ error: errMsg || "Unknown error" }), { status: 500 });
  }
} 