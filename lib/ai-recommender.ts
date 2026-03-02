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

  return score
}

/**
 * Pure scoring fallback — ranks candidates by multi-signal relevance, returns top 4.
 * Includes zero-score candidates (same-category neighbors) when no signal matches exist.
 */
export function getRelatedProductsFallback(
  currentProduct: Product,
  candidates: Product[]
): Product[] {
  const scored = candidates
    .map((c) => ({ product: c, score: scoreCandidate(currentProduct, c) }))
    .sort((a, b) => b.score - a.score)

  // Prefer scored matches, but include unscored same-category items to fill up to 4
  const withScore = scored.filter((x) => x.score > 0)
  const withoutScore = scored.filter((x) => x.score === 0)
  return [...withScore, ...withoutScore].slice(0, 4).map((x) => x.product)
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
          .describe("Up to 4 product IDs, best match first"),
      }),
      prompt: `
You are a smart recommendation engine for Brandex — a design asset marketplace selling mockup templates, PSD label designs, packaging artwork, and brand asset files for designers and businesses.

A customer is currently viewing this product:
- Name: "${currentProduct.name}"
- Category: "${currentProduct.category?.name ?? "N/A"}"
- Tags: ${(currentProduct.keywords ?? []).slice(0, 10).join(", ") || "none"}
- Description: "${(currentProduct.description ?? "N/A").slice(0, 250)}"

Your job: choose the 4 products below that this customer would MOST WANT to download next.

Think like a designer browsing for assets:
- What is the PRIMARY USE CASE of the current product? (label design, product mockup, social post, etc.)
- What INDUSTRY or THEME does it serve? (food, tech, beauty, fashion, etc.)
- What FORMAT or PRODUCT TYPE is it? (bottle, box, pouch, smartwatch, phone, etc.)
- A good recommendation serves the SAME USE CASE or SAME THEME — ideally both.

Avoid recommending:
- Products that are near-identical to the current one (same item, slightly different name)
- Products with no thematic or use-case connection

CANDIDATES (sorted by keyword/name relevance score — higher score = stronger signal):
${pool
  .map(
    (p) =>
      `[${p.id}] score:${scores.get(p.id) ?? 0} | "${p.name}" | ${p.category?.name ?? "?"} | Tags: ${(p.keywords ?? []).slice(0, 6).join(", ") || "none"} | "${(p.description ?? "").slice(0, 100)}"`
  )
  .join("\n")}

Return exactly 4 IDs from the list above (fewer only if the pool has fewer than 4 truly relevant items). Best match first.
      `.trim(),
    })

    const validIds = new Set(pool.map((p) => p.id))
    return object.recommendedIds.filter((id) => validIds.has(id))
  } catch (err) {
    console.error("AI Recommender Error:", err instanceof Error ? err.message : err)
    return []
  }
}
