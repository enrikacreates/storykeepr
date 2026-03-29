import type { HFrameworkItem } from '@/lib/types'

interface StepCardProps {
  item: HFrameworkItem
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}

export function StepCard({ item, value, onChange, autoFocus }: StepCardProps) {
  return (
    <div className={`${item.surface} rounded-lg p-5`}>
      <h3 className="font-display text-h3 font-semibold text-text-heading mb-1">
        {item.label}
      </h3>
      <p className="text-caption text-text-muted mb-3">{item.prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing..."
        autoFocus={autoFocus}
        rows={4}
        className="w-full bg-bg-white/60 rounded-sm px-4 py-3 text-caption text-text-heading leading-relaxed resize-none focus:outline-none focus:bg-bg-white transition-colors"
      />
    </div>
  )
}
