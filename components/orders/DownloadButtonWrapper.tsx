// components/orders/DownloadButtonWrapper.tsx
'use client'

import { DownloadButton } from '@/components/ui/download-button'

export default function DownloadButtonWrapper({ storeId, productId }: { storeId: string; productId: string }) {
  return <DownloadButton storeId={storeId} productId={productId} />
}
