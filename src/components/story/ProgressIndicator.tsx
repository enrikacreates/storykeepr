interface ProgressIndicatorProps {
  total: number
  current: number
}

export function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full flex-1 transition-colors ${
            i <= current ? 'bg-primary-teal' : 'bg-surface-gray'
          }`}
        />
      ))}
    </div>
  )
}
