import { Outlet } from 'react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { BottomNav } from './BottomNav'

export function AppShell() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-bg-cream pb-24">
      <header className="sticky top-0 z-10 bg-bg-cream/90 backdrop-blur-sm px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-display text-h2 font-semibold text-text-heading">
            StoryKeepr
          </h1>
          <button
            type="button"
            onClick={signOut}
            className="text-text-muted hover:text-text-heading transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
