const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Every text AI feature (storefront copy, ROI insights, stylist chat) runs
// on this model. Configurable via env in case Google retires/renames it —
// swap GEMINI_MODEL in .env.local.
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function getGeminiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

export function missingGeminiKeyResponse() {
  return Response.json(
    {
      ok: false,
      error:
        "No GEMINI_API_KEY found. Add a free Gemini API key to .env.local and restart the dev server to activate this feature.",
    },
    { status: 412 }
  );
}

/** Calls the Gemini API (generateContent) using a plain fetch — no SDK,
 *  mirrors the shape of the old hfChatCompletion helper so the API routes
 *  barely had to change. */
export async function geminiChatCompletion(messages: ChatMessage[], temperature = 0.7): Promise<string> {
  const key = getGeminiKey();
  if (!key) {
    const err: any = new Error("GEMINI_API_KEY not configured");
    err.status = 412;
    throw err;
  }

  const systemText = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");

  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: { temperature },
  };
  if (systemText) {
    body.system_instruction = { parts: [{ text: systemText }] };
  }

  const res = await fetch(`${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    const err: any = new Error(bodyText || `Gemini request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();

  if (data?.promptFeedback?.blockReason) {
    const err: any = new Error(`Gemini blocked this request: ${data.promptFeedback.blockReason}`);
    err.status = 400;
    throw err;
  }

  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? "").join("");
}

export function friendlyGeminiError(err: unknown): { message: string; status: number } {
  const raw = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status ?? 500;

  if (status === 412) return { status: 412, message: "GEMINI_API_KEY not configured." };
  if (status === 401 || status === 403) {
    return {
      status: 401,
      message: "Gemini rejected this API key. Check GEMINI_API_KEY in .env.local at aistudio.google.com/apikey.",
    };
  }
  if (status === 429 || /rate.?limit|quota/i.test(raw)) {
    return {
      status: 429,
      message: "Hit Gemini's free-tier rate limit. Wait a few seconds and try again.",
    };
  }
  if (status === 404 || /not.+found/i.test(raw)) {
    return {
      status: 502,
      message: `The model "${GEMINI_MODEL}" isn't available for this key. Try setting GEMINI_MODEL in .env.local to another Gemini model id.`,
    };
  }
  if (status === 400 || /blocked/i.test(raw)) {
    return {
      status: 400,
      message: "Gemini couldn't process that request (it may have been blocked by safety filters). Try rephrasing.",
    };
  }
  return { status: 500, message: "Gemini request failed. Please try again in a moment." };
}
