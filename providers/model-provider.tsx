"use client";

import { useEffect, useState } from "react";

import PreviewModal from "@/components/PreviewModal";
import { PremiumModal } from "@/components/modals/premium-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PreviewModal />
      <PremiumModal />
    </>
  );
}

export default ModalProvider;
