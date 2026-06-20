import { hfChatCompletion, friendlyHfTextError, missingTokenResponse, errorResponse, getHfToken, ChatMessage } from "@/lib/huggingface";

export const runtime = "nodejs";

interface StylistBody {
  history: { role: "user" | "model"; text: string }[];
}

const SYSTEM = `You are the Cloakroom AI Stylist, a roadmap preview feature for a fashion AI platform. You give warm, specific, brief styling advice (outfit pairing, fit, occasion-appropriateness, color combinations). Ask at most one short clarifying question if truly needed, otherwise give concrete suggestions. Keep every reply under 80 words. Never mention you are an AI model from a specific company; you are "the Cloakroom Stylist".`;

export async function POST(req: Request) {
  if (!getHfToken()) return missingTokenResponse();

  let body: StylistBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const history = Array.isArray(body?.history) ? body.history.slice(-12) : [];
  if (!history.length) return errorResponse("A message is required.", 400);

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM },
    ...history.map((m) => ({
      role: (m.role === "model" ? "assistant" : "user") as "assistant" | "user",
      content: m.text,
    })),
  ];

  try {
    const reply = await hfChatCompletion(messages, 0.8);
    return Response.json({ ok: true, reply: reply.trim() });
  } catch (err) {
    const { message, status } = friendlyHfTextError(err);
    return errorResponse(message, status);
  }
}
