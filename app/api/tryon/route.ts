import { Modality } from "@google/genai";
import { getGenAIClient, missingKeyResponse, errorResponse, IMAGE_MODEL } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ImagePayload {
  data: string; // base64, no data: prefix
  mimeType: string;
}

interface TryOnBody {
  personImage: ImagePayload;
  garmentImage: ImagePayload;
  garmentNote?: string;
}

export async function POST(req: Request) {
  const ai = getGenAIClient();
  if (!ai) return missingKeyResponse();

  let body: TryOnBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  if (!body?.personImage?.data || !body?.garmentImage?.data) {
    return errorResponse("Both a person photo and a garment photo are required.", 400);
  }

  const prompt = [
    "You are Cloakroom's virtual try-on engine.",
    "Image 1 is a photo of a person. Image 2 is a garment, laid flat or on a model.",
    "Generate a single new photorealistic image of the SAME person from image 1, wearing the garment from image 2.",
    "Preserve the person's face, body proportions, pose, and the original background as closely as possible.",
    "Drape the garment naturally on their body — respect fabric folds, shadows, and how it would actually fit their frame.",
    "Do not add any text, logos, or watermarks to the image.",
    body.garmentNote ? `Extra styling note from the user: ${body.garmentNote}` : "",
    "After the image, also write a short 2-sentence fit prediction: comment on likely fit (snug/true-to-size/loose), and one styling tip. Keep it under 45 words.",
  ]
    .filter(Boolean)
    .join(" ");

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: body.personImage.mimeType, data: body.personImage.data } },
            { inlineData: { mimeType: body.garmentImage.mimeType, data: body.garmentImage.data } },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    let image: ImagePayload | null = null;
    let note = "";

    for (const part of parts) {
      if (part.text) note += part.text;
      if (part.inlineData?.data) {
        image = {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType ?? "image/png",
        };
      }
    }

    if (!image) {
      return errorResponse(
        "The model didn't return an image this time — try a clearer, well-lit photo and a garment image with a plain background.",
        502
      );
    }

    return Response.json({ ok: true, image, note: note.trim() });
  } catch (err: any) {
    return errorResponse(err?.message ?? "Gemini request failed.", 500);
  }
}
