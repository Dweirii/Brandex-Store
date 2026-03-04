"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const schema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    company: z.string().optional(),
    needs: z.array(z.string()).min(1, "Select at least one service"),
    otherDesc: z.string().optional(),
    goal: z.string().min(5, "Describe your project goal"),
    vibe: z.string().optional(),
    packDimensions: z.string().optional(),
    packSkus: z.coerce.number().int().positive().optional().or(z.literal("")),
    packHasDieline: z.string().optional(),
    deadline: z
      .string()
      .min(1, "Please pick a deadline")
      .refine((val) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(val) >= today;
      }, "Deadline must be today or a future date"),
    budget: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (d) => !d.needs.includes("other") || (d.otherDesc && d.otherDesc.length > 0),
    { message: "Please describe what you need", path: ["otherDesc"] }
  );

type FormValues = z.infer<typeof schema>;

const NEED_OPTIONS = [
  { id: "logo_branding", label: "Logo & Branding" },
  { id: "packaging", label: "Packaging Design" },
  { id: "mockup", label: "Mockup" },
  { id: "print", label: "Print Design" },
  { id: "other", label: "Other" },
];

const BUDGET_OPTIONS = [
  { value: "under_500", label: "Under $500" },
  { value: "500_1000", label: "$500 – $1,000" },
  { value: "1000_3000", label: "$1,000 – $3,000" },
  { value: "3000_5000", label: "$3,000 – $5,000" },
  { value: "5000_plus", label: "$5,000+" },
  { value: "not_sure", label: "Not sure yet" },
];

const DIELINE_OPTIONS = [
  { value: "yes", label: "Yes, I have a dieline" },
  { value: "no", label: "No, I need one created" },
  { value: "unknown", label: "Not sure" },
];

const STEPS = [
  { number: 1, label: "Contact" },
  { number: 2, label: "Project" },
  { number: 3, label: "Timeline" },
];

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["fullName", "email", "company", "needs", "otherDesc"],
  2: ["goal", "vibe", "packDimensions", "packSkus", "packHasDieline"],
  3: ["deadline", "budget", "notes"],
};

export default function IntakePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [trackToken, setTrackToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { needs: [] },
    mode: "onTouched",
  });

  const needs = watch("needs") ?? [];
  const packagingSelected = needs.includes("packaging");
  const otherSelected = needs.includes("other");

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const packSkusRaw = values.packSkus;
      const packSkusParsed =
        packSkusRaw !== "" && packSkusRaw !== undefined && packSkusRaw !== null
          ? Number(packSkusRaw)
          : undefined;

      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, packSkus: packSkusParsed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong. Please try again.");
      }

      const data = await res.json() as { uploadToken?: string };
      setTrackToken(data.uploadToken ?? null);
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success ────────────────────────────────────────────────────────────────

  if (submitted) {
    const trackUrl = trackToken
      ? `/intake/track?token=${trackToken}`
      : null;

    return (
      <div className="w-full max-w-md text-center py-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">You&apos;re all set!</h1>
        <p className="text-muted-foreground">
          Your inquiry has been submitted. We&apos;ll review your details and reach out within{" "}
          <strong className="text-foreground">24 hours</strong>.
        </p>
        {trackUrl && (
          <div className="mt-8 space-y-3">
            <Link
              href={trackUrl}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Track Your Request
            </Link>
            <p className="text-xs text-muted-foreground">
              We also sent a confirmation + tracking link to your email.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1.5">Start a Project</h1>
        <p className="text-muted-foreground">Fill out the form below and we&apos;ll be in touch within 24 hours.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {STEPS.map((s, idx) => (
          <div key={s.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200",
                  step > s.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : step === s.number
                      ? "border-primary text-primary bg-transparent"
                      : "border-border text-muted-foreground bg-transparent"
                )}
              >
                {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold whitespace-nowrap uppercase tracking-wide",
                  step === s.number ? "text-primary" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-14 mb-5 mx-2 transition-all duration-300",
                  step > s.number ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* ── Step 1: Contact & Service ─────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *" error={errors.fullName?.message}>
                  <Input {...register("fullName")} placeholder="Jane Smith" />
                </Field>
                <Field label="Email *" error={errors.email?.message}>
                  <Input {...register("email")} type="email" placeholder="jane@company.com" />
                </Field>
              </div>
              <Field label="Company / Brand" error={errors.company?.message}>
                <Input {...register("company")} placeholder="Optional" />
              </Field>
              <Field label="What do you need? *" error={errors.needs?.message}>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {NEED_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium select-none",
                        needs.includes(opt.id)
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-colors",
                          needs.includes(opt.id) ? "bg-primary border-primary" : "border-border"
                        )}
                      >
                        {needs.includes(opt.id) && (
                          <svg className="w-2.5 h-2.5 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={needs.includes(opt.id)}
                        onChange={(e) => {
                          setValue(
                            "needs",
                            e.target.checked ? [...needs, opt.id] : needs.filter((n) => n !== opt.id),
                            { shouldValidate: true }
                          );
                        }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </Field>
              {otherSelected && (
                <Field label="Describe what you need *" error={errors.otherDesc?.message}>
                  <Input {...register("otherDesc")} placeholder="Tell us what you're looking for…" />
                </Field>
              )}
            </div>
          )}

          {/* ── Step 2: Project Details ───────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <Field label="Project Goal *" error={errors.goal?.message}>
                <Textarea
                  {...register("goal")}
                  placeholder="Describe what you want to achieve with this project…"
                  rows={4}
                  className="resize-none"
                />
              </Field>
              <Field label="Vibe / Style Direction" error={errors.vibe?.message}>
                <Input {...register("vibe")} placeholder="e.g. Minimal, Bold, Luxury, Playful…" />
              </Field>
              {packagingSelected && (
                <div className="border-t border-border pt-5">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Packaging Details</p>
                  <div className="space-y-4">
                    <Field label="Pack Dimensions" error={errors.packDimensions?.message}>
                      <Input {...register("packDimensions")} placeholder="e.g. 100 × 60 × 30 mm" />
                    </Field>
                    <Field label="Number of SKUs / Variants" error={errors.packSkus?.message}>
                      <Input
                        {...register("packSkus")}
                        type="number"
                        min={1}
                        placeholder="1"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </Field>
                    <Field label="Do you have a dieline?" error={errors.packHasDieline?.message}>
                      <Select onValueChange={(v) => setValue("packHasDieline", v)}>
                        <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                        <SelectContent>
                          {DIELINE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Timeline ─────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <Field label="Desired Deadline *" error={errors.deadline?.message}>
                <Input
                  {...register("deadline")}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="dark:[color-scheme:dark]"
                />
              </Field>
              <Field label="Estimated Budget" error={errors.budget?.message}>
                <Select onValueChange={(v) => setValue("budget", v)}>
                  <SelectTrigger><SelectValue placeholder="Choose a range (optional)" /></SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Additional Notes" error={errors.notes?.message}>
                <Textarea
                  {...register("notes")}
                  placeholder="References, constraints, inspiration…"
                  rows={4}
                  className="resize-none"
                />
              </Field>
              {serverError && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                  {serverError}
                </p>
              )}
            </div>
          )}

          {/* ── Navigation ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <Button type="button" onClick={goNext} className="gap-1">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={submitting} className="min-w-[140px]">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting…</>
                ) : (
                  "Submit Inquiry"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>

      <p className="text-center text-muted-foreground text-xs mt-6">
        We typically respond within 24 hours · All information is kept confidential
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
