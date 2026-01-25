"use client"

import { useState, useRef } from "react"
import { ImageIcon, X, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

// Storage keys for sessionStorage
const STORAGE_KEY_IMAGE = '__imageSearchData'
const STORAGE_KEY_ID = '__imageSearchId'

interface ImageSearchButtonProps {
  className?: string
  disabled?: boolean
}

// Helper to store image data in sessionStorage
function storeImageData(file: File, imageId: string) {
  if (typeof window === 'undefined') return
  
  const reader = new FileReader()
  reader.onloadend = () => {
    const base64 = reader.result as string
    try {
      sessionStorage.setItem(STORAGE_KEY_IMAGE, base64)
      sessionStorage.setItem(STORAGE_KEY_ID, imageId)
      console.log('✅ Image stored in sessionStorage')
    } catch (e) {
      console.error('Failed to store image:', e)
    }
  }
  reader.readAsDataURL(file)
}

// Define window extension for image search
interface WindowWithBrandexImageSearch extends Window {
  __brandexImageSearch?: {
    imageData: string
    imageId: string
    timestamp: number
  }
}

// Helper to retrieve stored image data
export function getStoredImageData(imageId: string): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    // First try global window object (new method)
    const globalData = (window as WindowWithBrandexImageSearch).__brandexImageSearch
    if (globalData && globalData.imageId === imageId) {
      return globalData.imageData
    }
    
    // Fallback to sessionStorage (old method, but will fail for large images)
    const storedId = sessionStorage.getItem(STORAGE_KEY_ID)
    if (storedId !== imageId) return null
    
    return sessionStorage.getItem(STORAGE_KEY_IMAGE)
  } catch (e) {
    console.error('Failed to retrieve image:', e)
    return null
  }
}

// Helper to clear stored image data
function clearStoredImageData() {
  if (typeof window === 'undefined') return
  
  try {
    sessionStorage.removeItem(STORAGE_KEY_IMAGE)
    sessionStorage.removeItem(STORAGE_KEY_ID)
  } catch (e) {
    console.error('Failed to clear image:', e)
  }
}

export function ImageSearchButton({ className, disabled }: ImageSearchButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentImageId, setCurrentImageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    // Validate file is a proper File object
    if (!file || !(file instanceof File)) {
      console.error('Invalid file object')
      toast.error('Invalid file selected')
      return
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 10MB')
      return
    }
    
    if (file.type.startsWith('image/')) {
      const imageId = Date.now().toString()
      setCurrentImageId(imageId)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreview(base64)
        // Store in sessionStorage for persistence
        storeImageData(file, imageId)
        toast.success('Image loaded successfully')
      }
      reader.onerror = () => {
        toast.error('Failed to load image')
        setCurrentImageId(null)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)')
    }
  }

  const handleSearch = () => {
    // Validate that we have an image ID (means image was uploaded)
    if (!currentImageId || !preview) {
      toast.error('No image selected')
      return
    }
    
    setIsUploading(true)
    const toastId = toast.loading('Searching for similar products...')
    
    try {
      // Store in global window object (temporary, works for single session)
      if (typeof window !== 'undefined') {
        try {
          // Store as a global variable instead of sessionStorage to avoid quota issues
          (window as WindowWithBrandexImageSearch).__brandexImageSearch = {
            imageData: preview,
            imageId: currentImageId,
            timestamp: Date.now()
          }
          console.log('✅ Image stored for search:', currentImageId)
        } catch (e) {
          console.error('Failed to store image for search:', e)
          toast.error('Failed to store image. Please try again.', { id: toastId })
          setIsUploading(false)
          return
        }
      }
      
      const params = new URLSearchParams()
      
      params.set("imageSearch", "true")
      params.set("page", "1")
      params.set("imageId", currentImageId)
      
      const storeId = searchParams.get("storeId")
      if (storeId) {
        params.set("storeId", storeId)
      }
      
      toast.success('Search started!', { id: toastId })
      router.push(`/products/search?${params.toString()}`)
      setIsUploading(false)
    } catch (error) {
      console.error('Image search error:', error)
      toast.error('Search failed. Please try again.', { id: toastId })
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setCurrentImageId(null)
    setPreview(null)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Clear storage
    clearStoredImageData()
    // Clear global object too
    if (typeof window !== 'undefined') {
      delete (window as WindowWithBrandexImageSearch).__brandexImageSearch
    }
  }

  const handleButtonClick = () => {
    if (preview) {
      // If we have a preview, clear it
      handleClear()
    } else {
      // Otherwise, open file picker
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      <Button
        type="button"
        variant={preview ? "default" : "outline"}
        size="icon"
        className={cn(
          "h-9 w-9 shrink-0",
          preview && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        onClick={handleButtonClick}
        disabled={disabled || isUploading}
        title={preview ? "Clear image" : "Search by image"}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : preview ? (
          <X className="h-4 w-4" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </Button>
      
      {preview && (
        <div className="absolute top-full right-0 mt-2 bg-background border rounded-lg p-3 shadow-xl z-50 min-w-[200px]">
          <div className="relative mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={preview} 
              alt="Search preview" 
              className="w-full h-32 object-cover rounded border"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            className="w-full"
            disabled={isUploading}
            size="sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-3 w-3 mr-2" />
                Find Similar
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
