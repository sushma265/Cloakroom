import { geminiChatCompletion, friendlyGeminiError, missingGeminiKeyResponse, getGeminiKey } from "@/lib/gemini";
import { errorResponse } from "@/lib/api-utils";

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
  if (!getGeminiKey()) return missingGeminiKeyResponse();

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
    const raw = await geminiChatCompletion(
      [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      0.9
    );

    const cleaned = raw.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json({ ok: true, drop: parsed });
  } catch (err) {
    const { message, status } = friendlyGeminiError(err);
    return errorResponse(message, status);
  }
}
