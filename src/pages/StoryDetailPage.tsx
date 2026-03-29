import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useStory, useStories } from '@/hooks/useStories'
import { CORE_H_ITEMS } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { getAudioUrl } from '@/lib/storage'
import { HSection } from '@/components/story/HSection'
import { BonusHSection } from '@/components/story/BonusHSection'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { TagPill } from '@/components/shared/TagPill'
import { Modal } from '@/components/shared/Modal'

export function StoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { story, loading } = useStory(id)
  const { removeStory } = useStories()
  const [showDelete, setShowDelete] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    if (story?.audioPath) {
      getAudioUrl(story.audioPath).then(setAudioUrl)
    } else {
      setAudioUrl(null)
    }
  }, [story?.audioPath])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-primary-teal border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="text-center py-16">
        <p className="text-body text-text-muted">Story not found.</p>
        <button onClick={() => navigate('/')} className="text-caption font-semibold text-primary-teal mt-2">
          Back to Library
        </button>
      </div>
    )
  }

  const handleDelete = async () => {
    await removeStory(story.id)
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors self-start"
      >
        <ArrowLeft size={16} /> Library
      </button>

      <div>
        <h2 className="font-display text-h2 font-semibold text-text-heading mb-1">
          {story.title}
        </h2>
        <p className="text-caption text-text-muted">{formatDate(story.date)}</p>
        {story.mood && (
          <span className="inline-block mt-1 text-caption font-semibold text-surface-lavender bg-surface-lavender/30 px-2 py-0.5 rounded-full">
            {story.mood}
          </span>
        )}
      </div>

      {story.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {story.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}

      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}

      {story.shortDescription && (
        <p className="text-body text-text leading-relaxed italic">
          {story.shortDescription}
        </p>
      )}

      {story.fullStoryCopy && (
        <div className="bg-bg-white rounded-lg shadow-card p-5">
          <p className="text-caption text-text-heading leading-relaxed whitespace-pre-wrap">
            {story.fullStoryCopy}
          </p>
        </div>
      )}

      {/* Core 5H sections */}
      <div className="flex flex-col gap-3">
        <h3 className="text-caption font-bold uppercase text-text-muted">The 5H Breakdown</h3>
        {CORE_H_ITEMS.map((item) => (
          <HSection key={item.key} item={item} value={story[item.key]} />
        ))}
      </div>

      {/* Bonus sections */}
      <BonusHSection story={story} />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(`/story/${story.id}/edit`)}
          className="flex items-center gap-2 bg-primary-teal text-text-inverse rounded-full px-5 py-2.5 text-caption font-bold hover:opacity-90 transition-opacity"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-2 text-caption font-semibold text-text-muted hover:text-error transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Story?"
        actions={
          <>
            <button
              onClick={() => setShowDelete(false)}
              className="text-caption font-semibold text-text-muted hover:text-text-heading transition-colors px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-error text-text-inverse rounded-full px-5 py-2 text-caption font-bold hover:opacity-90 transition-opacity"
            >
              Delete
            </button>
          </>
        }
      >
        This will permanently remove "{story.title}" from your story vault. This can't be undone.
      </Modal>
    </div>
  )
}
