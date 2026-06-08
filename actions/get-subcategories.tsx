const URL = `${process.env.NEXT_PUBLIC_API_URL}/subcategories/approved`

export interface ApprovedSubcategory {
  id: string
  name: string
  description?: string
  productCount?: number
}

/**
 * Fetch APPROVED subcategories for a category (used for the storefront pills).
 * Returns [] on any failure so the UI degrades gracefully.
 */
const getSubcategories = async (categoryId: string): Promise<ApprovedSubcategory[]> => {
  if (!categoryId) return []
  try {
    const res = await fetch(`${URL}?categoryId=${categoryId}`, {
      next: { revalidate: 300, tags: ["subcategories", `subcategories-${categoryId}`] },
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.subcategories) ? data.subcategories : []
  } catch {
    return []
  }
}

export default getSubcategories
