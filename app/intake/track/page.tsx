import intakePrisma from "@/lib/intake-prisma";
import { TrackUploadZone } from "./_components/track-upload-zone";
import { TrackLookup } from "./_components/track-lookup";
import {
  CheckCircle2, Clock, Loader2, Search, XCircle,
  FileIcon, ImageIcon, FileArchiveIcon, ExternalLink,
} from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

const STATUS_CONFIG: Record<string, {
  label: string;
  description: string;
  Icon: React.ElementType;
  color: string;
}> = {
  new: {
    label: "Received",
    description: "We've received your request and will review it shortly.",
    Icon: Clock,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/30",
  },
  reviewing: {
    label: "Under Review",
    description: "Our team is reviewing your submission and will reach out soon.",
    Icon: Search,
    color: "text-purple-600 bg-purple-500/10 border-purple-500/30",
  },
  in_progress: {
    label: "In Progress",
    description: "Great news — we're actively working on your project!",
    Icon: Loader2,
    color: "text-amber-600 bg-amber-500/10 border-amber-500/30",
  },
  done: {
    label: "Completed",
    description: "Your project is complete. Check your email for the deliverables.",
    Icon: CheckCircle2,
    color: "text-green-600 bg-green-500/10 border-green-500/30",
  },
  cancelled: {
    label: "Cancelled",
    description: "This request has been cancelled. Contact us if you have questions.",
    Icon: XCircle,
    color: "text-red-600 bg-red-500/10 border-red-500/30",
  },
};

const TIMELINE_STEPS = [
  { status: "new",         label: "Received",     desc: "Your request has been received" },
  { status: "reviewing",   label: "Under Review",  desc: "Team is reviewing your submission" },
  { status: "in_progress", label: "In Progress",   desc: "Work has started on your project" },
  { status: "done",        label: "Completed",     desc: "Your project is done" },
];

const STATUS_ORDER = ["new", "reviewing", "in_progress", "done", "cancelled"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-blue-500" />;
  if (type === "application/pdf") return <FileIcon className="w-4 h-4 text-red-500" />;
  return <FileArchiveIcon className="w-4 h-4 text-yellow-500" />;
}

export default async function TrackPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  // No token → show email lookup form
  if (!token) {
    return (
      <div className="w-full max-w-md py-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Track Your Request</h1>
          <p className="text-muted-foreground text-sm">
            Enter the email you used when submitting to view your request status.
          </p>
        </div>
        <TrackLookup />
      </div>
    );
  }

  const submission = await intakePrisma.intakeSubmission.findUnique({
    where: { uploadToken: token },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      createdAt: true,
      uploadEnabled: true,
      uploadedFiles: true,
    },
  });

  if (!submission) {
    return (
      <div className="w-full max-w-md py-10 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-destructive" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Link Not Found</h1>
        <p className="text-muted-foreground text-sm mb-6">
          This tracking link is invalid or has expired.
        </p>
        <TrackLookup />
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[submission.status] ?? STATUS_CONFIG.new;
  const { Icon: StatusIcon } = statusConfig;
  const files = ((submission.uploadedFiles as unknown) as UploadedFile[]) ?? [];
  const canUploadMore = submission.uploadEnabled && files.length < 10;
  const currentIdx = STATUS_ORDER.indexOf(submission.status);

  return (
    <div className="w-full max-w-lg">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
          Hi, {submission.fullName.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground text-sm">
          Submitted on{" "}
          {new Date(submission.createdAt).toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
          })}
        </p>
      </div>

      {/* Status Badge */}
      <div className={`rounded-2xl border-2 p-5 mb-5 flex items-center gap-4 ${statusConfig.color}`}>
        <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center shrink-0">
          <StatusIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-base font-bold">{statusConfig.label}</p>
          <p className="text-sm opacity-80">{statusConfig.description}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Request Timeline</p>
        <div className="space-y-0">
          {TIMELINE_STEPS.map((ts, i) => {
            const stepIdx = STATUS_ORDER.indexOf(ts.status);
            const isCompleted = submission.status !== "cancelled" && currentIdx > stepIdx;
            const isCurrent = submission.status === ts.status;
            const isCancelled = submission.status === "cancelled";

            return (
              <div key={ts.status} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors z-10 ${
                      isCancelled && i === 0
                        ? "bg-red-500 border-red-500"
                        : isCompleted || isCurrent
                          ? "bg-primary border-primary"
                          : "bg-background border-border"
                    }`}
                  >
                    {(isCompleted || (isCurrent && !isCancelled)) && (
                      <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                    )}
                    {isCancelled && i === 0 && (
                      <XCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className={`w-px h-7 ${isCompleted ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
                <div className="pb-1 pt-0.5">
                  <p className={`text-sm font-semibold leading-tight ${isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                    {ts.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{ts.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uploaded Files + Upload More */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Reference Files ({files.length})
        </p>

        {files.length > 0 && (
          <ul className="space-y-2 mb-4">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-muted/20">
                <FileTypeIcon type={f.type} />
                <div className="flex-1 min-w-0">
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:text-primary truncate block transition-colors"
                  >
                    {f.name}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(f.size)} ·{" "}
                    {new Date(f.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            ))}
          </ul>
        )}

        {canUploadMore && (
          <TrackUploadZone token={token} existingCount={files.length} />
        )}

        {!canUploadMore && files.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">No files uploaded yet.</p>
        )}

        {files.length >= 10 && (
          <p className="text-xs text-muted-foreground text-center pt-2">Maximum of 10 files reached.</p>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Questions? Reply to the confirmation email or contact us at{" "}
        <a href="mailto:contact@brandexme.com" className="underline hover:text-foreground">
          contact@brandexme.com
        </a>
      </p>
    </div>
  );
}
