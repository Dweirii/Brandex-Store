"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  /** Use the tagline-free "mark" version (cleaner on mobile). */
  compact?: boolean
}

const Logo = ({ compact = false }: LogoProps) => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Pick the right pair (full wordmark+tagline, or compact mark) per theme.
  const light = compact ? "/Brandex-mark.svg" : "/Brandex.svg"
  const dark = compact ? "/Brandex-mark-dark.svg" : "/Brandex-dark.svg"

  const getLogoSrc = () => {
    if (!mounted) {
      if (typeof window !== "undefined") {
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        return systemPreference ? dark : light
      }
      return light
    }

    const currentTheme = theme === "system" ? systemTheme : theme
    return currentTheme === "dark" ? dark : light
  }

  const logoSrc = getLogoSrc()

  if (!mounted) {
    return (
      <Link href="/" className="flex items-center gap-x-2">
        <div
          className="bg-muted/20 animate-pulse transition-all duration-300 rounded-sm w-20 md:w-24 h-5 md:h-6"
          aria-label="Loading logo"
        />
      </Link>
    )
  }

  return (
    <Link href="/" className="flex items-center gap-x-2 relative pointer-events-auto group">
      <Image
        src={logoSrc}
        width={218}
        height={48}
        alt="Brandex Logo"
        priority
        className="transition-all duration-200 group-hover:opacity-80 h-9 w-auto md:h-10"
        sizes="(max-width: 640px) 100px, 200px"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </Link>
  )
}

export default Logo
