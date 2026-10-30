import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPasskeyAuthenticationOptions } from "@/lib/passkey";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    let userId: string | undefined = undefined;

    if (email) {
      const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (user) userId = user.id;
    }

    const options = await getPasskeyAuthenticationOptions(userId);
    return NextResponse.json(options);
  } catch (err: any) {
    console.error("Passkey login options error:", err);
    return NextResponse.json({ error: "Failed to generate passkey login options" }, { status: 500 });
  }
}

