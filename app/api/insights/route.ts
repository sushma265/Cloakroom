import { getGenAIClient, missingKeyResponse, errorResponse, TEXT_MODEL } from "@/lib/gemini";

export const runtime = "nodejs";

interface InsightsBody {
  metrics: {
    label: string;
    value: string | number;
  }[];
}

export async function POST(req: Request) {
  const ai = getGenAIClient();
  if (!ai) return missingKeyResponse();

  let body: InsightsBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  if (!body?.metrics?.length) {
    return errorResponse("Metrics are required.", 400);
  }

  const metricsText = body.metrics.map((m) => `- ${m.label}: ${m.value}`).join("\n");

  const prompt = `You are Cloakroom's ROI analytics assistant for a brand dashboard. A brand manager is looking at this week's metrics from running their campaigns on Cloakroom's AI rails:
${metricsText}

Write a tight executive summary for a fashion brand merchandiser: 2 sentences on what's working, 1 sentence flagging the single biggest risk or opportunity, and 1 short actionable recommendation. Plain text, no markdown, no headers, under 75 words total. Speak directly to "you".`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.6 },
    });

    return Response.json({ ok: true, summary: (response.text ?? "").trim() });
  } catch (err: any) {
    return errorResponse(err?.message ?? "Gemini request failed.", 500);
  }
}
