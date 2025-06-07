"use client"

import usePreviewModal from "@/hooks/use-preview-modal"
import Modal from "./ui/modal" // This is the custom Modal component
import Gallery from "./gallery"
import Info from "./info"

const PreviewModal = () => {
  const previewModal = usePreviewModal()
  const product = usePreviewModal((state) => state.data)

  if (!product) {
    return null
  }

  return (
    <Modal open={previewModal.isOpen} onClose={previewModal.onClose}>
      <div className="flex flex-col w-full gap-6 md:gap-10">
        {/* Mobile view - stacked layout */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
          {/* GALLERY COLUMN - full width on mobile, proportional on larger screens */}
          <div className="col-span-1 md:col-span-5 lg:col-span-5">
            <Gallery images={product.images} />
          </div>

          {/* INFO COLUMN - full width on mobile, proportional on larger screens */}
          <div className="col-span-1 md:col-span-7 lg:col-span-7">
            <Info data={product} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PreviewModal
