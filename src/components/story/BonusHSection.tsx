import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Story } from '@/lib/types'
import { BONUS_H_ITEMS } from '@/lib/constants'
import { HSection } from './HSection'

interface BonusHSectionProps {
  story: Story
}

export function BonusHSection({ story }: BonusHSectionProps) {
  const [expanded, setExpanded] = useState(false)

  const filledBonusItems = BONUS_H_ITEMS.filter(
    (item) => story[item.key] && (story[item.key] as string).trim()
  )

  if (filledBonusItems.length === 0) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors mb-3"
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Bonus H's ({filledBonusItems.length})
      </button>
      {expanded && (
        <div className="flex flex-col gap-3">
          {filledBonusItems.map((item) => (
            <HSection key={item.key} item={item} value={story[item.key] as string} />
          ))}
        </div>
      )}
    </div>
  )
}
