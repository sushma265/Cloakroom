import { Client } from "@gradio/client";
import { getHfToken } from "./huggingface";

// A duplicate-able, well-known virtual try-on Space. Configurable via env
// since community Spaces can change their API shape or go offline —
// swap HF_TRYON_SPACE in .env.local if this one is unavailable.
export const HF_TRYON_SPACE = process.env.HF_TRYON_SPACE || "yisol/IDM-VTON";

export interface TryOnImageInput {
  data: string; // base64, no data: prefix
  mimeType: string;
}

function toBlob(img: TryOnImageInput): Blob {
  const buffer = Buffer.from(img.data, "base64");
  return new Blob([buffer], { type: img.mimeType || "image/png" });
}

/** Best-effort extraction — community Spaces return file results in a few
 *  different shapes depending on Gradio version, so we check the common ones. */
function extractImageUrl(item: any): string | null {
  if (!item) return null;
  if (typeof item === "string") return item;
  if (item.url) return item.url;
  if (item.path && item.url === undefined && typeof item.path === "string" && item.path.startsWith("http")) {
    return item.path;
  }
  if (item.image?.url) return item.image.url;
  if (item.value?.url) return item.value.url;
  return null;
}

export interface TryOnRunResult {
  imageUrl: string;
}

export async function runHfTryOn(
  person: TryOnImageInput,
  garment: TryOnImageInput,
  garmentDescription: string
): Promise<TryOnRunResult> {
  const token = getHfToken();
  const client = await Client.connect(HF_TRYON_SPACE, token ? { token: token as `hf_${string}` } : undefined);

  const result = await client.predict("/tryon", {
    dict: { background: toBlob(person), layers: [], composite: null },
    garm_img: toBlob(garment),
    garment_des: garmentDescription || "a garment",
    is_checked: true,
    is_checked_crop: false,
    denoise_steps: 30,
    seed: 42,
  });

  const data = (result as any)?.data;
  const imageUrl = extractImageUrl(Array.isArray(data) ? data[0] : data);

  if (!imageUrl) {
    const err: any = new Error("The try-on Space returned an unexpected response shape.");
    err.status = 502;
    throw err;
  }

  return { imageUrl };
}

export function friendlyHfTryOnError(err: unknown): { message: string; status: number } {
  const raw = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status ?? 500;

  if (/queue|busy|GPU|quota/i.test(raw)) {
    return {
      status: 503,
      message:
        "The free try-on Space is busy on its shared community GPU queue right now. Wait a moment and try again, or duplicate the Space under your own account for a private queue (see README).",
    };
  }
  if (/Method Not Allowed|404/i.test(raw)) {
    return {
      status: 502,
      message: `The try-on Space's API shape may have changed. Check ${HF_TRYON_SPACE} on huggingface.co (the "View API" button on the Space) and update lib/hf-tryon.ts if needed.`,
    };
  }
  return {
    status: status >= 400 && status < 600 ? status : 500,
    message: "The virtual try-on Space failed to respond. It may be cold-starting — wait ~30s and try again.",
  };
}
