"use client";

import { useEffect, useState } from "react";

const getAdminBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_DOWNLOAD_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://admin.wibimax.com";
  const match = url.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : url;
};

const ADMIN_BASE_URL = getAdminBaseUrl();

const memoryCache = new Map<string, number>();

export function useFileSize(storeId: string | undefined, productId: string | undefined) {
  const key = storeId && productId ? `${storeId}:${productId}` : null;
  const [bytes, setBytes] = useState<number | null>(() =>
    key ? memoryCache.get(key) ?? null : null
  );

  useEffect(() => {
    if (!key || !storeId || !productId) return;

    const cached = memoryCache.get(key);
    if (cached != null) {
      setBytes(cached);
      return;
    }

    let aborted = false;
    const controller = new AbortController();

    fetch(`${ADMIN_BASE_URL}/api/${storeId}/products/${productId}/file-size`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (aborted || !data || typeof data.bytes !== "number") return;
        memoryCache.set(key, data.bytes);
        setBytes(data.bytes);
      })
      .catch(() => {
        // swallow — size is a nice-to-have
      });

    return () => {
      aborted = true;
      controller.abort();
    };
  }, [key, storeId, productId]);

  return bytes;
}
