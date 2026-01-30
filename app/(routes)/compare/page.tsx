"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GitCompareArrows, X, ShoppingCart, Heart, Expand } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import useCompare from "@/hooks/use-compare"
import useCart from "@/hooks/use-cart"
import { useFavoritesWithAuth } from "@/hooks/use-favorites"
import Container from "@/components/ui/container"
import { Button } from "@/components/ui/Button"
import { getDisplayImageUrl } from "@/lib/image-utils"
import { ImageLightbox } from "@/components/image-lightbox"
import { Crown } from "lucide-react"

const ComparePage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null)
  const router = useRouter()
  const { items, removeItem, clearAll } = useCompare()
  const cart = useCart()
  const favorites = useFavoritesWithAuth()

  const openLightbox = (imageUrl: string, imageAlt: string) => {
    setSelectedImage({ url: imageUrl, alt: imageAlt })
    setLightboxOpen(true)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <GitCompareArrows className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Products to Compare</h2>
          <p className="text-muted-foreground mb-6">Add products to comparison to see them here</p>
          <Button onClick={() => router.push("/")}>Browse Products</Button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <GitCompareArrows className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Compare Products</h1>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>

        {/* Desktop View - Side by Side */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-muted/30 border-b border-border min-w-[180px]">
                  <span className="text-sm font-semibold text-muted-foreground">Feature</span>
                </th>
                {items.map((product) => (
                  <th key={product.id} className="p-4 bg-muted/30 border-b border-l border-border min-w-[250px]">
                    <div className="relative">
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:scale-110 transition-transform z-10"
                        aria-label="Remove from comparison"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="mb-3">
                        <div
                          className="relative h-[600px] w-full rounded-lg overflow-hidden bg-muted group cursor-pointer"
                          onClick={() =>
                            openLightbox(
                              getDisplayImageUrl(product.images?.[0]?.url, Number(product.price) === 0),
                              product.name
                            )
                          }
                        >
                          <Image
                            src={getDisplayImageUrl(product.images?.[0]?.url, Number(product.price) === 0)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                            <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                        <Link href={`/products/${product.id}`} className="block mt-2">
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Product Type (Free/Premium) */}
              <tr>
                <td className="p-4 border-b border-border bg-muted/10 font-medium text-foreground">Type</td>
                {items.map((product) => (
                  <td key={product.id} className="p-4 border-b border-l border-border">
                    {Number(product.price) === 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                        Free
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="p-4 border-b border-border bg-muted/10 font-medium text-foreground">Category</td>
                {items.map((product) => (
                  <td key={product.id} className="p-4 border-b border-l border-border text-muted-foreground">
                    {product.category?.name || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Subcategory */}
              <tr>
                <td className="p-4 border-b border-border bg-muted/10 font-medium text-foreground">Subcategory</td>
                {items.map((product) => (
                  <td key={product.id} className="p-4 border-b border-l border-border text-muted-foreground">
                    {product.subcategory?.name || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className="p-4 border-b border-border bg-muted/10 font-medium text-foreground">Description</td>
                {items.map((product) => (
                  <td key={product.id} className="p-4 border-b border-l border-border text-sm text-muted-foreground">
                    {product.description || "No description"}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 border-b border-border bg-muted/10 font-medium text-foreground">Actions</td>
                {items.map((product) => (
                  <td key={product.id} className="p-4 border-b border-l border-border">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => cart.addItem(product)}
                        className="w-full"
                        disabled={cart.items.some((item) => item.id === product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {cart.items.some((item) => item.id === product.id) ? "In Cart" : "Add to Cart"}
                      </Button>
                      <Button
                        onClick={async () => {
                          const isLiked = favorites.items.some((item) => item.id === product.id)
                          if (isLiked) {
                            await favorites.removeItem(product.id)
                          } else {
                            await favorites.addItem(product)
                          }
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            favorites.items.some((item) => item.id === product.id) ? "fill-current text-red-500" : ""
                          }`}
                        />
                        {favorites.items.some((item) => item.id === product.id) ? "Remove" : "Add to Favorites"}
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-6">
          {items.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-lg p-4 bg-card relative"
            >
              <button
                onClick={() => removeItem(product.id)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:scale-110 transition-transform z-10"
                aria-label="Remove from comparison"
              >
                <X className="h-4 w-4" />
              </button>

              <div
                className="relative h-[500px] w-full mb-4 rounded-lg overflow-hidden bg-muted group cursor-pointer"
                onClick={() =>
                  openLightbox(
                    getDisplayImageUrl(product.images?.[0]?.url, Number(product.price) === 0),
                    product.name
                  )
                }
              >
                <Image
                  src={getDisplayImageUrl(product.images?.[0]?.url, Number(product.price) === 0)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              <Link href={`/products/${product.id}`}>
                <h3 className="font-bold text-lg text-foreground mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type:</span> 
                  {Number(product.price) === 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                      Free
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      <Crown className="h-3 w-3" />
                      Premium
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm text-foreground">{product.category?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subcategory:</span>
                  <span className="text-sm text-foreground">{product.subcategory?.name || "N/A"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => cart.addItem(product)}
                  className="w-full"
                  disabled={cart.items.some((item) => item.id === product.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {cart.items.some((item) => item.id === product.id) ? "In Cart" : "Add to Cart"}
                </Button>
                <Button
                  onClick={async () => {
                    const isLiked = favorites.items.some((item) => item.id === product.id)
                    if (isLiked) {
                      await favorites.removeItem(product.id)
                    } else {
                      await favorites.addItem(product)
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      favorites.items.some((item) => item.id === product.id) ? "fill-current text-red-500" : ""
                    }`}
                  />
                  {favorites.items.some((item) => item.id === product.id) ? "Remove" : "Add to Favorites"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          imageUrl={selectedImage.url}
          imageAlt={selectedImage.alt}
        />
      )}
    </Container>
  )
}

export default ComparePage
