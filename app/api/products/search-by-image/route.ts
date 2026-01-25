import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy image search requests to the admin API (which uses Typesense)
 * This allows the storefront to use image-based search
 */
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("storeId");

    // Get the form data from the request
    const formData = await req.formData();

    // Get admin API URL from environment
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!publicApiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }
    
    // Extract storeId from the base URL if it's included
    // NEXT_PUBLIC_API_URL format: http://localhost:3001/api/a940170f-.../...
    const urlParts = publicApiUrl.split('/api/');
    let storeId = storeIdParam;
    
    if (urlParts.length > 1 && urlParts[1]) {
      // Extract storeId from URL
      storeId = urlParts[1].split('/')[0] || storeIdParam;
    }
    
    if (!storeId) {
      return NextResponse.json(
        { error: "Missing storeId" },
        { status: 400 }
      );
    }
    
    // Build base URL (everything before /api/)
    const adminBaseUrl = urlParts[0];
    
    // Build the admin API URL
    const adminUrl = new URL(`${adminBaseUrl}/api/${storeId}/products/search-by-image`);

    // Forward request to admin API (which uses Typesense)
    const response = await fetch(adminUrl.toString(), {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
    });

    if (!response.ok) {
      console.error(`Admin API error: ${response.status} ${response.statusText}`);
      const errorData = await response.json().catch(() => ({ error: "Search failed" }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the response with CORS headers
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Image search proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
