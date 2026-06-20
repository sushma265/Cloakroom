import { NextResponse } from "next/server";

export async function GET() {
  const configured = Boolean(process.env.HF_TOKEN);
  return NextResponse.json({ configured });
}
