import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy search requests to the admin API (which uses Typesense)
 * This allows the storefront to use fast Typesense search
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const storeId = searchParams.get("storeId");
    const categoryId = searchParams.get("categoryId");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (!query || !storeId) {
      return NextResponse.json(
        { error: "Missing query or storeId" },
        { status: 400 }
      );
    }

    // Get admin API URL from environment
    // If NEXT_PUBLIC_API_URL points to admin, use it; otherwise default to admin.wibimax.com
    let adminBaseUrl = process.env.ADMIN_API_URL || "https://admin.wibimax.com";
    
    // Check if NEXT_PUBLIC_API_URL is set and points to admin (not local /api)
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicApiUrl && !publicApiUrl.startsWith("/")) {
      adminBaseUrl = publicApiUrl;
    }
    
    // Build the admin API URL
    const adminUrl = new URL(`${adminBaseUrl}/api/${storeId}/products/search`);
    adminUrl.searchParams.set("query", query);
    if (categoryId) adminUrl.searchParams.set("categoryId", categoryId);
    if (page) adminUrl.searchParams.set("page", page);
    if (limit) adminUrl.searchParams.set("limit", limit);

    // Forward request to admin API (which uses Typesense)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(adminUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Admin API error: ${response.status} ${response.statusText}`);
        return NextResponse.json(
          { error: "Search failed" },
          { status: response.status }
        );
      }

      const data = await response.json();

      // Return the response with CORS + cache headers
      // Cache search results for 30 seconds to speed up repeated/back-nav searches
      return NextResponse.json(data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error("Typesense search timeout:", fetchError);
        return NextResponse.json(
          { error: "Search timeout - please try again" },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Search proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

