import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/lib/auth'

export function AuthGuard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-teal border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
