interface TagPillProps {
  tag: string
  active?: boolean
  onClick?: () => void
}

export function TagPill({ tag, active, onClick }: TagPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-caption font-semibold px-3 py-1 rounded-full transition-colors ${
        active
          ? 'bg-primary-teal text-text-inverse'
          : 'bg-primary-teal/10 text-primary-teal'
      }`}
    >
      {tag}
    </button>
  )
}
