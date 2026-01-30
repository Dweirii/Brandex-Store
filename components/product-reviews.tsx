"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, CheckCircle, MessageSquare, Trash2 } from "lucide-react"
import { useUser, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ProductRating } from "@/components/product-rating"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { 
  getProductReviews, 
  getProductReviewStats, 
  createReview, 
  voteReviewHelpful,
  deleteReview 
} from "@/lib/reviews-api"
import type { Review, ReviewStats } from "@/types/review"

interface ProductReviewsProps {
  productId: string
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Fetch reviews and stats
  useEffect(() => {
    setIsMounted(true)
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const [reviewsData, statsData] = await Promise.all([
        getProductReviews(productId),
        getProductReviewStats(productId)
      ])
      setReviews(reviewsData)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading reviews:", error)
      // Don't show error toast - reviews system might not be set up yet
      // Just show empty state
      setReviews([])
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  const handleSubmitReview = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to leave a review")
      return
    }

    if (newRating === 0) {
      toast.error("Please select a rating")
      return
    }
    
    if (newComment.trim().length < 10) {
      toast.error("Review must be at least 10 characters")
      return
    }

    setIsSubmitting(true)
    
    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      
      if (!token) {
        toast.error("Authentication failed. Please sign in again.")
        setIsSubmitting(false)
        return
      }

      await createReview(
        {
          productId,
          rating: newRating,
          comment: newComment.trim(),
        },
        token
      )
      
      // Reload reviews after successful submission
      await loadReviews()
      
      setNewRating(0)
      setNewComment("")
      toast.success("Review submitted successfully!")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error((error as Error).message || "Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoteHelpful = async (reviewId: string) => {
    if (!isSignedIn) {
      toast.error("Please sign in to vote")
      return
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed")
        return
      }

      const success = await voteReviewHelpful(reviewId, token)
      if (success) {
        // Reload reviews to get updated vote counts
        await loadReviews()
        toast.success("Thank you for your feedback!")
      }
    } catch (error) {
      console.error("Error voting:", error)
      toast.error("Failed to vote")
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!isSignedIn) return

    if (!confirm("Are you sure you want to delete this review?")) {
      return
    }

    try {
      const token = await getToken({ template: "CustomerJWTBrandex" })
      if (!token) {
        toast.error("Authentication failed")
        return
      }

      const success = await deleteReview(reviewId, token)
      if (success) {
        await loadReviews()
        toast.success("Review deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Failed to delete review")
    }
  }

  if (!isMounted) {
    return null
  }

  const hasUserReviewed = reviews.some(review => review.userId === user?.id)

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="border-b border-border pb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Customer Reviews</h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
        ) : stats.totalReviews > 0 ? (
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-foreground mb-2">{stats.averageRating.toFixed(1)}</div>
              <ProductRating rating={stats.averageRating} totalReviews={stats.totalReviews} size="lg" />
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.ratingDistribution[stars as keyof typeof stats.ratingDistribution]
                const percentage = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">{stars}★</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">{count} ({percentage}%)</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>

      {/* Write a Review */}
      {isSignedIn && !hasUserReviewed && (
        <div className="border border-border rounded-lg p-6 bg-muted/20">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Write a Review
          </h3>
        
        {/* Star Rating Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setNewRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star 
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hoveredStar >= star || newRating >= star)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">Your Review</label>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum 10 characters ({newComment.length}/10)
          </p>
        </div>

          <Button 
            onClick={handleSubmitReview}
            disabled={isSubmitting || newRating === 0 || newComment.trim().length < 10}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      )}

      {!isSignedIn && (
        <div className="border border-border rounded-lg p-6 bg-muted/20 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to leave a review</p>
          <Button onClick={() => window.location.href = '/sign-in'}>
            Sign In
          </Button>
        </div>
      )}

      {hasUserReviewed && (
        <div className="border border-border rounded-lg p-6 bg-muted/20 text-center">
          <p className="text-muted-foreground">You have already reviewed this product</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Reviews ({reviews.length})</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={review.userImageUrl || undefined} 
                      alt={review.userName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {review.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{review.userName}</h4>
                        {review.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {user?.id === review.userId && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          aria-label="Delete review"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <ProductRating 
                        rating={review.rating} 
                        size="sm" 
                        showCount={false}
                      />
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{review.comment}</p>
                    
                    <button
                      onClick={() => handleVoteHelpful(review.id)}
                      disabled={!isSignedIn}
                      className={cn(
                        "inline-flex items-center gap-2 text-sm transition-colors",
                        review.helpfulVotes?.includes(user?.id || "")
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground",
                        !isSignedIn && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <ThumbsUp className={cn(
                        "h-4 w-4",
                        review.helpfulVotes?.includes(user?.id || "") && "fill-current"
                      )} />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { ProductReviews }
