/**
 * Meta Pixel (ID 9516200848496260) event helpers.
 *
 * The base pixel + initial PageView are installed in app/layout.tsx and gated by
 * Consent Mode: it loads with `fbq('consent','revoke')` and the CookieConsent
 * component calls `fbq('consent','grant')` once the visitor accepts marketing
 * cookies. Every call below therefore automatically respects consent — when
 * revoked, fbq queues/blocks the event; when granted, it sends. We only guard
 * that `window.fbq` exists so nothing throws if the pixel is blocked/not loaded.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (params) window.fbq("track", event, params);
    else window.fbq("track", event);
  } catch {
    /* pixel blocked / not ready — ignore */
  }
}

/** Fire on every in-app (SPA) route change. Initial load fires in <head>. */
export function metaPageView() {
  track("PageView");
}

/** Fire on a product detail page view. */
export function metaViewContent(p: {
  content_ids: string[];
  content_name?: string;
  value?: number;
  currency?: string;
}) {
  track("ViewContent", {
    content_type: "product",
    currency: p.currency ?? "USD",
    ...p,
  });
}

/** Fire only AFTER a contact/inquiry form submits successfully. */
export function metaLead(params?: Record<string, unknown>) {
  track("Lead", params);
}

/** Fire when the user starts a checkout (credit pack or cart → Stripe). */
export function metaInitiateCheckout(p: {
  value?: number;
  currency?: string;
  content_ids?: string[];
  num_items?: number;
} = {}) {
  track("InitiateCheckout", { currency: p.currency ?? "USD", ...p });
}

/** Fire after a completed/paid purchase. */
export function metaPurchase(p: {
  value: number;
  currency?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
}) {
  track("Purchase", { currency: p.currency ?? "USD", ...p });
}
