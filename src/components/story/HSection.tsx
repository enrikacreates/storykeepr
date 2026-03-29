import type { HFrameworkItem } from '@/lib/types'

interface HSectionProps {
  item: HFrameworkItem
  value: string | undefined
}

export function HSection({ item, value }: HSectionProps) {
  if (!value) return null

  return (
    <div className={`${item.surface} rounded-lg p-4`}>
      <h4 className="text-caption font-bold uppercase text-text-muted mb-1">
        {item.label}
      </h4>
      <p className="text-caption text-text-heading leading-relaxed whitespace-pre-wrap">
        {value}
      </p>
    </div>
  )
}
