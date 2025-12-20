import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";

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
    const height = metadata.height || 600;

    let watermarkBuffer;

    try {
      // PROD FIX: Use the actual Brandex Logo file instead of text rendering
      // Text rendering relies on system fonts which are often missing in Serverless environments
      const logoPath = path.join(process.cwd(), 'public', 'Logo-white.png');
      const logoFile = await fs.readFile(logoPath);

      // Calculate logo size (e.g., 40% of image width)
      const targetLogoWidth = Math.floor(width * 0.4);

      watermarkBuffer = await sharp(logoFile)
        .resize({ width: targetLogoWidth })
        .rotate(-12, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .ensureAlpha(0.3) // Make it semi-transparent
        .toBuffer();

    } catch (e) {
      console.warn("Could not load logo file for watermark, using text fallback:", e);
      // Fallback to SVG text if file read fails
      const fontSize = Math.floor(width * 0.15);
      const svgWatermark = `
        <svg width="${width}" height="${height}">
          <style>
            .watermark { 
              fill: rgba(251, 191, 36, 0.5); 
              font-size: ${fontSize}px; 
              font-weight: 900;
              font-family: 'Verdana', 'Arial', 'Helvetica', sans-serif; 
              text-anchor: middle;
              dominant-baseline: middle;
            }
          </style>
          <text x="50%" y="50%" class="watermark" transform="rotate(-12, ${width / 2}, ${height / 2})">
            BRANDEX
          </text>
        </svg>
      `;
      watermarkBuffer = Buffer.from(svgWatermark);
    }

    // Composite watermark over original image
    const processedImageBuffer = await sharp(inputBuffer)
      .composite([
        {
          input: watermarkBuffer,
          gravity: 'center', // Center the watermark
          blend: 'over'
        },
      ])
      .toBuffer();

    // Determine content type
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
