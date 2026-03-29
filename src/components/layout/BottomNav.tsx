import { useLocation, useNavigate } from 'react-router'
import { BookOpen, Plus } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Library', icon: BookOpen },
  { path: '/new', label: 'New Story', icon: Plus },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-white shadow-card z-20">
      <div className="max-w-lg mx-auto flex">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? 'text-primary-teal' : 'text-text-muted'
              }`}
            >
              <item.icon size={22} />
              <span className="text-caption font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
