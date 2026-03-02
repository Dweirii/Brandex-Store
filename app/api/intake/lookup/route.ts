import { NextResponse } from "next/server";
import { z } from "zod";
import intakePrisma from "@/lib/intake-prisma";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
    }

    const submission = await intakePrisma.intakeSubmission.findFirst({
      where: { email: parsed.data.email },
      select: { uploadToken: true },
      orderBy: { createdAt: "desc" },
    });

    if (!submission?.uploadToken) {
      return NextResponse.json({ error: "No submissions found for this email." }, { status: 404 });
    }

    return NextResponse.json({ token: submission.uploadToken });
  } catch (error) {
    console.error("[INTAKE_LOOKUP]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
