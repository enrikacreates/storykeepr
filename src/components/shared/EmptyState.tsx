import { BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router'

export function EmptyState() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-mint flex items-center justify-center mb-4">
        <BookOpen size={28} className="text-primary-teal" />
      </div>
      <h2 className="text-h3 font-bold text-text-heading mb-2">No stories yet</h2>
      <p className="text-body text-text-muted mb-6 max-w-xs">
        Your story vault is empty. Start capturing the stories of your days.
      </p>
      <button
        onClick={() => navigate('/new')}
        className="bg-primary-teal text-text-inverse rounded-full px-6 py-2.5 text-label font-bold hover:opacity-90 transition-opacity"
      >
        + Tell Your First Story
      </button>
    </div>
  )
}
