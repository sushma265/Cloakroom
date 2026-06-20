import { errorResponse } from "@/lib/api-utils";
import { runHfTryOn, friendlyHfTryOnError } from "@/lib/hf-tryon";

export const runtime = "nodejs";
// Community Spaces can be slow to cold-start — give this one room to breathe.
export const maxDuration = 120;

interface ImagePayload {
  data: string;
  mimeType: string;
}

interface TryOnBody {
  personImage: ImagePayload;
  garmentImage: ImagePayload;
  garmentNote?: string;
}

export async function POST(req: Request) {
  let body: TryOnBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  if (!body?.personImage?.data || !body?.garmentImage?.data) {
    return errorResponse("Both a person photo and a garment photo are required.", 400);
  }

  try {
    const { data, mimeType } = await runHfTryOn(body.personImage, body.garmentImage, body.garmentNote ?? "");
    return Response.json({
      ok: true,
      image: { data, mimeType },
      note: body.garmentNote
        ? `Styled per your note: "${body.garmentNote}". Drape and fit are rendered by the IDM-VTON model.`
        : "Drape and fit are rendered by the IDM-VTON virtual try-on model.",
      provider: "huggingface",
    });
  } catch (err) {
    const { message, status } = friendlyHfTryOnError(err);
    return errorResponse(message, status);
  }
}
