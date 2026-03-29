import { useStories } from '@/hooks/useStories'
import { useSearch } from '@/hooks/useSearch'
import { SearchBar } from '@/components/library/SearchBar'
import { FilterPills } from '@/components/library/FilterPills'
import { StoryCard } from '@/components/library/StoryCard'
import { EmptyState } from '@/components/shared/EmptyState'

export function LibraryPage() {
  const { stories, tags, loading } = useStories()
  const { query, setQuery, activeTag, setActiveTag, filtered } = useSearch(stories)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-primary-teal border-t-transparent animate-spin" />
      </div>
    )
  }

  if (stories.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchBar value={query} onChange={setQuery} />
      <FilterPills tags={tags} activeTag={activeTag} onSelectTag={setActiveTag} />
      <p className="text-caption text-text-muted">
        {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
      </p>
      <div className="flex flex-col gap-3">
        {filtered.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      {filtered.length === 0 && stories.length > 0 && (
        <p className="text-center text-body text-text-muted py-8">
          No stories match your search.
        </p>
      )}
    </div>
  )
}
