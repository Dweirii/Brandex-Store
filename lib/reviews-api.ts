import type { Review, ReviewStats, CreateReviewInput } from "@/types/review"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_URL}/reviews/product/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch reviews")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

export async function getProductReviewStats(productId: string): Promise<ReviewStats> {
  try {
    const response = await fetch(`${API_URL}/reviews/product/${productId}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch review stats")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching review stats:", error)
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }
}

export async function createReview(
  input: CreateReviewInput,
  token: string
): Promise<Review | null> {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create review")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating review:", error)
    throw error
  }
}

export async function voteReviewHelpful(
  reviewId: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to vote")
    }

    return true
  } catch (error) {
    console.error("Error voting helpful:", error)
    return false
  }
}

export async function deleteReview(
  reviewId: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete review")
    }

    return true
  } catch (error) {
    console.error("Error deleting review:", error)
    return false
  }
}
