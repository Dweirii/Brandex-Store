import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import type { Product } from "@/types"

// ---------------------------------------------------------------------------
// Tokeniser
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  "brandex", "mockup", "mockups", "design", "designs", "psd", "file", "files",
  "template", "templates", "premium", "free", "editable", "layered", "ready",
  "a", "an", "the", "and", "of", "with", "for", "to", "in", "on", "at",
  "is", "it", "its", "by", "from", "or", "as", "be", "are", "was",
])

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
}

// ---------------------------------------------------------------------------
// Scorer — multi-signal relevance scoring
//
// Signals (highest to lowest weight):
//   1. Keyword exact match      — full phrase match          → 10 pts each
//   2. Keyword token overlap    — shared word inside a tag   →  3 pts each
//   3. Name token overlap       — shared meaningful word     →  4 pts each
//   4. Description token overlap                             →  1 pt  each
// ---------------------------------------------------------------------------

export function scoreCandidate(current: Product, candidate: Product): number {
  let score = 0

  const currentKwNorm = (current.keywords ?? []).map((k) => k.toLowerCase().trim()).filter(Boolean)
  const candidateKwNorm = (candidate.keywords ?? []).map((k) => k.toLowerCase().trim()).filter(Boolean)

  // --- 1. Keyword exact phrase match ---
  const currentKwSet = new Set(currentKwNorm)
  for (const kw of candidateKwNorm) {
    if (currentKwSet.has(kw)) score += 10
  }

  // --- 2. Keyword token overlap (word within a keyword phrase) ---
  const currentKwTokens = new Set(currentKwNorm.flatMap((kw) => tokenise(kw)))
  for (const kw of candidateKwNorm) {
    for (const token of tokenise(kw)) {
      if (currentKwTokens.has(token)) score += 3
    }
  }

  // --- 3. Name token overlap ---
  const currentNameTokens = new Set(tokenise(current.name))
  for (const word of tokenise(candidate.name)) {
    if (currentNameTokens.has(word)) score += 4
  }

  // --- 4. Description token overlap ---
  if (current.description && candidate.description) {
    const currentDescTokens = new Set(tokenise(current.description))
    for (const word of tokenise(candidate.description)) {
      if (currentDescTokens.has(word)) score += 1
    }
  }

  // --- 5. Subcategory match (strong signal — separates boxes from bottles within Packaging) ---
  if (current.subcategory?.id && candidate.subcategory?.id === current.subcategory.id) {
    score += 15
  }

  return score
}

/**
 * Group near-identical products (color/size variants of the same base item) and
 * keep only the highest-scored representative from each group. Two products are
 * considered variants if their normalised names share the same first 4 tokens.
 */
function dedupeVariants<T extends { product: Product; score: number }>(scored: T[]): T[] {
  const seen = new Set<string>()
  const result: T[] = []
  for (const item of scored) {
    const tokens = tokenise(item.product.name).slice(0, 4)
    const key = tokens.length >= 3 ? tokens.join(" ") : item.product.id
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }
  return result
}

/**
 * Pure scoring fallback — ranks candidates by multi-signal relevance, returns top 4.
 * Only returns items with a positive score; if nothing matches, returns [] so the
 * Related section is hidden rather than filled with random same-category items.
 */
export function getRelatedProductsFallback(
  currentProduct: Product,
  candidates: Product[]
): Product[] {
  const scored = candidates
    .map((c) => ({ product: c, score: scoreCandidate(currentProduct, c) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  return dedupeVariants(scored).slice(0, 4).map((x) => x.product)
}

// ---------------------------------------------------------------------------
// AI-powered recommendation — Gemini via Vercel AI Gateway or direct Google
// ---------------------------------------------------------------------------

function buildGoogleClient() {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })
  }
  if (process.env.AI_GATEWAY_API_KEY) {
    return createGoogleGenerativeAI({
      apiKey: process.env.AI_GATEWAY_API_KEY,
      baseURL: "https://ai-gateway.vercel.sh/v1/google/v1beta",
    })
  }
  return null
}

/**
 * Uses Gemini 2.0 Flash to semantically rank pre-scored candidates.
 * Receives a pool already sorted by relevance score — AI re-ranks using
 * use-case understanding and semantic similarity, not just keyword overlap.
 * Returns up to 4 best-match product IDs.
 */
export async function getRelatedProductsWithAI(
  currentProduct: Product,
  candidates: Product[],
  scores: Map<string, number>
): Promise<string[]> {
  const googleClient = buildGoogleClient()

  if (!googleClient) {
    console.warn("AI Recommender: No API key configured — using smart fallback.")
    return []
  }

  try {
    // Take the top 30 pre-scored candidates so AI works with quality signals, not noise
    const pool = candidates
      .slice(0, 30)

    if (pool.length === 0) return []

    const { object } = await generateObject({
      model: googleClient("gemini-2.0-flash"),
      schema: z.object({
        recommendedIds: z
          .array(z.string())
          .max(4)
          .describe("0-4 product IDs, best match first. Return fewer (or none) rather than padding with weak matches."),
      }),
      prompt: `
You are a smart recommendation engine for Brandex — a design asset marketplace selling mockup templates, PSD label designs, packaging artwork, and brand asset files for designers and businesses.

A customer is currently viewing this product:
- Name: "${currentProduct.name}"
- Category: "${currentProduct.category?.name ?? "N/A"}"
- Subcategory: "${currentProduct.subcategory?.name ?? "N/A"}"
- Tags: ${(currentProduct.keywords ?? []).slice(0, 10).join(", ") || "none"}
- Description: "${(currentProduct.description ?? "N/A").slice(0, 250)}"

Your job: pick up to 4 products this customer would genuinely want next. **Quality over quantity** — if only 2 are truly relevant, return 2. If none are relevant, return an empty list.

Think like a designer browsing for assets:
- PRIMARY USE CASE? (label design, product mockup, social post, etc.)
- INDUSTRY / THEME? (food, beverage, beauty, tech, holiday, etc.)
- PRODUCT TYPE / FORMAT? (bottle, box, pouch, phone, etc.)
- A good recommendation matches at least the THEME or USE CASE. A great one matches both.

HARD RULES — do not violate:
1. **No near-duplicates.** If two candidates are clearly variants of the same base item (same name with only a colour/size/number swap, e.g. "Christmas Bottle Red" + "Christmas Bottle Blue"), pick AT MOST ONE.
2. **No off-theme padding.** Do not include a product just because it's the same category. A pudding box and a Christmas whisky bottle share "packaging" but serve completely different designers — skip it.
3. **Prefer same subcategory.** If the current product is a "Box" (subcategory), strongly prefer other Box-shaped items over Bottles, Pouches, etc.

CANDIDATES (sorted by keyword/name relevance score — higher = stronger keyword signal, but use your judgement):
${pool
  .map(
    (p) =>
      `[${p.id}] score:${scores.get(p.id) ?? 0} | "${p.name}" | ${p.category?.name ?? "?"} / ${p.subcategory?.name ?? "?"} | Tags: ${(p.keywords ?? []).slice(0, 6).join(", ") || "none"} | "${(p.description ?? "").slice(0, 100)}"`
  )
  .join("\n")}

Return 0-4 IDs from the list above. Best match first. Returning fewer is better than returning wrong ones.
      `.trim(),
    })

    const validIds = new Set(pool.map((p) => p.id))
    const filtered = object.recommendedIds.filter((id) => validIds.has(id))

    // Belt-and-braces: even if the AI slips a near-duplicate through, dedupe by name prefix.
    const productById = new Map(pool.map((p) => [p.id, p]))
    const picked: string[] = []
    const seenPrefix = new Set<string>()
    for (const id of filtered) {
      const product = productById.get(id)
      if (!product) continue
      const tokens = tokenise(product.name).slice(0, 4)
      const key = tokens.length >= 3 ? tokens.join(" ") : id
      if (seenPrefix.has(key)) continue
      seenPrefix.add(key)
      picked.push(id)
    }
    return picked
  } catch (err) {
    console.error("AI Recommender Error:", err instanceof Error ? err.message : err)
    return []
  }
}
