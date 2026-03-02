"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

export function TrackLookup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/intake/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      router.push(`/intake/track?token=${data.token}`);
    } else if (res.status === 404) {
      setLoading(false);
      setError("No submissions found for this email. Make sure it's the same email you used when submitting.");
    } else {
      setLoading(false);
      setError(data.error ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          className="pl-10"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading || !email.trim()} className="w-full">
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Looking up…</>
        ) : (
          "View My Submission"
        )}
      </Button>
    </form>
  );
}
