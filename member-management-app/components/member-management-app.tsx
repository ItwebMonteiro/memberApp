"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { MembersPage } from "@/components/members-page"
import { CentersPage } from "@/components/centers-page"
import { PaymentsPage } from "@/components/payments-page"
import { ReportsPage } from "@/components/reports-page"
import { NotificationsPage } from "@/components/notifications-page"

export type ActivePage = "dashboard" | "members" | "centers" | "payments" | "reports" | "notifications"

export function MemberManagementApp() {
  const [activePage, setActivePage] = useState<ActivePage>("dashboard")

  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />
      case "members":
        return <MembersPage />
      case "centers":
        return <CentersPage />
      case "payments":
        return <PaymentsPage />
      case "reports":
        return <ReportsPage />
      case "notifications":
        return <NotificationsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-auto">{renderActivePage()}</main>
    </div>
  )
}
