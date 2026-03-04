import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import intakePrisma from "@/lib/intake-prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brandexme.com";
const FROM_EMAIL = "Brandex <noreply@bsi-labs.org>";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  company: z.string().optional(),
  needs: z.array(z.string()).min(1, "Select at least one service"),
  otherDesc: z.string().optional(),
  goal: z.string().min(5, "Describe your project goal"),
  vibe: z.string().optional(),
  notes: z.string().optional(),
  packDimensions: z.string().optional(),
  packSkus: z
    .union([z.number().int().positive(), z.null()])
    .optional()
    .transform((v) => v ?? undefined),
  packHasDieline: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
  budget: z.string().optional(),
});

const NEED_LABELS: Record<string, string> = {
  logo_branding: "Logo & Branding",
  packaging: "Packaging Design",
  mockup: "Mockup",
  print: "Print Design",
  other: "Other",
};

function formatNeeds(needs: string[]): string {
  return needs.map((n) => NEED_LABELS[n] ?? n).join(", ");
}

function row(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  return `<tr>
    <td style="padding:8px 16px;font-weight:600;color:#6b7280;width:160px;vertical-align:top;font-size:13px;">${label}</td>
    <td style="padding:8px 16px;color:#111827;font-size:14px;">${value}</td>
  </tr>`;
}

function section(title: string, rows: string) {
  if (!rows.trim()) return "";
  return `<div style="margin:0 0 20px;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#00B81A;">${title}</p>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">${rows}</table>
  </div>`;
}

// ─── Team notification email ─────────────────────────────────────────────────

async function sendTeamNotification(params: {
  submissionId: string;
  fullName: string;
  email: string;
  company: string | null;
  needs: string[];
  otherDesc: string | null;
  goal: string;
  vibe: string | null;
  packDimensions: string | null;
  packSkus: number | null;
  packHasDieline: string | null;
  deadline: Date;
  budget: string | null;
  notes: string | null;
  uploadToken: string;
  createdAt: Date;
}) {
  const to = (process.env.TEAM_INTAKE_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!to.length) {
    console.warn("[INTAKE] No TEAM_INTAKE_EMAIL set — skipping team notification.");
    return;
  }

  const trackLink = `${SITE_URL}/intake/track?token=${params.uploadToken}`;
  const deadline = params.deadline.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const needsLabel = formatNeeds(params.needs);
  const packagingSelected = params.needs.includes("packaging");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:640px;margin:32px auto;">
  <div style="background:#fff;border-radius:12px 12px 0 0;padding:28px 32px 20px;border-bottom:3px solid #00B81A;">
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:36px;height:36px;background:#00B81A;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;line-height:1;">B</div>
      <div>
        <div style="font-size:18px;font-weight:700;color:#111827;">New Project Inquiry</div>
        <div style="font-size:12px;color:#6b7280;">Brandex Intake · ${params.createdAt.toLocaleString()}</div>
      </div>
    </div>
  </div>
  <div style="background:#fff;padding:28px 32px 32px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,.06);">
    ${section("Contact", [
    row("Name", params.fullName),
    row("Email", `<a href="mailto:${params.email}" style="color:#00B81A;">${params.email}</a>`),
    row("Company", params.company),
  ].join(""))}
    ${section("Services", [
    row("Needs", needsLabel),
    row("Other Details", params.otherDesc),
  ].join(""))}
    ${section("Project Details", [
    row("Goal", params.goal),
    row("Vibe / Style", params.vibe),
    ...(packagingSelected ? [
      row("Pack Dimensions", params.packDimensions),
      row("Number of SKUs", params.packSkus),
      row("Has Dieline", params.packHasDieline),
    ] : []),
  ].join(""))}
    ${section("Timeline & Budget", [
    row("Deadline", deadline),
    row("Budget", params.budget),
    row("Notes", params.notes),
  ].join(""))}
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin:0 0 24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#15803d;">Client Tracking Link</p>
      <a href="${trackLink}" style="color:#00B81A;font-size:14px;word-break:break-all;">${trackLink}</a>
    </div>
    <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">Submission ID: ${params.submissionId}</p>
  </div>
</div>
</body></html>`;

  console.log("[INTAKE] Sending team email to:", to.join(", "));

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    replyTo: params.email,
    subject: `New Intake: ${params.fullName}${params.company ? ` — ${params.company}` : ""}`,
    html,
  });

  if (error) {
    console.error("[INTAKE] Team email failed:", JSON.stringify(error));
    throw new Error(`Resend team email: ${JSON.stringify(error)}`);
  }

  console.log("[INTAKE] Team email sent:", data?.id);
}

// ─── Client confirmation email ───────────────────────────────────────────────

async function sendClientConfirmation(params: {
  fullName: string;
  email: string;
  needs: string[];
  uploadToken: string;
}) {
  const firstName = params.fullName.split(" ")[0];
  const trackLink = `${SITE_URL}/intake/track?token=${params.uploadToken}`;
  const needsLabel = formatNeeds(params.needs);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;background:#f9fafb;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
      <div style="width:48px;height:48px;background:#00B81A;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;line-height:1;margin-bottom:24px;">B</div>

      <h2 style="margin:0 0 8px 0;font-size:22px;color:#111827;">Thanks, ${firstName}!</h2>
      <p style="margin:0 0 24px 0;font-size:15px;color:#6b7280;line-height:1.6;">
        We've received your project inquiry for <strong style="color:#111827;">${needsLabel}</strong>.
        Our team will review it and get back to you within <strong style="color:#111827;">24 hours</strong>.
      </p>

      <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#9ca3af;">What's next?</p>
        <ul style="margin:8px 0 0;padding:0 0 0 18px;font-size:14px;color:#374151;line-height:2;">
          <li>We review your details</li>
          <li>You'll receive a status update email</li>
          <li>Upload reference files anytime via the link below</li>
        </ul>
      </div>

      <a href="${trackLink}" style="display:block;background:#111827;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600;font-size:14px;text-align:center;margin-bottom:24px;">
        Track Your Request & Upload Files
      </a>

      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
        Save this email — you can use the link above anytime to check your request status or upload files.
      </p>
    </div>
    <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:20px;">
      Brandex · <a href="${SITE_URL}" style="color:#9ca3af;">${SITE_URL.replace("https://", "")}</a>
    </p>
  </div>
</body>
</html>`;

  console.log("[INTAKE] Sending client confirmation to:", params.email);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [params.email],
    subject: "We received your project inquiry — Brandex",
    html,
  });

  if (error) {
    console.error("[INTAKE] Client email failed:", JSON.stringify(error));
    throw new Error(`Resend client email: ${JSON.stringify(error)}`);
  }

  console.log("[INTAKE] Client email sent:", data?.id);
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      console.error("[INTAKE_POST] Validation errors:", JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const deadline = new Date(data.deadline);
    if (isNaN(deadline.getTime())) {
      return NextResponse.json({ error: "Invalid deadline date" }, { status: 422 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      return NextResponse.json({ error: "Deadline must be today or a future date" }, { status: 422 });
    }

    const uploadToken = crypto.randomUUID();

    const submission = await intakePrisma.intakeSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        company: data.company ?? null,
        needs: data.needs,
        otherDesc: data.otherDesc ?? null,
        goal: data.goal,
        vibe: data.vibe ?? null,
        notes: data.notes ?? null,
        packDimensions: data.packDimensions ?? null,
        packSkus: data.packSkus ?? null,
        packHasDieline: data.packHasDieline ?? null,
        deadline,
        budget: data.budget ?? null,
        status: "new",
        uploadToken,
        uploadEnabled: true,
      },
    });

    console.log("[INTAKE] Submission created:", submission.id);

    // Send both emails — awaited so errors are visible in logs
    const emailResults = await Promise.allSettled([
      sendTeamNotification({
        submissionId: submission.id,
        fullName: submission.fullName,
        email: submission.email,
        company: submission.company,
        needs: data.needs,
        otherDesc: submission.otherDesc,
        goal: submission.goal,
        vibe: submission.vibe,
        packDimensions: submission.packDimensions,
        packSkus: submission.packSkus,
        packHasDieline: submission.packHasDieline,
        deadline: submission.deadline,
        budget: submission.budget,
        notes: submission.notes,
        uploadToken,
        createdAt: submission.createdAt,
      }),
      sendClientConfirmation({
        fullName: submission.fullName,
        email: submission.email,
        needs: data.needs,
        uploadToken,
      }),
    ]);

    emailResults.forEach((result, i) => {
      const label = i === 0 ? "team" : "client";
      if (result.status === "rejected") {
        console.error(`[INTAKE] ${label} email rejected:`, result.reason);
      }
    });

    return NextResponse.json({ success: true, submissionId: submission.id, uploadToken }, { status: 201 });
  } catch (error) {
    console.error("[INTAKE_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
