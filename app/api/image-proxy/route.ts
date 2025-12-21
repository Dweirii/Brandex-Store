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

    // Read and embed the font as base64 (required for production environments)
    const fontPath = path.join(process.cwd(), 'assets/fonts/Inter-Bold.ttf');
    const fontBase64 = fs.readFileSync(fontPath).toString('base64');

    // Create minimal semi-transparent text watermark with embedded font
    const fontSize = Math.floor(width * 0.08); // Smaller, more minimal size
    const svgWatermark = `
      <svg width="${width}" height="${height}">
        <defs>
          <style>
            @font-face {
              font-family: 'Inter';
              src: url(data:font/ttf;base64,${fontBase64}) format('truetype');
              font-weight: bold;
            }
          </style>
          <filter id="shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <style>
          .watermark { 
            fill: rgba(255, 255, 255, 0.6); 
            font-size: ${fontSize}px; 
            font-weight: bold;
            font-family: 'Inter', sans-serif; 
            text-anchor: middle;
            dominant-baseline: middle;
            letter-spacing: 0.05em;
            stroke: rgba(0, 0, 0, 0.2);
            stroke-width: 1px;
            filter: url(#shadow);
          }
        </style>
        <text x="50%" y="50%" class="watermark" transform="rotate(-15, ${width / 2}, ${height / 2})">
          Brandex
        </text>
      </svg>
    `;
    const watermarkBuffer = Buffer.from(svgWatermark);

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
