import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return NextResponse.json({ error: "API URL not configured" }, { status: 500 })
  }

  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const categoryParam = category ? `?category=${category}` : ""

  // Fetch downloads
  const downloadsRes = await fetch(`${apiUrl}/downloads${categoryParam}`, {
    headers: { "x-user-id": userId },
    cache: "no-store",
  })

  if (!downloadsRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch downloads" },
      { status: downloadsRes.status }
    )
  }

  const downloadsData = await downloadsRes.json()
  const raw: Record<string, unknown>[] = Array.isArray(downloadsData)
    ? downloadsData
    : downloadsData?.downloads ?? []

  if (raw.length === 0) return NextResponse.json([])

  // Build id -> slug map: try products list first
  const slugMap: Record<string, string> = {}

  const productsRes = await fetch(`${apiUrl}/products?limit=1000`, { cache: "no-store" })
  if (productsRes.ok) {
    const productsData = await productsRes.json()
    const products: { id: string; slug?: string }[] = productsData?.products ?? productsData ?? []
    for (const p of products) {
      if (p.id && p.slug) slugMap[p.id] = p.slug
    }
  }

  // For any download records still missing a slug, fetch the product individually
  const missingIds = raw
    .filter((d) => {
      const existingSlug = (d.productSlug as string | undefined) ?? (d.slug as string | undefined)
      return !existingSlug && !slugMap[d.productId as string] && d.productId
    })
    .map((d) => d.productId as string)

  if (missingIds.length > 0) {
    const fetched = await Promise.all(
      missingIds.map((id) =>
        fetch(`${apiUrl}/products/${id}`, { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    )
    for (const p of fetched) {
      if (p?.id && p?.slug) slugMap[p.id] = p.slug
    }
  }

  const enriched = raw.map((d) => ({
    ...d,
    productSlug:
      (d.productSlug as string | undefined) ??
      (d.slug as string | undefined) ??
      slugMap[d.productId as string] ??
      undefined,
  }))

  return NextResponse.json(enriched)
}
