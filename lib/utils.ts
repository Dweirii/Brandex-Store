import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Round-robin interleaves items grouped by their creation day so that
 * same-day items never appear back-to-back while we still have items
 * from other days to emit.
 */
export function interleaveByDay<T>(items: T[]): T[] {
  if (items.length <= 1) return [...items]

  const groups = new Map<string, T[]>()
  for (const item of items) {
    const raw = (item as { createdAt?: string | Date | null } | null)?.createdAt
    const d = raw ? new Date(raw) : null
    const key = d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "__no-date__"
    const bucket = groups.get(key)
    if (bucket) bucket.push(item)
    else groups.set(key, [item])
  }

  // Shuffle within each day and the order of days so the mix feels fresh each visit
  const queues = shuffle(Array.from(groups.values()).map((b) => shuffle(b)))

  const result: T[] = []
  while (queues.some((q) => q.length > 0)) {
    for (const q of queues) {
      const next = q.shift()
      if (next) result.push(next)
    }
  }
  return result
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || Number.isNaN(bytes) || bytes < 0) return ""
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, i)
  const formatted = value >= 100 || i === 0 ? value.toFixed(0) : value.toFixed(1)
  return `${formatted} ${units[i]}`
}