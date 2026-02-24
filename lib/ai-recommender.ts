import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import type { Product } from "@/types"

// ---------------------------------------------------------------------------
// Tokeniser shared by name + description scoring
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  "brandex", "mockup", "mockups", "design", "designs", "psd", "file", "files",
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
// Scorer
//
// Category is enforced as a HARD FILTER upstream (only same-category products
// are passed in as candidates). Within that pool, rank by:
//   1. Keywords    — each shared keyword          →  5 pts each
//   2. Name        — each shared meaningful word  →  3 pts each
//   3. Description — each shared meaningful word  →  1 pt  each
// ---------------------------------------------------------------------------

function scoreCandidate(current: Product, candidate: Product): number {
  let score = 0

  // --- 1. Keywords ---
  const currentKw = new Set(
    (current.keywords ?? []).map((k) => k.toLowerCase().trim()).filter(Boolean)
  )
  for (const kw of (candidate.keywords ?? []).map((k) => k.toLowerCase().trim())) {
    if (kw && currentKw.has(kw)) score += 5
  }

  // --- 2. Name ---
  const currentNameTokens = new Set(tokenise(current.name))
  for (const word of tokenise(candidate.name)) {
    if (currentNameTokens.has(word)) score += 3
  }

  // --- 3. Description ---
  if (current.description && candidate.description) {
    const currentDescTokens = new Set(tokenise(current.description))
    for (const word of tokenise(candidate.description)) {
      if (currentDescTokens.has(word)) score += 1
    }
  }

  return score
}

/**
 * Ranks same-category candidates by keywords → name → description.
 * Returns the top 8.
 */
export function getRelatedProductsFallback(
  currentProduct: Product,
  candidates: Product[]
): Product[] {
  return candidates
    .map((c) => ({ product: c, score: scoreCandidate(currentProduct, c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => x.product)
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
 * Uses Gemini 2.0 Flash Lite to rank related products.
 * All candidates are already from the same category — rank within that by:
 * keywords → name → description.
 */
export async function getRelatedProductsWithAI(
  currentProduct: Product,
  candidates: Product[]
): Promise<string[]> {
  const googleClient = buildGoogleClient()

  if (!googleClient) {
    console.warn("AI Recommender: No API key configured — using smart fallback.")
    return []
  }

  try {
    const pool = candidates.slice(0, 40)

    const { object } = await generateObject({
      model: googleClient("gemini-2.0-flash-lite"),
      schema: z.object({
        recommendedIds: z
          .array(z.string())
          .max(8)
          .describe("Up to 8 product IDs from the candidate list, best match first"),
      }),
      prompt: `
You are a product discovery expert for "Brandex" — a design asset marketplace (mockups, PSD files, packaging designs).

CURRENT PRODUCT:
- Name: "${currentProduct.name}"
- Category: "${currentProduct.category?.name ?? "N/A"}"
- Keywords: ${(currentProduct.keywords ?? []).join(", ") || "none"}
- Description: ${currentProduct.description ?? "N/A"}

CANDIDATE PRODUCTS — all are from the same category as the current product. Pick the best 8:
${pool
  .map(
    (p) =>
      `[${p.id}] ${p.name} | KW: ${(p.keywords ?? []).join(", ") || "none"} | Desc: ${(p.description ?? "").slice(0, 120)}`
  )
  .join("\n")}

RANKING PRIORITY (within the same category):
1. KEYWORDS — products sharing more keywords with the current product rank higher.
2. NAME — products whose name contains similar subject or product type rank higher.
3. DESCRIPTION — products whose description overlaps in theme or use case get a small boost.

STRICT RULES:
- Return ONLY IDs from the list above — never invent IDs.
- Return exactly 8 IDs (fewer only if pool has fewer than 8), best match first.
- Prefer variety — do not return 8 near-identical items.
- Ignore generic keywords: new, trending, hot, premium, exclusive.
      `.trim(),
    })

    const validIds = new Set(pool.map((p) => p.id))
    return object.recommendedIds.filter((id) => validIds.has(id))
  } catch (err) {
    console.error("AI Recommender Error:", err instanceof Error ? err.message : err)
    return []
  }
}
