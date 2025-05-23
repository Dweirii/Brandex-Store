"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"

interface MainNavProps {
  data: Category[]
}

const MainNav = ({ data }: MainNavProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }))

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
        {routes.map((route, index) => (
          <motion.div
            key={route.href}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative"
          >
            <Link
              href={route.href}
              className={cn(
                "relative block px-3 py-2 text-sm font-medium transition-colors duration-200",
                route.active ? "text-white" : "text-black hover:text-white",
              )}
            >
              {route.label}

              {/* Hover background with improved animation */}
              {hoveredIndex === index && !route.active && (
                <motion.span
                  className="absolute inset-0 -z-10 h-9 rounded-md bg-black"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.0)",
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                />
              )}

              {/* Active indicator with improved styling */}
              {route.active && (
                <motion.div
                  className="absolute inset-0 -z-10 rounded-md bg-white"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    boxShadow: "0 0 15px rgba(0, 0, 0, 0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Underline effect with improved animation */}
              {route.active ? (
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                />
              ) : (
                hoveredIndex === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-white/70"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0, originX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Mobile Menu Button (Top Right) */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="flex items-center justify-center p-2 rounded-md text-black hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Open menu"
            >
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <Menu className="h-5 w-5" />
              </motion.div>
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[80%] sm:w-[350px] bg-white text-black border-r-0 p-0">
            <div className="flex flex-col space-y-1 py-4">
              <motion.h2
                className="mb-4 px-4 text-lg font-semibold text-black"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                Categories
              </motion.h2>

              {routes.map((route, index) => (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 text-sm font-medium transition-all",
                      route.active ? "bg-[#4e4e4e1c] text-black" : "text-black hover:bg-gray-50",
                    )}
                  >
                    <span>{route.label}</span>

                    <motion.div
                      animate={{
                        x: route.active ? 0 : -5,
                        opacity: route.active ? 1 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-black"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default MainNav
