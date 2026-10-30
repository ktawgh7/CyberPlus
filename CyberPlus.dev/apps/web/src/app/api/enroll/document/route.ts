import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { DocumentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { docType, docNumber, fullName, country } = await req.json();
    if (!docType || !docNumber || !fullName || !country) {
      return NextResponse.json({ error: "All document fields are required." }, { status: 400 });
    }

    const submission = await db.documentSubmission.create({
      data: {
        userId: user.id,
        docType,
        docNumber,
        fullName,
        country,
        status: DocumentStatus.PENDING,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "DOCUMENT_SUBMITTED_FOR_REVIEW",
      detail: { docType, country, docNumberMasked: docNumber.slice(-4) },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      status: DocumentStatus.PENDING,
    });
  } catch (err: any) {
    console.error("Document submission error:", err);
    return NextResponse.json({ error: "Failed to submit document" }, { status: 500 });
  }
}

