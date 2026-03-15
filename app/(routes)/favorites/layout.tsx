import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1320px] mx-auto w-full pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden pl-6">
          {children}
        </main>
      </div>
    </div>
  )
}
