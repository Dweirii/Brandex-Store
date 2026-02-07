"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

const getAdminBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_DOWNLOAD_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://admin.wibimax.com";
  const match = url.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : url;
};

const ADMIN_BASE_URL = getAdminBaseUrl();

interface CreditPurchase {
  id: string;
  amount: number;
  price: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  productName?: string;
  description?: string;
  createdAt: string;
}

interface Download {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  categoryName?: string;
  creditsUsed: number;
  isFree: boolean;
  createdAt: string;
}

interface UseCreditsReturn {
  balance: number;
  isLoading: boolean;
  error: string | null;
  purchases: CreditPurchase[];
  transactions: CreditTransaction[];
  downloads: Download[];
  refresh: () => Promise<void>;
  purchaseCredits: (packId: "PACK_50" | "PACK_100") => Promise<{ url?: string; error?: string }>;
}

export function useCredits(storeId: string): UseCreditsReturn {
  const { getToken, isSignedIn } = useAuth();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<CreditPurchase[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);

  const fetchBalance = useCallback(async () => {
    if (!isSignedIn) {
      setBalance(0);
      setIsLoading(false);
      return;
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" });
      if (!token) return;

      const response = await fetch(`${ADMIN_BASE_URL}/api/${storeId}/credits/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      const data = await response.json();
      setBalance(data.balance || 0);
      setError(null);
    } catch (err) {
      console.error("[useCredits] Error fetching balance:", err);
      setError("Failed to load credit balance");
    }
  }, [getToken, isSignedIn, storeId]);

  const fetchPurchases = useCallback(async () => {
    if (!isSignedIn) {
      setPurchases([]);
      return;
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" });
      if (!token) return;

      const response = await fetch(`${ADMIN_BASE_URL}/api/${storeId}/credits/purchase/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch purchases");
      }

      const data = await response.json();
      setPurchases(data.purchases || []);
    } catch (err) {
      console.error("[useCredits] Error fetching purchases:", err);
    }
  }, [getToken, isSignedIn, storeId]);

  const fetchTransactions = useCallback(async () => {
    if (!isSignedIn) {
      setTransactions([]);
      return;
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" });
      if (!token) return;

      const response = await fetch(`${ADMIN_BASE_URL}/api/${storeId}/credits/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("[useCredits] Error fetching transactions:", err);
    }
  }, [getToken, isSignedIn, storeId]);

  const fetchDownloads = useCallback(async () => {
    if (!isSignedIn) {
      setDownloads([]);
      return;
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" });
      if (!token) return;

      const response = await fetch(`${ADMIN_BASE_URL}/api/${storeId}/credits/downloads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch downloads");
      }

      const data = await response.json();
      setDownloads(data.downloads || []);
    } catch (err) {
      console.error("[useCredits] Error fetching downloads:", err);
    }
  }, [getToken, isSignedIn, storeId]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchBalance(),
      fetchPurchases(),
      fetchTransactions(),
      fetchDownloads(),
    ]);
    setIsLoading(false);
  }, [fetchBalance, fetchPurchases, fetchTransactions, fetchDownloads]);

  const purchaseCredits = useCallback(
    async (packId: "PACK_50" | "PACK_100") => {
      try {
        const token = await getToken({ template: "CustomerJWTBrandex" });
        if (!token) {
          return { error: "Please sign in to purchase credits" };
        }

        const response = await fetch(
          `${ADMIN_BASE_URL}/api/${storeId}/credits/purchase/checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ packId }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create checkout session");
        }

        const data = await response.json();
        return { url: data.url };
      } catch (err) {
        console.error("[useCredits] Error purchasing credits:", err);
        return {
          error: err instanceof Error ? err.message : "Failed to purchase credits",
        };
      }
    },
    [getToken, storeId]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    balance,
    isLoading,
    error,
    purchases,
    transactions,
    downloads,
    refresh,
    purchaseCredits,
  };
}
