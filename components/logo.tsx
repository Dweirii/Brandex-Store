"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Logo = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const logoSrc = theme === "dark" ? "/Logo-white.png" : "/Logo.png"

  return (
    <Link href="/" className="flex items-center gap-x-2">
      <Image
        src={logoSrc}
        width={240}
        height={120}
        alt="Brandex Logo"
        priority
        className="transition-all duration-300"
      />
    </Link>
  )
}

export default Logo
