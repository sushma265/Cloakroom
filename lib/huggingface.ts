const HF_ROUTER = "https://router.huggingface.co/v1";

// Configurable via env in case this model gets retired or is temporarily
// unavailable on free-tier providers — swap HF_TEXT_MODEL in .env.local.
export const HF_TEXT_MODEL = process.env.HF_TEXT_MODEL || "openai/gpt-oss-120b";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function getHfToken(): string | null {
  return process.env.HF_TOKEN || null;
}

export function missingTokenResponse() {
  return Response.json(
    {
      ok: false,
      error:
        "No HF_TOKEN found. Add a free Hugging Face access token to .env.local and restart the dev server to activate this feature.",
    },
    { status: 412 }
  );
}

export function errorResponse(message: string, status = 500) {
  return Response.json({ ok: false, error: message }, { status });
}

/** Calls the Hugging Face Inference Providers router (OpenAI-compatible chat completions). */
export async function hfChatCompletion(messages: ChatMessage[], temperature = 0.7): Promise<string> {
  const token = getHfToken();
  if (!token) {
    const err: any = new Error("HF_TOKEN not configured");
    err.status = 412;
    throw err;
  }

  const res = await fetch(`${HF_ROUTER}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: HF_TEXT_MODEL, messages, temperature }),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    const err: any = new Error(bodyText || `Hugging Face router request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

export function friendlyHfTextError(err: unknown): { message: string; status: number } {
  const raw = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status ?? 500;

  if (status === 412) return { status: 412, message: "HF_TOKEN not configured." };
  if (status === 401 || status === 403) {
    return {
      status: 401,
      message: "Hugging Face rejected this token. Check HF_TOKEN in .env.local — it needs the 'Make calls to Inference Providers' permission.",
    };
  }
  if (status === 429 || /rate.?limit/i.test(raw)) {
    return {
      status: 429,
      message: "Hit Hugging Face's free-tier rate limit. Wait a few seconds and try again.",
    };
  }
  if (status === 404 || /not.+found|no.+provider/i.test(raw)) {
    return {
      status: 502,
      message: `The model "${HF_TEXT_MODEL}" isn't currently available on a free provider. Try setting HF_TEXT_MODEL in .env.local to a different model id (e.g. "Qwen/Qwen2.5-7B-Instruct").`,
    };
  }
  return { status: 500, message: "Hugging Face request failed. Please try again in a moment." };
}
