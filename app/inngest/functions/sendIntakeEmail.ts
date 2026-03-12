import { inngest } from "@/app/inngest/inngest";
import prismadb from "@/lib/prismadb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brandexme.com";
const FROM_EMAIL = "Brandex Intake <noreply@bsi-labs.org>";

function getTeamEmails(): string[] {
  const raw = process.env.TEAM_INTAKE_EMAIL ?? "";
  return raw.split(",").map((e) => e.trim()).filter(Boolean);
}

function formatNeeds(needs: unknown): string {
  const labels: Record<string, string> = {
    logo_branding: "Logo & Branding",
    packaging: "Packaging Design",
    mockup: "Mockup",
    print: "Print Design",
    other: "Other",
  };
  if (!Array.isArray(needs)) return "—";
  return (needs as string[]).map((n) => labels[n] ?? n).join(", ");
}

function row(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  return `<tr>
    <td style="padding:8px 16px;font-weight:600;color:#6F6F6F;width:180px;vertical-align:top;font-size:13px;">${label}</td>
    <td style="padding:8px 16px;color:#1F1F1F;font-size:14px;">${value}</td>
  </tr>`;
}

function section(title: string, rows: string) {
  return `<div style="margin:0 0 24px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#00B81A;">${title}</p>
    <table style="width:100%;border-collapse:collapse;background:#F8F8F8;border-radius:8px;overflow:hidden;border:1px solid #E5E5E5;">
      ${rows}
    </table>
  </div>`;
}

export const sendIntakeEmail = inngest.createFunction(
  { id: "send-intake-email", name: "Send Intake Notification Email" },
  { event: "brandex/intake.created" },
  async ({ event, step }) => {
    const { submissionId } = event.data as { submissionId: string };

    const submission = await step.run("fetch-submission", () =>
      prismadb.intakeSubmission.findUniqueOrThrow({ where: { id: submissionId } })
    );

    await step.run("send-email", async () => {
      const to = getTeamEmails();
      if (!to.length) {
        console.warn("[intake] No TEAM_INTAKE_EMAIL set — skipping email.");
        return;
      }

      const uploadLink = submission.uploadToken
        ? `${SITE_URL}/intake/upload?token=${submission.uploadToken}`
        : null;

      const deadline = new Date(submission.deadline).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });

      const packagingSelected =
        Array.isArray(submission.needs) && (submission.needs as string[]).includes("packaging");

      const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F8F8F8;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:640px;margin:32px auto;">

  <!-- Header -->
  <div style="background:#ffffff;border-radius:12px 12px 0 0;padding:28px 32px 20px;border-bottom:3px solid #00B81A;">
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:36px;height:36px;background:#00B81A;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;line-height:1;">B</div>
      <div>
        <div style="font-size:18px;font-weight:700;color:#1F1F1F;">New Project Inquiry</div>
        <div style="font-size:12px;color:#6F6F6F;">Brandex Intake · ${new Date(submission.createdAt).toLocaleString()}</div>
      </div>
    </div>
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:28px 32px 32px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,.06);">

    ${section("Contact", [
      row("Name", submission.fullName),
      row("Email", `<a href="mailto:${submission.email}" style="color:#00B81A;">${submission.email}</a>`),
      row("Company", submission.company),
    ].join(""))}

    ${section("Services Requested", [
      row("Needs", formatNeeds(submission.needs)),
      row("Other Details", submission.otherDesc),
    ].join(""))}

    ${section("Project Details", [
      row("Goal", submission.goal),
      row("Vibe / Style", submission.vibe),
      ...(packagingSelected ? [
        row("Pack Dimensions", submission.packDimensions),
        row("Number of SKUs", submission.packSkus),
        row("Has Dieline", submission.packHasDieline),
      ] : []),
    ].join(""))}

    ${section("Timeline & Budget", [
      row("Deadline", deadline),
      row("Budget", submission.budget),
      row("Notes", submission.notes),
    ].join(""))}

    ${uploadLink ? `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin:0 0 24px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#00B81A;">Client Upload Link</p>
      <a href="${uploadLink}" style="color:#00B81A;font-size:14px;word-break:break-all;">${uploadLink}</a>
      <p style="margin:8px 0 0;font-size:12px;color:#6F6F6F;">Share this link with the client so they can upload reference files.</p>
    </div>` : ""}

    <div style="text-align:center;">
      <a href="${SITE_URL}" style="display:inline-block;background:#00B81A;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
        Open Brandex
      </a>
    </div>
    <p style="margin:20px 0 0;font-size:11px;color:#6F6F6F;text-align:center;">Submission ID: ${submission.id}</p>
  </div>
</div>
</body>
</html>`;

      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        replyTo: submission.email,
        subject: `New Intake: ${submission.fullName}${submission.company ? ` — ${submission.company}` : ""}`,
        html,
      });

      if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
    });

    return { submissionId, status: "email_sent" };
  }
);
