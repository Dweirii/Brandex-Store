/**
 * GA4 / Google Ads conversion events.
 *
 * GA4 is loaded ONLY through Google Tag Manager (GTM-PM89X24C), so events must
 * be pushed to the GTM `dataLayer` using their exact GA4 event names. In GTM,
 * create a "Custom Event" trigger for each name below and attach the matching
 * GA4 event tag + Google Ads conversion tag. Pushing via `window.gtag('event')`
 * does NOT work here because no direct gtag.js/Ads tag is installed.
 *
 * Consent Mode v2 (set up in app/layout.tsx) still gates the downstream tags —
 * pushing to the dataLayer is always safe.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
  }
}

type Params = Record<string, unknown>;

const CURRENCY = "USD";

function push(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch {
    /* dataLayer unavailable — ignore */
  }
}

/**
 * Push a GA4 ecommerce event. Clears the previous `ecommerce` object first so
 * stale items don't leak into the next event (GA4 GTM best practice).
 */
function pushEcommerce(event: string, ecommerce: Params, extra: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event, ecommerce, ...extra });
  } catch {
    /* dataLayer unavailable — ignore */
  }
}

export interface AnalyticsItem {
  item_id: string;
  item_name?: string;
  item_category?: string;
  price?: number;
  quantity?: number;
}

/** Fired when a product detail page is viewed. */
export function trackViewItem(item: AnalyticsItem) {
  pushEcommerce("view_item", {
    currency: CURRENCY,
    value: item.price ?? 0,
    items: [{ quantity: 1, ...item }],
  });
}

/** Fired when an asset file finishes downloading. */
export function trackFileDownload(p: {
  item_id: string;
  item_name?: string;
  file_name: string;
  file_extension?: string;
  credit_cost?: number;
}) {
  push("file_download", {
    file_name: p.file_name,
    file_extension: p.file_extension,
    item_id: p.item_id,
    item_name: p.item_name,
    credit_cost: p.credit_cost,
  });
}

/** Fired when credits (virtual currency) are spent on a paid download. */
export function trackSpendVirtualCurrency(p: {
  value: number;
  item_name?: string;
  virtual_currency_name?: string;
}) {
  push("spend_virtual_currency", {
    virtual_currency_name: p.virtual_currency_name ?? "Credits",
    value: p.value,
    item_name: p.item_name,
  });
}

/** Fired on a completed real-money purchase (credit packs, cart checkout). */
export function trackPurchase(p: {
  transaction_id: string;
  value: number;
  currency?: string;
  items: AnalyticsItem[];
}) {
  pushEcommerce("purchase", {
    transaction_id: p.transaction_id,
    value: p.value,
    currency: p.currency ?? CURRENCY,
    items: p.items.map((i) => ({ quantity: 1, ...i })),
  });
}

/** Fired when the intake / lead form is submitted. */
export function trackGenerateLead(p: { value?: number; form_name?: string } = {}) {
  push("generate_lead", {
    currency: CURRENCY,
    value: p.value ?? 1,
    form_name: p.form_name,
  });
}

/** Fired when a brand-new account is created. */
export function trackSignUp(method = "Clerk") {
  push("sign_up", { method });
}

/** Fired when an existing user signs in. */
export function trackLogin(method = "Clerk") {
  push("login", { method });
}
