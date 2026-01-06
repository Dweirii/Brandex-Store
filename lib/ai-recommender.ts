// Note: We no longer need to manually create the provider object
// The Vercel AI SDK will automatically route through the gateway
// when using string-based model IDs if AI_GATEWAY_API_KEY is set.

import { generateObject } from 'ai';
import { z } from 'zod';
import { Product } from '@/types';

/**
 * Uses AI to select the most relevant products from a candidate pool.
 */
export async function getRelatedProductsWithAI(
    currentProduct: Product,
    candidates: Product[]
): Promise<string[]> {
    try {
        if (!process.env.AI_GATEWAY_API_KEY) {
            console.warn("AI Recommender: Missing AI_GATEWAY_API_KEY. Falling back.");
            return [];
        }

        console.log("AI Recommender: Attempting to use Vercel AI Gateway with 'google/gemini-2.5-flash-lite'");

        const { object } = await generateObject({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            model: 'google/gemini-2.5-flash-lite' as any,
            schema: z.object({
                recommendedIds: z.array(z.string()).describe("List of product IDs sorted by relevance"),
            }),
            prompt: `
        You are a high-end luxury fashion and product discovery expert for "Brandex".
        Your mission is to curate the "Related Items" section for a product page with 10/10 relevance.
        
        CURRENT PRODUCT (The context):
        - Name: "${currentProduct.name}"
        - Category: "${currentProduct.category?.name}"
        - Keywords: ${currentProduct.keywords?.join(', ')}
        - Description: ${currentProduct.description || 'N/A'}
        
        CANDIDATE LIST (Choose the best 8 from these):
        ${candidates.map(p => `- [ID: ${p.id}] Name: ${p.name}, Category: ${p.category?.name}, Keywords: ${p.keywords?.join(', ')}`).join('\n')}
        
        GUIDELINES FOR 10/10 RELEVANCE:
        1. STRATEGIC MATCHING: Look for products that "complete the set" or are "stylistically identical". 
        2. KEYWORD INTELLIGENCE: Ignore generic keywords like "New", "Trending", "Hot". Focus on specific identifiers (e.g., "Carbon Fiber", "Matte Black", "iPhone 15").
        3. PRODUCT TYPE HIERARCHY:
           - Priority A: Same style/theme but slightly different function (e.g., Car Key Fob and Matching Wallet).
           - Priority B: Accessories for the same device/model (e.g., iPhone 15 Case and iPhone 15 Screen Protector).
           - Priority C: Items from the exact same sub-collection.
        4. CROSS-CATEGORY RELEVANCE: If the current product is a "Case", related items aren't just other cases—they are wallets, straps, or screen protectors that match the VIBE.
        5. AVOID REDUNDANCY: Don't just pick 8 identical items in different colors. Variety within the same style is better.
        
        Think like a personal stylist. Return exactly 8 product IDs, sorted from the absolute "Must-Buy" match to the least relevant of the top 8.
      `,
        });

        return object.recommendedIds;
    } catch {
        console.error("AI Recommender Error:");
        return [];
    }
}
