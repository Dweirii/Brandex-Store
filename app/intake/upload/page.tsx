import { notFound } from "next/navigation";
import intakePrisma from "@/lib/intake-prisma";
import { UploadZone } from "./_components/upload-zone";
import { UploadCloud } from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
  storagePath?: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function UploadPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) notFound();

  const submission = await intakePrisma.intakeSubmission.findUnique({
    where: { uploadToken: token, uploadEnabled: true },
    select: {
      id: true,
      fullName: true,
      uploadedFiles: true,
    },
  });

  if (!submission) notFound();

  const uploadedFiles = ((submission.uploadedFiles as unknown) as UploadedFile[]) ?? [];

  return (
    <div className="w-full max-w-xl">

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
          <UploadCloud className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Reference Files</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Hey <span className="text-foreground font-semibold">{submission.fullName}</span> — add any
            files that will help us understand your project.
          </p>
        </div>
      </div>

      {/* Accepted formats badge row */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Images", detail: "up to 8 MB" },
          { label: "PDF", detail: "up to 20 MB" },
          { label: "ZIP", detail: "up to 25 MB" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs"
          >
            <span className="font-semibold text-foreground">{f.label}</span>
            <span className="text-muted-foreground">{f.detail}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-muted-foreground">
          Max 10 files
        </div>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <UploadZone token={token} uploadedFiles={uploadedFiles} />
      </div>

      <p className="text-center text-muted-foreground text-xs mt-6">
        Files are securely stored and only visible to the Brandex team.
      </p>
    </div>
  );
}
