"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

export function TrackLookup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "not_found" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus("idle");

    const res = await fetch("/api/intake/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    setLoading(false);

    if (res.ok) {
      setStatus("sent");
    } else if (res.status === 404) {
      setStatus("not_found");
    } else {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p className="text-sm font-semibold text-foreground">Check your inbox!</p>
        <p className="text-sm text-muted-foreground">
          We sent a tracking link to <strong className="text-foreground">{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          className="pl-10"
          required
        />
      </div>

      {status === "not_found" && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          No submissions found for this email. Make sure it&apos;s the same email you used when submitting.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" disabled={loading || !email.trim()} className="w-full">
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Looking up…</>
        ) : (
          "Send Tracking Link"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We&apos;ll email you a link to view your submission status.
      </p>
    </form>
  );
}
