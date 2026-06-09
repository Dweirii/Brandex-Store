"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Gift } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const CLASSIC_DISMISSED_KEY = "brandex.welcome-credits.classic-dismissed";
const PILL_DISMISSED_KEY = "brandex.welcome-credits.pill-dismissed";
const SIGN_IN_HREF = "/sign-in?redirect_url=/credits";

type Variant = "classic" | "pill" | null;

export function WelcomeCreditsPopup() {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [variant, setVariant] = useState<Variant>(null);

  useEffect(() => {
    if (!isLoaded || isSignedIn) {
      setVariant(null);
      return;
    }

    // Don't compete with the sign-in flow itself.
    if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
      setVariant(null);
      return;
    }

    const classicDismissed = localStorage.getItem(CLASSIC_DISMISSED_KEY) === "1";
    const pillDismissed = localStorage.getItem(PILL_DISMISSED_KEY) === "1";

    if (!classicDismissed) {
      setVariant("classic");
    } else if (!pillDismissed) {
      setVariant("pill");
    } else {
      setVariant(null);
    }
  }, [isLoaded, isSignedIn, pathname]);

  if (variant === "classic") {
    return (
      <ClassicMinimal
        onClose={() => {
          localStorage.setItem(CLASSIC_DISMISSED_KEY, "1");
          setVariant("pill");
        }}
      />
    );
  }

  if (variant === "pill") {
    return (
      <CompactPill
        onClose={() => {
          localStorage.setItem(PILL_DISMISSED_KEY, "1");
          setVariant(null);
        }}
      />
    );
  }

  return null;
}

function ClassicMinimal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="50 free credits offer"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center">
          <Image
            src="/Logo.svg"
            alt="Brandex"
            width={140}
            height={32}
            className="mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            JUST SIGN IN & GET 50 CREDITS FREE
          </h2>
          <p className="text-gray-500 mb-6">Unlock your credits instantly.</p>
          <Link
            href={SIGN_IN_HREF}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function CompactPill({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm bg-white rounded-full shadow-2xl py-3 px-4 flex items-center gap-3 border border-gray-100"
      role="dialog"
      aria-label="50 free credits reminder"
    >
      <div className="w-10 h-10 bg-[#05b819] rounded-full flex items-center justify-center flex-shrink-0">
        <Gift className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm">50 Free Credits</p>
        <p className="text-gray-500 text-xs">Sign in to claim</p>
      </div>
      <Link
        href={SIGN_IN_HREF}
        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-full transition-colors flex-shrink-0"
      >
        Sign In
      </Link>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="Close popup"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
