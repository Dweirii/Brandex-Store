"use client";

import { useAuth } from "@clerk/nextjs";

export const useApiRequest = () => {
  const { getToken } = useAuth();

  const apiRequest = async (path: string, options: RequestInit = {}) => {
    let token: string | null = null;

    try {
      token = await getToken({ template: "CustomerJWTBrandex" });
      if (!token) throw new Error("Missing token from Clerk");
    } catch (err: any) {
      console.error("Failed to get Clerk token:", err.message);
      throw new Error("Authentication failed");
    }

    const res = await fetch(`http://localhost:3000${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API Error:", errorText);
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  };

  return { apiRequest };
};
