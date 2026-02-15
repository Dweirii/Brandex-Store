"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Logo = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const getLogoSrc = () => {
    if (!mounted) {
      if (typeof window !== "undefined") {
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        return systemPreference ? "/Logo-white.png" : "/Logo.png"
      }
      return "/Logo.png"
    }

    const currentTheme = theme === "system" ? systemTheme : theme
    return currentTheme === "dark" ? "/Logo-white.png" : "/Logo.png"
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
        width={50}
        height={20}
        alt="Brandex Logo"
        priority
        className="transition-all duration-200 group-hover:opacity-80 h-5 w-auto md:h-6"
        style={{ width: "auto", height: "auto" }}
        sizes="(max-width: 640px) 80px, (max-width: 768px) 150px, 200px"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </Link>
  )
}

export default Logo
