import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
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
    // 1. Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // 2. Get metadata to determine dimensions
    const metadata = await sharp(inputBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // 3. Prepare the Watermark (Use local Logo file to avoid Font issues in Prod)
    // We try to find the logo file in the public directory
    const logoName = "Logo-white.png"; // Use white logo for better watermark contrast
    const logoPath = path.join(process.cwd(), "public", logoName);

    let watermarkBuffer: Buffer;

    try {
      if (fs.existsSync(logoPath)) {
        // Load and resize logo to be 40% of the image width
        const logoWidth = Math.floor(width * 0.4);

        watermarkBuffer = await sharp(logoPath)
          .resize({ width: logoWidth })
          .rotate(-12, { background: { r: 0, g: 0, b: 0, alpha: 0 } }) // Rotate -12deg with transparent bg
          .ensureAlpha(0.3) // 30% Opacity (Note: ensureAlpha might not be enough, composite options better)
          .toBuffer();

      } else {
        // Fallback to SVG text if file not found (though it should be there)
        console.warn("Watermark logo not found at:", logoPath);
        throw new Error("Logo not found");
      }
    } catch (e) {
      // Fallback SVG if file loading fails
      const fontSize = Math.floor(width * 0.15);
      const svgWatermark = `
        <svg width="${width}" height="${height}">
          <style>
            .watermark { 
              fill: rgba(251, 191, 36, 0.4); 
              font-size: ${fontSize}px; 
              font-weight: 900;
              font-family: sans-serif;
              text-anchor: middle;
              dominant-baseline: middle;
            }
          </style>
          <text x="50%" y="50%" class="watermark" transform="rotate(-12, ${width / 2}, ${height / 2})">BRANDEX</text>
        </svg>
      `;
      watermarkBuffer = Buffer.from(svgWatermark);
    }

    // 4. Composite watermark
    const processedImageBuffer = await sharp(inputBuffer)
      .composite([
        {
          input: watermarkBuffer,
          gravity: 'center',
          blend: 'over',
          // If using the image based watermark, we rely on the image's own alpha or pre-processing
          // For SVG it works as is.
        },
      ])
      .toBuffer();

    // Determine content type
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(processedImageBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
