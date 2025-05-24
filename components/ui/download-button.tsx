"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Button from "./Button";
import toast from "react-hot-toast";

interface DownloadButtonProps {
  storeId: string;
  productId: string;
}

export const DownloadButton = ({ storeId, productId }: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleDownload = async () => {
    setLoading(true);
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" });
      if (!token) throw new Error("User not authenticated");



      const res = await fetch(`http://localhost:3000/api/${storeId}/products/${productId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Download failed");
      }

      const { url } = await res.json();
      if (!url) throw new Error("Signed URL not found");

      window.open(url, "_blank");
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("Unauthorized");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} className="bg-black">
      {loading ? "Loading..." : "Download Now!"}
    </Button>
  );
};
