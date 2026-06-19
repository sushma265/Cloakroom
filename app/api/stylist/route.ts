import { getGenAIClient, missingKeyResponse, errorResponse, TEXT_MODEL } from "@/lib/gemini";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface StylistBody {
  history: ChatMessage[];
}

const SYSTEM = `You are the Cloakroom AI Stylist, a roadmap preview feature for a fashion AI platform. You give warm, specific, brief styling advice (outfit pairing, fit, occasion-appropriateness, color combinations). Ask at most one short clarifying question if truly needed, otherwise give concrete suggestions. Keep every reply under 80 words. Never mention you are an AI model from a specific company; you are "the Cloakroom Stylist".`;

export async function POST(req: Request) {
  const ai = getGenAIClient();
  if (!ai) return missingKeyResponse();

  let body: StylistBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const history = Array.isArray(body?.history) ? body.history.slice(-12) : [];
  if (!history.length) return errorResponse("A message is required.", 400);

  const contents = [
    { role: "user" as const, parts: [{ text: SYSTEM }] },
    { role: "model" as const, parts: [{ text: "Understood — I'm the Cloakroom Stylist, ready to help." }] },
    ...history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
  ];

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents,
      config: { temperature: 0.8 },
    });

    return Response.json({ ok: true, reply: (response.text ?? "").trim() });
  } catch (err: any) {
    return errorResponse(err?.message ?? "Gemini request failed.", 500);
  }
}
