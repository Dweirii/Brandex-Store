import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy subcategory requests to the admin API
 * This allows the storefront to display subcategory filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const storeId = searchParams.get("storeId");

    if (!categoryId || !storeId) {
      return NextResponse.json(
        { error: "Missing categoryId or storeId" },
        { status: 400 }
      );
    }

    // Get admin API URL from environment
    let adminBaseUrl = process.env.ADMIN_API_URL || "https://admin.wibimax.com";
    
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicApiUrl && !publicApiUrl.startsWith("/")) {
      adminBaseUrl = publicApiUrl.replace(/\/api\/.*$/, '');
    }
    
    // Forward request to admin API
    const adminUrl = new URL(`${adminBaseUrl}/api/${storeId}/subcategories/approved`);
    adminUrl.searchParams.set("categoryId", categoryId);

    const response = await fetch(adminUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch subcategories" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Subcategory proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
