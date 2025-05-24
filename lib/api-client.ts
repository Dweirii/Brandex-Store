"use client";
import { useAuth } from "@clerk/nextjs";

export const useApiRequest = () => {
  const { getToken } = useAuth(); // ✅ مرة واحدة فقط

  const apiRequest = async (path: string, options: RequestInit = {}) => {
    let token = null;

    try {
      token = await getToken({ template: "CustomerJWTBrandex" }); // ✅ اسم التمبلت
      alert("🪪 JWT Token: " + token); // ✅ عرض التوكن لتتأكد من وجوده
    } catch (err) {
      alert("Failed to get token: " + err);
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
