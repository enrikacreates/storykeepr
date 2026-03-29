import { TagPill } from '@/components/shared/TagPill'

interface FilterPillsProps {
  tags: string[]
  activeTag: string | null
  onSelectTag: (tag: string | null) => void
}

export function FilterPills({ tags, activeTag, onSelectTag }: FilterPillsProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectTag(null)}
        className={`text-caption font-semibold px-3 py-1 rounded-full transition-colors ${
          activeTag === null
            ? 'bg-primary-teal text-text-inverse'
            : 'bg-surface-gray text-text-muted'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <TagPill
          key={tag}
          tag={tag}
          active={activeTag === tag}
          onClick={() => onSelectTag(activeTag === tag ? null : tag)}
        />
      ))}
    </div>
  )
}
