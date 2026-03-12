import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1320px] mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <DashboardSidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden pl-6">
          {children}
        </main>
      </div>
    </div>
  )
}
