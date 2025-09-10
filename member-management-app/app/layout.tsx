import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { CentersProvider } from "@/contexts/centers-context"
import { MembersProvider } from "@/contexts/members-context"
import { PaymentsProvider } from "@/contexts/payments-context"
import { ReportsProvider } from "@/contexts/reports-context"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Gestão de Membros",
  description: "Sistema completo para gestão de membros e centros",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <CentersProvider>
              <MembersProvider>
                <PaymentsProvider>
                  <ReportsProvider>
                    <NotificationsProvider>{children}</NotificationsProvider>
                  </ReportsProvider>
                </PaymentsProvider>
              </MembersProvider>
            </CentersProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
