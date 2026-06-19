import { NextResponse } from "next/server";

export async function GET() {
  const configured = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json({ configured });
}
