import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import intakePrisma from "@/lib/intake-prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brandexme.com";
const FROM_EMAIL = "Brandex <noreply@bsi-labs.org>";

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

    const submissions = await intakePrisma.intakeSubmission.findMany({
      where: { email: parsed.data.email },
      select: { uploadToken: true, fullName: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    if (submissions.length === 0) {
      return NextResponse.json({ error: "No submissions found for this email." }, { status: 404 });
    }

    const firstName = submissions[0].fullName.split(" ")[0];

    const links = submissions
      .filter((s): s is { uploadToken: string; fullName: string } => !!s.uploadToken)
      .map((s) => `${SITE_URL}/intake/track?token=${s.uploadToken}`);

    const linkListHtml = links
      .map(
        (link, i) =>
          `<a href="${link}" style="display:block;background:#111827;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600;font-size:14px;text-align:center;margin-bottom:12px;">
            View Submission ${links.length > 1 ? `#${i + 1}` : ""}
          </a>`
      )
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [parsed.data.email],
      subject: "Your Brandex Tracking Links",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;background:#f9fafb;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 8px 0;font-size:22px;color:#111827;">Hi ${firstName},</h2>
      <p style="margin:0 0 28px 0;font-size:15px;color:#6b7280;line-height:1.6;">
        Here ${links.length === 1 ? "is your tracking link" : "are your tracking links"}. Use ${links.length === 1 ? "it" : "them"} to check your project status and upload reference files.
      </p>
      ${linkListHtml}
      <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:20px;">
      Brandex · <a href="${SITE_URL}" style="color:#9ca3af;">${SITE_URL.replace("https://", "")}</a>
    </p>
  </div>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[INTAKE_LOOKUP]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
