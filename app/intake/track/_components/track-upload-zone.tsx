"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackUploadZoneProps {
  token: string;
  existingCount: number;
}

export function TrackUploadZone({ token, existingCount }: TrackUploadZoneProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const remaining = 10 - existingCount;

  const upload = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, remaining);
    if (arr.length === 0) return;

    setUploading(true);
    setStatus("idle");

    let hasError = false;
    for (const file of arr) {
      const fd = new FormData();
      fd.append("token", token);
      fd.append("file", file);
      const res = await fetch("/api/intake/upload", { method: "POST", body: fd });
      if (!res.ok) hasError = true;
    }

    setUploading(false);
    setStatus(hasError ? "error" : "success");
    if (!hasError) {
      setTimeout(() => {
        router.refresh();
        setStatus("idle");
      }, 1500);
    }
  }, [token, remaining, router]);

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200",
        uploading
          ? "opacity-60 cursor-not-allowed border-border"
          : dragging
            ? "border-primary bg-primary/5 cursor-copy"
            : "border-border hover:border-primary/50 hover:bg-muted/20 cursor-pointer"
      )}
      onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!uploading) upload(e.dataTransfer.files); }}
      onClick={() => !uploading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf,application/zip,application/x-zip-compressed"
        onChange={(e) => e.target.files && upload(e.target.files)}
      />
      <div className="flex flex-col items-center gap-2">
        {uploading ? (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : status === "error" ? (
          <AlertCircle className="w-5 h-5 text-destructive" />
        ) : (
          <UploadCloud className="w-5 h-5 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {uploading
            ? "Uploading…"
            : status === "success"
              ? "Uploaded successfully!"
              : status === "error"
                ? "Some files failed — try again"
                : "Add more files"}
        </p>
        {status === "idle" && !uploading && (
          <p className="text-xs text-muted-foreground">
            Images · PDF · ZIP · {remaining} slot{remaining !== 1 ? "s" : ""} remaining
          </p>
        )}
      </div>
    </div>
  );
}
