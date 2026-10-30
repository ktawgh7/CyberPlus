import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendContactConfirmationEmail } from "@/lib/email";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  body: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please fill out all fields correctly." }, { status: 400 });
    }

    const { name, email, subject, body } = parsed.data;
    const currentUser = await getCurrentUser();

    const message = await db.contactMessage.create({
      data: {
        userId: currentUser?.id || null,
        name,
        email,
        subject,
        body,
      },
    });

    await sendContactConfirmationEmail(email, name, subject);

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (err: any) {
    console.error("Contact message error:", err);
    return NextResponse.json({ error: "Failed to submit message." }, { status: 500 });
  }
}

