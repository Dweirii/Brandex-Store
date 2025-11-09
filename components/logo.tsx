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
          className="bg-muted/20 animate-pulse transition-all duration-300 rounded-sm"
          style={{ width: 240, height: 120 }}
          aria-label="Loading logo"
        />
      </Link>
    )
  }

  return (
    <Link href="/" className="flex items-center gap-x-2 relative z-20 pointer-events-auto">
      <Image
        src={logoSrc}
        width={240}
        height={120}
        alt="Brandex Logo"
        priority
        className="transition-all duration-300 hover:scale-105 gpu-accelerated smooth-transform max-h-40 w-auto"
        style={{ width: "auto", height: "auto" }}
        sizes="(max-width: 768px) 200px, 240px"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </Link>
  )
}

export default Logo
