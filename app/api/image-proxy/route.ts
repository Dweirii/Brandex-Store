import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";

// Force Node.js runtime (Sharp does not work on Edge)
export const runtime = 'nodejs';
const watermarkTileCache = new Map<number, Buffer>();

function parseIntegerParam(value: string | null, min: number, max: number): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, parsed));
}

async function buildWatermarkTile(watermarkWidth: number): Promise<Buffer> {
  const cached = watermarkTileCache.get(watermarkWidth);
  if (cached) return cached;

  const watermarkPath = path.join(process.cwd(), "public/water-mark.png");
  const rotatedWm = await sharp(watermarkPath)
    .resize({ width: watermarkWidth })
    .rotate(11.36, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Make the watermark white and subtle.
  const pixels = Buffer.from(rotatedWm.data);
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    pixels[i] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = Math.floor(alpha * 0.9);
  }

  const watermarkBase = await sharp(pixels, {
    raw: {
      width: rotatedWm.info.width,
      height: rotatedWm.info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();

  watermarkTileCache.set(watermarkWidth, watermarkBase);
  if (watermarkTileCache.size > 16) {
    const oldestKey = watermarkTileCache.keys().next().value;
    if (typeof oldestKey === "number") watermarkTileCache.delete(oldestKey);
  }

  return watermarkBase;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");
  const targetWidth = parseIntegerParam(searchParams.get("w"), 200, 2400);
  const quality = parseIntegerParam(searchParams.get("q"), 40, 90) ?? 74;
  const shouldWatermark = searchParams.get("wm") !== "0";

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let pipeline = sharp(inputBuffer);
    if (targetWidth) {
      pipeline = pipeline.resize({
        width: targetWidth,
        withoutEnlargement: true,
      });
    }

    if (shouldWatermark) {
      const fallbackWidth = targetWidth ?? 800;
      const metadata = targetWidth ? null : await sharp(inputBuffer).metadata();
      const watermarkBaseWidth = targetWidth ?? metadata?.width ?? fallbackWidth;
      const watermarkWidth = Math.max(64, Math.floor(watermarkBaseWidth * 0.15));
      const watermarkTile = await buildWatermarkTile(watermarkWidth);
      pipeline = pipeline.composite([
        {
          input: watermarkTile,
          tile: true,
          blend: "over",
        },
      ]);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const isPng = contentType.includes("png");
    const isWebp = contentType.includes("webp");
    const isAvif = contentType.includes("avif");

    const processedImageBuffer = isPng
      ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
      : isWebp
        ? await pipeline.webp({ quality }).toBuffer()
        : isAvif
          ? await pipeline.avif({ quality }).toBuffer()
          : await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();

    return new NextResponse(processedImageBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": isPng ? "image/png" : isWebp ? "image/webp" : isAvif ? "image/avif" : "image/jpeg",
        // Keep browser + CDN cache hot for generated thumbnails.
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
