// This client is now scoped to the one remaining Hugging Face–backed
// feature: the virtual try-on image render in lib/hf-tryon.ts. All text
// AI features (creator copy, stylist chat, ROI insights) run on Gemini
// 2.5 Flash instead — see lib/gemini.ts.

export function getHfToken(): string | null {
  return process.env.HF_TOKEN || null;
}

export function missingTokenResponse() {
  return Response.json(
    {
      ok: false,
      error:
        "No HF_TOKEN found. Add a free Hugging Face access token to .env.local and restart the dev server to activate the virtual try-on feature.",
    },
    { status: 412 }
  );
}
