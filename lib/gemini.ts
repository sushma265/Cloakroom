import { GoogleGenAI } from "@google/genai";

export const TEXT_MODEL = "gemini-2.5-flash";
export const IMAGE_MODEL = "gemini-2.5-flash-image";

let client: GoogleGenAI | null = null;

/**
 * Lazily creates the Gemini client. Returns null when no API key is
 * configured so route handlers can return a friendly setup message
 * instead of throwing during the demo.
 */
export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export function missingKeyResponse() {
  return Response.json(
    {
      ok: false,
      error:
        "No GEMINI_API_KEY found. Add your free Google AI Studio key to .env.local and restart the dev server to activate this feature.",
    },
    { status: 412 }
  );
}

export function errorResponse(message: string, status = 500) {
  return Response.json({ ok: false, error: message }, { status });
}
