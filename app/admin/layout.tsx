import { ReactNode } from 'react'
import ProtectedRoute from '@/components/protected-route'
import AdminSidebar from '@/components/admin-sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}

