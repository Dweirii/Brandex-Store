"use client";
import { useAuth } from "@clerk/nextjs";

export const useApiRequest = () => {
  const { getToken } = useAuth();    

  const apiRequest = async (path: string, options: RequestInit = {}) => {
    let token = null;

    try {
      token = await getToken({ template: "CustomerJWTBrandex" });    
    } catch (err) {
      alert("Failed to get token: " + err);
      throw new Error("Authentication failed");
    }

    const res = await fetch(`https://brandex-admin-main.vercel.app${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error:", errorText);
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  };

  return { apiRequest };
};
