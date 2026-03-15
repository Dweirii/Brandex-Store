import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Request — Brandex",
  description: "Tell us about your project and we'll get back to you within 24 hours.",
  robots: { index: false, follow: false },
};

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-start py-12 px-4">
      {children}
    </div>
  );
}
