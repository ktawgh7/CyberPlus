import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPasskeyRegistrationOptions } from "@/lib/passkey";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const options = await getPasskeyRegistrationOptions({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json(options);
  } catch (err: any) {
    console.error("Passkey register options error:", err);
    return NextResponse.json({ error: "Failed to generate passkey options" }, { status: 500 });
  }
}

