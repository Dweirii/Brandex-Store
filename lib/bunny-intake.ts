const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY ?? "";
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE ?? "brandex-cdn";
const BUNNY_STORAGE_REGION = process.env.BUNNY_STORAGE_REGION ?? "";
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME ?? "brandex-cdn.b-cdn.net";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
]);

const MAX_SIZES: Record<string, number> = {
  image: 8 * 1024 * 1024,
  "application/pdf": 20 * 1024 * 1024,
  zip: 25 * 1024 * 1024,
};

function getStorageBaseUrl() {
  const region = BUNNY_STORAGE_REGION ? `${BUNNY_STORAGE_REGION}.` : "";
  return `https://${region}storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;
}

function sanitize(s: string) {
  return s.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

function getMaxSize(mimeType: string): number {
  if (mimeType.startsWith("image/")) return MAX_SIZES["image"];
  if (mimeType === "application/pdf") return MAX_SIZES["application/pdf"];
  return MAX_SIZES["zip"];
}

export function validateIntakeFile(mimeType: string, sizeBytes: number): string | null {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return `File type "${mimeType}" is not allowed. Accepted: images, PDF, ZIP.`;
  }
  const maxSize = getMaxSize(mimeType);
  if (sizeBytes > maxSize) {
    const mb = (maxSize / (1024 * 1024)).toFixed(0);
    return `File exceeds the ${mb} MB size limit for this type.`;
  }
  return null;
}

export async function uploadIntakeFile(
  buffer: Buffer,
  submissionId: string,
  originalName: string,
  mimeType: string
): Promise<{ url: string; storagePath: string }> {
  const timestamp = Date.now();
  const random = crypto.randomUUID().slice(0, 8);
  const safeId = sanitize(submissionId);
  const safeName = sanitize(originalName);
  const path = `intake/${safeId}/${timestamp}_${random}_${safeName}`;
  const storageUrl = `${getStorageBaseUrl()}/${path}`;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    try {
      const res = await fetch(storageUrl, {
        method: "PUT",
        headers: {
          AccessKey: BUNNY_STORAGE_API_KEY,
          "Content-Type": mimeType,
        },
        body: new Uint8Array(buffer),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.text().catch(() => "Unknown error");
        throw new Error(`BunnyCDN upload failed (${res.status}): ${err}`);
      }

      return { url: `https://${BUNNY_CDN_HOSTNAME}/${path}`, storagePath: path };
    } catch (error) {
      clearTimeout(timeout);
      if (attempt < MAX_RETRIES && error instanceof Error && (error.name === "AbortError" || error instanceof TypeError)) {
        await new Promise((r) => setTimeout(r, attempt * 2000));
        continue;
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("BunnyCDN upload failed after all retries");
}
