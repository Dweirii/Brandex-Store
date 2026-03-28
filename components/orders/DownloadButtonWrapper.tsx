// components/orders/DownloadButtonWrapper.tsx
'use client'

import { DownloadButton } from '@/components/ui/download-button'

export default function DownloadButtonWrapper({ storeId, productId, className }: { storeId: string; productId: string; className?: string }) {
  return <DownloadButton storeId={storeId} productId={productId} className={className} />
}
