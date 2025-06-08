"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronRight } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"

interface MainNavProps {
  data: Category[]
}

const MainNav = ({ data }: MainNavProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }))

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "bg-card/90 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-1 lg:space-x-4">
          {routes.map((route, index) => (
            <div
              key={route.href}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={route.href}
                  className={cn(
                    "relative block px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full", // Changed px-3 py-2 to px-4 py-2, rounded-md to rounded-full
                    route.active ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary",
                  )}
                  aria-current={route.active ? "page" : undefined}
                >
                  <span className="relative z-10">{route.label}</span>

                  <AnimatePresence>
                    {(route.active || hoveredIndex === index) && (
                      <motion.span
                        className={cn(
                          "absolute inset-0 rounded-full -z-0",
                          route.active ? "bg-primary/10" : "bg-muted/50",
                        )}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        layoutId="navBackground"
                      />
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(route.active || hoveredIndex === index) && (
                      <motion.span
                        className={cn(
                          "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 rounded-full",
                          route.active ? "bg-primary" : "bg-border",
                        )}
                        initial={{ scaleX: 0, originX: 0.5 }} 
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0, originX: 0.5 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            </div>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full text-foreground"
                aria-label="Open menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isOpen ? "open" : "closed"}
                    initial={{ opacity: 0, rotate: isOpen ? -90 : 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: isOpen ? 90 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[80%] sm:w-[350px] bg-card border-r-0 p-0 flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <motion.h2
                  className="text-lg font-semibold text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Categories
                </motion.h2>
              </div>

              <div className="flex-1 overflow-auto py-2">
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
                        "group flex items-center justify-between px-6 py-4 text-base font-medium transition-all",
                        route.active
                          ? "bg-primary/10 text-primary border-l-4 border-primary" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                      aria-current={route.active ? "page" : undefined}
                    >
                      <span>{route.label}</span>

                      <motion.div
                        animate={{ x: route.active ? 0 : -5, opacity: route.active ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-primary"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export default MainNav
