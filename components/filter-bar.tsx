"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { FILE_TYPE_CHIPS, SIZE_CHIPS } from "@/lib/file-type"

interface FilterBarProps {
  className?: string
}

/**
 * Discovery filters (file type + size) as horizontally-scrollable, multi-select
 * chip rows. URL-param driven so it composes with price/sort/category filters and
 * survives navigation. Mobile-first: rows scroll horizontally; chips are 32px tall.
 */
export function FilterBar({ className }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const fileTypes = searchParams.get("fileType")?.split(",").filter(Boolean) ?? []
  const sizes = searchParams.get("size")?.split(",").filter(Boolean) ?? []
  const activeCount = fileTypes.length + sizes.length

  const setParam = (key: string, values: string[]) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (values.length) params.set(key, values.join(","))
      else params.delete(key)
      params.delete("page")
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  const toggle = (key: string, current: string[], value: string) =>
    setParam(key, current.includes(value) ? current.filter((v) => v !== value) : [...current, value])

  const clearAll = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("fileType")
      params.delete("size")
      params.delete("page")
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  return (
    <div className={cn("space-y-2.5", isPending && "opacity-60", className)}>
      <ChipRow label="Type">
        {FILE_TYPE_CHIPS.map((c) => (
          <Chip key={c.value} active={fileTypes.includes(c.value)} onClick={() => toggle("fileType", fileTypes, c.value)}>
            {c.label}
          </Chip>
        ))}
      </ChipRow>

      <ChipRow
        label="Size"
        trailing={
          activeCount > 0 ? (
            <button
              onClick={clearAll}
              className="shrink-0 text-xs font-semibold text-primary hover:underline px-1"
            >
              Clear ({activeCount})
            </button>
          ) : null
        }
      >
        {SIZE_CHIPS.map((c) => (
          <Chip key={c.value} active={sizes.includes(c.value)} onClick={() => toggle("size", sizes, c.value)}>
            {c.label}
          </Chip>
        ))}
      </ChipRow>
    </div>
  )
}

function ChipRow({
  label,
  children,
  trailing,
}: {
  label: string
  children: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 w-10 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
        {children}
      </div>
      {trailing}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 h-8 px-3.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:border-primary/50"
      )}
    >
      {children}
    </button>
  )
}
