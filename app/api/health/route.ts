import { NextResponse } from "next/server";

export async function GET() {
  // tryon (image generation) runs on Hugging Face; everything else
  // (creator copy, stylist chat, ROI insights) runs on Gemini 2.5 Flash.
  const hf = Boolean(process.env.HF_TOKEN);
  const gemini = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json({
    hf,
    gemini,
    configured: hf && gemini,
  });
}
