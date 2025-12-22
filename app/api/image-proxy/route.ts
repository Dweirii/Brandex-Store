import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";

// Force Node.js runtime (Sharp does not work on Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, { cache: 'no-store' });
    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Get metadata to determine dimensions
    const metadata = await sharp(inputBuffer).metadata();
    const width = metadata.width || 800;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const height = metadata.height || 600;

    // Use pre-rendered watermark PNG (avoids fontconfig dependency in production)
    const watermarkPath = path.join(process.cwd(), 'public/water-mark.png');

    // Calculate watermark size (proportional to image)
    const watermarkWidth = Math.floor(width * 0.14); // 14% of image width for tiling

    // Resize and rotate the watermark
    const watermarkBase = await sharp(watermarkPath)
      .resize({ width: watermarkWidth })
      .rotate(25, { background: { r: 0, g: 0, b: 0, alpha: 0 } }) // Changed to +30
      .toBuffer();

    // Add padding to the watermark to space it out when tiled
    const wmMetadata = await sharp(watermarkBase).metadata();
    const wmWidth = wmMetadata.width || watermarkWidth;
    const wmHeight = wmMetadata.height || Math.floor(watermarkWidth * 0.5);

    const paddedWatermark = await sharp({
      create: {
        width: Math.floor(wmWidth * 1.3),
        height: Math.floor(wmHeight * 1.3),
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: watermarkBase, gravity: 'center' }])
      .png()
      .toBuffer();

    // Composite watermark over original image with tiling
    const processedImageBuffer = await sharp(inputBuffer)
      .composite([
        {
          input: paddedWatermark,
          tile: true,
          blend: 'over'
        },
      ])
      .toBuffer();

    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(processedImageBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
