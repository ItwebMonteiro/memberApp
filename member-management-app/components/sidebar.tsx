"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Building2, CreditCard, FileText, Bell, Menu, X } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import type { ActivePage } from "@/components/member-management-app"
import { useState } from "react"

interface SidebarProps {
  activePage: ActivePage
  onPageChange: (page: ActivePage) => void
}

const menuItems = [
  { id: "dashboard" as ActivePage, label: "Painel de Controlo", icon: LayoutDashboard }, // Dashboard → Painel de Controlo
  { id: "members" as ActivePage, label: "Membros", icon: Users },
  { id: "centers" as ActivePage, label: "Centros", icon: Building2 },
  { id: "payments" as ActivePage, label: "Pagamentos", icon: CreditCard },
  { id: "reports" as ActivePage, label: "Relatórios", icon: FileText },
  { id: "notifications" as ActivePage, label: "Notificações", icon: Bell },
]

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Gestão de Membros</h1>
                <p className="text-sm text-muted-foreground mt-1">Sistema de Administração</p>
              </div>
              <UserMenu />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 text-left",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => {
                    onPageChange(item.id)
                    setIsCollapsed(true) // Close mobile menu after selection
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center">© 2024 Sistema de Gestão</div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsCollapsed(true)} />
      )}
    </>
  )
}
