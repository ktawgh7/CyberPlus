import { NextResponse } from "next/server";
import { getJWKS } from "@/lib/jwt";

export async function GET() {
  try {
    const jwks = await getJWKS();
    return NextResponse.json(jwks, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate JWKS" }, { status: 500 });
  }
}

