import { NextRequest, NextResponse } from "next/server"

const ALLOWED_HOSTS = new Set(["brandex-cdn.b-cdn.net"])

function safeBaseName(input: string | null): string {
  const normalized = (input || "product-image").trim().toLowerCase().replace(/\s+/g, "-")
  const cleaned = normalized.replace(/[^a-z0-9._-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "")
  return cleaned || "product-image"
}

function extFromContentType(contentType: string): string {
  const type = contentType.toLowerCase()
  if (type.includes("png")) return ".png"
  if (type.includes("webp")) return ".webp"
  if (type.includes("avif")) return ".avif"
  if (type.includes("gif")) return ".gif"
  if (type.includes("svg")) return ".svg"
  return ".jpg"
}

function extFromPath(pathname: string): string {
  const match = pathname.toLowerCase().match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/)
  return match ? `.${match[1] === "jpeg" ? "jpg" : match[1]}` : ".jpg"
}

function resolveSource(src: string, origin: string): URL | null {
  try {
    if (src.startsWith("/")) {
      // Allow only safe internal sources (e.g., /api/image-proxy?...).
      if (src.startsWith("/api/product-image-download")) return null
      return new URL(src, origin)
    }
    return new URL(src)
  } catch {
    return null
  }
}

function isAllowedUrl(url: URL, origin: string): boolean {
  if (url.origin === origin) return true
  return ALLOWED_HOSTS.has(url.hostname.toLowerCase())
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const src = searchParams.get("src")
  const name = searchParams.get("name")

  if (!src) {
    return new NextResponse("Missing src parameter", { status: 400 })
  }

  const sourceUrl = resolveSource(src, origin)
  if (!sourceUrl || !isAllowedUrl(sourceUrl, origin)) {
    return new NextResponse("Invalid image source", { status: 400 })
  }

  try {
    const upstream = await fetch(sourceUrl.toString(), { cache: "no-store" })
    if (!upstream.ok) {
      return new NextResponse("Failed to fetch image", { status: upstream.status })
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg"
    const ext = sourceUrl.origin === origin ? extFromContentType(contentType) : extFromPath(sourceUrl.pathname)
    const fileName = `${safeBaseName(name)}-image${ext}`
    const bytes = Buffer.from(await upstream.arrayBuffer())

    return new NextResponse(bytes as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("product-image-download error:", error)
    return new NextResponse("Failed to download image", { status: 500 })
  }
}
