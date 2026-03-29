import { useNavigate } from 'react-router'
import { Mic } from 'lucide-react'
import type { Story } from '@/lib/types'
import { formatRelativeDate, truncate } from '@/lib/utils'
import { TagPill } from '@/components/shared/TagPill'

interface StoryCardProps {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(`/story/${story.id}`)}
      className="w-full text-left bg-bg-white rounded-lg shadow-card p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-body font-bold text-text-heading leading-snug">
          {story.title || 'Untitled Story'}
        </h3>
        {story.audioPath && (
          <Mic size={14} className="text-primary-teal shrink-0 mt-1" />
        )}
      </div>
      <p className="text-caption text-text-muted mb-2">
        {formatRelativeDate(story.date)}
      </p>
      {story.shortDescription && (
        <p className="text-caption text-text leading-relaxed mb-3">
          {truncate(story.shortDescription, 120)}
        </p>
      )}
      {story.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {story.tags.slice(0, 4).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {story.tags.length > 4 && (
            <span className="text-caption text-text-muted">+{story.tags.length - 4}</span>
          )}
        </div>
      )}
    </button>
  )
}
