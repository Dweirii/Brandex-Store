"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud, X, FileIcon, ImageIcon, FileArchiveIcon,
  CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  url: string;
  storagePath?: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface FileState {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
  result?: UploadedFile;
}

interface UploadZoneProps {
  token: string;
  uploadedFiles: UploadedFile[];
}

const ACCEPT = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  "application/pdf",
  "application/zip", "application/x-zip-compressed",
].join(",");

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

export function UploadZone({ token, uploadedFiles: initial }: UploadZoneProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileState[]>([]);
  const [uploaded, setUploaded] = useState<UploadedFile[]>(initial);
  const [dragging, setDragging] = useState(false);

  const remainingSlots = 10 - uploaded.length;

  const uploadFile = useCallback(async (fileState: FileState) => {
    setFiles((prev) =>
      prev.map((f) => f.id === fileState.id ? { ...f, status: "uploading", progress: 10 } : f)
    );

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("file", fileState.file);

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileState.id && f.status === "uploading" && f.progress < 85
              ? { ...f, progress: f.progress + 15 }
              : f
          )
        );
      }, 500);

      const res = await fetch("/api/intake/upload", { method: "POST", body: formData });
      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Upload failed");
      }

      const data = await res.json() as { file: UploadedFile };
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileState.id ? { ...f, status: "done", progress: 100, result: data.file } : f
        )
      );
      setUploaded((prev) => [...prev, data.file]);
      router.refresh();
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileState.id
            ? { ...f, status: "error", progress: 0, error: err instanceof Error ? err.message : "Upload failed" }
            : f
        )
      );
    }
  }, [token, router]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const toAdd = arr.slice(0, remainingSlots);
    if (toAdd.length === 0) return;

    const newStates: FileState[] = toAdd.map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
      file: f,
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newStates]);
    newStates.forEach((fs) => uploadFile(fs));
  }, [remainingSlots, uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeQueued = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const activeUploads = files.filter((f) => f.status !== "done" && f.status !== "error");
  const hasActiveUploads = activeUploads.length > 0;

  return (
    <div className="space-y-6">

      {/* Drop Zone */}
      {remainingSlots > 0 && (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            dragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              dragging ? "bg-primary/20" : "bg-muted"
            )}>
              <UploadCloud className={cn("w-6 h-6", dragging ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {dragging ? "Drop files here" : "Drag & drop files or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Images up to 8 MB · PDF up to 20 MB · ZIP up to 25 MB · Max {remainingSlots} more file{remainingSlots !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {remainingSlots === 0 && (
        <div className="rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-muted-foreground text-center">
          Maximum of 10 files reached.
        </div>
      )}

      {/* Active uploads queue */}
      {hasActiveUploads && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uploading…</p>
          {files.filter((f) => f.status !== "done").map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card">
              <FileTypeIcon type={f.file.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{f.file.name}</p>
                {f.status === "uploading" && (
                  <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
                {f.status === "error" && (
                  <p className="text-xs text-destructive mt-0.5">{f.error}</p>
                )}
              </div>
              {f.status === "uploading" && <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />}
              {f.status === "error" && (
                <button onClick={() => removeQueued(f.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
              {f.status === "pending" && (
                <button onClick={() => removeQueued(f.id)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed uploads */}
      {uploaded.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Uploaded Files ({uploaded.length})
          </p>
          <ul className="space-y-2">
            {uploaded.map((f, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card">
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
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatBytes(f.size)} ·{" "}
                    {new Date(f.uploadedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error files retry hint */}
      {files.some((f) => f.status === "error") && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Some files failed to upload. Remove them and try again, or re-upload by selecting the files again.</p>
        </div>
      )}
    </div>
  );
}
