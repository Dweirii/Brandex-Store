"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayoutShell({ children, className }: DashboardLayoutShellProps) {
  return (
    <div className="bg-muted min-h-[calc(100vh-4rem)]">
      <div className="max-w-[1320px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex">
          <DashboardSidebar />
          <main className={cn("flex-1 min-w-0 pl-8 py-8", className)}>
            <div className="bg-background rounded-3xl p-8 min-h-[calc(100vh-8rem)] shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
