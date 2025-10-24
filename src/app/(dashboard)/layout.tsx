import { DashboardHeader } from "@/components/features/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/features/dashboard/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader />
        {/* O 'p-8' do V0 será aplicado pelo componente de conteúdo */}
        {children}
      </main>
    </div>
  )
}