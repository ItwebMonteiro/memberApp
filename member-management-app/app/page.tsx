import { ProtectedRoute } from "@/components/protected-route"
import { MemberManagementApp } from "@/components/member-management-app"

export default function Home() {
  return (
    <ProtectedRoute>
      <MemberManagementApp />
    </ProtectedRoute>
  )
}
