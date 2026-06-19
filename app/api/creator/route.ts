import { getGenAIClient, missingKeyResponse, errorResponse, TEXT_MODEL } from "@/lib/gemini";

export const runtime = "nodejs";

interface CreatorBody {
  handle: string;
  productName: string;
  price: string;
  vibe: string;
  notes?: string;
}

const SYSTEM = `You are Cloakroom's Creator Studio copywriter. Creators turn a single piece of content into a shoppable drop. Given a creator's handle, a product, a price, and a vibe, produce ONE drop. Respond with ONLY raw JSON, no markdown fences, no preamble, matching exactly this shape:
{
  "dropTitle": "string, punchy, under 7 words",
  "caption": "string, 2 short sentences in the creator's voice, under 40 words total",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "affiliatePitch": "string, one sentence a creator could paste into a story sticker to drive clicks, under 20 words",
  "suggestedTake": "string, e.g. '12% commission' — a plausible take-rate framing for this kind of drop"
}`;

export async function POST(req: Request) {
  const ai = getGenAIClient();
  if (!ai) return missingKeyResponse();

  let body: CreatorBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  if (!body?.productName || !body?.handle) {
    return errorResponse("A creator handle and product name are required.", 400);
  }

  const userPrompt = `Creator handle: @${body.handle}
Product: ${body.productName}
Price: ${body.price || "not specified"}
Vibe / aesthetic: ${body.vibe || "everyday, approachable"}
Extra notes: ${body.notes || "none"}`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [
        { role: "user", parts: [{ text: `${SYSTEM}\n\n${userPrompt}` }] },
      ],
      config: { temperature: 0.9 },
    });

    const raw = (response.text ?? "").trim();
    const cleaned = raw.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json({ ok: true, drop: parsed });
  } catch (err: any) {
    return errorResponse(
      err?.message ?? "Gemini request failed or returned content that couldn't be parsed.",
      500
    );
  }
}
