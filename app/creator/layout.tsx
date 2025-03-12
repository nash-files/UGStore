import { ReactNode } from 'react'
import ProtectedRoute from '@/components/protected-route'
import CreatorSidebar from '@/components/creator-sidebar'

export default function CreatorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}

