export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userImageUrl?: string
  rating: number
  comment: string
  isVerifiedPurchase: boolean
  helpful: number
  helpfulVotes: string[] // Array of user IDs who voted helpful
  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface CreateReviewInput {
  productId: string
  rating: number
  comment: string
}
