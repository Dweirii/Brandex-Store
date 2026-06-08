import { NextRequest, NextResponse } from "next/server";
import { categoryParamToId } from "@/lib/category-slugs";

/**
 * Proxy search requests to the admin API (Typesense).
 *
 * Search is restricted to ONLY Packaging + Mockups — products from any other
 * category (Images, PSD Lab, Vectors, Motion, …) never appear in results.
 * The admin search filters one category at a time, so when no specific
 * (allowed) category is chosen we run both searches in parallel and merge.
 */

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
} as const;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const storeId = searchParams.get("storeId");
    const categoryId = searchParams.get("categoryId");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 24;
    const priceFilter = searchParams.get("priceFilter");
    const subcategories = searchParams.get("subcategories");
    const fileType = searchParams.get("fileType");
    const size = searchParams.get("size");

    if (!query || !storeId) {
      return NextResponse.json({ error: "Missing query or storeId" }, { status: 400 });
    }

    // Resolve the search base. NEXT_PUBLIC_API_URL already includes /api/{store}
    // (same base getProducts uses), so we just append /products/search to it.
    // Fall back to ADMIN_API_URL + /api/{store} when it's a local "/api" proxy.
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const searchBase =
      publicApiUrl && !publicApiUrl.startsWith("/")
        ? publicApiUrl
        : `${process.env.ADMIN_API_URL || "https://admin.wibimax.com"}/api/${storeId}`;

    const ALLOWED_IDS = [categoryParamToId("packaging"), categoryParamToId("mockups")];

    const buildUrl = (catId: string, lim: number, pg: number) => {
      const url = new URL(`${searchBase}/products/search`);
      url.searchParams.set("query", query);
      url.searchParams.set("categoryId", catId);
      url.searchParams.set("page", String(pg));
      url.searchParams.set("limit", String(lim));
      if (priceFilter && priceFilter !== "all") url.searchParams.set("priceFilter", priceFilter);
      if (subcategories) url.searchParams.set("subcategories", subcategories);
      if (fileType) url.searchParams.set("fileType", fileType);
      if (size) url.searchParams.set("size", size);
      return url.toString();
    };

    const fetchJson = async (url: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Admin API error: ${res.status}`);
        return await res.json();
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // A specific, allowed category was chosen → single scoped search.
    if (categoryId && ALLOWED_IDS.includes(categoryId)) {
      const data = await fetchJson(buildUrl(categoryId, limit, page));
      return NextResponse.json(data, { headers: RESPONSE_HEADERS });
    }

    // Otherwise restrict to Packaging + Mockups: search both and interleave.
    const half = Math.max(1, Math.ceil(limit / 2));
    const [packaging, mockups] = await Promise.all([
      fetchJson(buildUrl(ALLOWED_IDS[0], half, page)),
      fetchJson(buildUrl(ALLOWED_IDS[1], half, page)),
    ]);

    const a = packaging.results || [];
    const b = mockups.results || [];
    const results = [];
    for (let i = 0; i < half; i++) {
      if (a[i]) results.push(a[i]);
      if (b[i]) results.push(b[i]);
    }

    return NextResponse.json(
      {
        results,
        total: (packaging.total || 0) + (mockups.total || 0),
        page,
        pageCount: Math.max(packaging.pageCount || 1, mockups.pageCount || 1),
        limit,
      },
      { headers: RESPONSE_HEADERS }
    );
  } catch (error) {
    console.error("Search proxy error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
