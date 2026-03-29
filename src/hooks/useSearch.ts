import { useMemo, useState } from 'react'
import type { Story } from '@/lib/types'

export function useSearch(stories: Story[]) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = stories

    if (activeTag) {
      result = result.filter((s) => s.tags.includes(activeTag))
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.fullStoryCopy.toLowerCase().includes(q)
      )
    }

    return result
  }, [stories, query, activeTag])

  return { query, setQuery, activeTag, setActiveTag, filtered }
}
