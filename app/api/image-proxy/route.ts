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

    // Calculate watermark size — small like Freepik style
    const watermarkWidth = Math.floor(width * 0.15);

    // Resize and rotate the watermark
    const rotatedWm = await sharp(watermarkPath)
      .resize({ width: watermarkWidth })
      .rotate(11.36, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Make the watermark white and very subtle
    const pixels = Buffer.from(rotatedWm.data);
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3];
      pixels[i] = 255;     // R — white
      pixels[i + 1] = 255; // G — white
      pixels[i + 2] = 255; // B — white
      pixels[i + 3] = Math.floor(alpha * 0.90); // 90% opacity — much more visible
    }

    const watermarkBase = await sharp(pixels, {
      raw: {
        width: rotatedWm.info.width,
        height: rotatedWm.info.height,
        channels: 4,
      },
    }).png().toBuffer();

    // Composite watermark over original image with tiling
    const processedImageBuffer = await sharp(inputBuffer)
      .composite([
        {
          input: watermarkBase,
          tile: true,
          blend: 'over',
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
