import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Get metadata to determine dimensions
    const metadata = await sharp(inputBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // Create SVG watermark
    // We want a diagonal "BRANDEX" text
    // Adjust font size based on image width
    const fontSize = Math.floor(width * 0.15); // 15% of width

    const svgWatermark = `
      <svg width="${width}" height="${height}">
        <style>
          .watermark { 
            fill: rgba(251, 191, 36, 0.4); /* #FBBF24 with 0.4 opacity */
            font-size: ${fontSize}px; 
            font-weight: 900;
            font-family: sans-serif;
            text-anchor: middle;
            dominant-baseline: middle;
          }
        </style>
        <text 
          x="50%" 
          y="50%" 
          class="watermark" 
          transform="rotate(-12, ${width / 2}, ${height / 2})"
        >
          BRANDEX
        </text>
      </svg>
    `;

    // Composite watermark over original image
    const processedImageBuffer = await sharp(inputBuffer)
      .composite([
        {
          input: Buffer.from(svgWatermark),
          top: 0,
          left: 0,
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
