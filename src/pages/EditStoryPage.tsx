import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useStory, useStories } from '@/hooks/useStories'
import { getAudioUrl } from '@/lib/storage'
import { CORE_H_ITEMS, BONUS_H_ITEMS } from '@/lib/constants'
import { StepCard } from '@/components/story/StepCard'
import { RecordButton } from '@/components/audio/RecordButton'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'

export function EditStoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { story, loading } = useStory(id)
  const { updateStory } = useStories()

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullStoryCopy, setFullStoryCopy] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState('')
  const [showBonus, setShowBonus] = useState(false)
  const [existingAudioUrl, setExistingAudioUrl] = useState<string | null>(null)
  const [keepExistingAudio, setKeepExistingAudio] = useState(true)

  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, clearRecording } = useAudioRecorder()

  useEffect(() => {
    if (!story) return
    setTitle(story.title)
    setDate(story.date)
    setShortDescription(story.shortDescription)
    setFullStoryCopy(story.fullStoryCopy)
    setTags(story.tags)
    setMood(story.mood || '')
    setValues({
      hope: story.hope, hangup: story.hangup, handle: story.handle,
      heart: story.heart, hindsight: story.hindsight,
      hook: story.hook || '', humor: story.humor || '',
      humility: story.humility || '', hiddenHeroes: story.hiddenHeroes || '',
      humdrum: story.humdrum || '', headspace: story.headspace || '',
    })
    if (story.audioPath) {
      getAudioUrl(story.audioPath).then(setExistingAudioUrl)
      setKeepExistingAudio(true)
    }
  }, [story])

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
      </div>
    )
  }

  const updateValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const handleRemoveExistingAudio = () => {
    setKeepExistingAudio(false)
    setExistingAudioUrl(null)
  }

  const handleSave = async () => {
    await updateStory(story.id, {
      title: title || 'Untitled Story',
      date,
      shortDescription,
      fullStoryCopy,
      hope: values.hope,
      hangup: values.hangup,
      handle: values.handle,
      heart: values.heart,
      hindsight: values.hindsight,
      hook: values.hook || undefined,
      humor: values.humor || undefined,
      humility: values.humility || undefined,
      hiddenHeroes: values.hiddenHeroes || undefined,
      humdrum: values.humdrum || undefined,
      headspace: values.headspace || undefined,
      audioPath: keepExistingAudio ? story.audioPath : undefined,
      audioBlob: audioBlob ?? undefined,
      tags,
      mood: mood || undefined,
    })
    navigate(`/story/${story.id}`)
  }

  // Show new recording if exists, otherwise show existing
  const displayAudioUrl = audioUrl || (keepExistingAudio ? existingAudioUrl : null)

  return (
    <div className="flex flex-col gap-4 pb-4">
      <button
        type="button"
        onClick={() => navigate(`/story/${story.id}`)}
        className="flex items-center gap-1 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors self-start"
      >
        <ArrowLeft size={16} /> Cancel
      </button>

      <h2 className="text-h3 font-bold text-text-heading">Edit Story</h2>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-bg-white rounded-sm px-4 py-2.5 text-caption shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-bg-white rounded-sm px-4 py-2.5 text-caption shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Short Description</label>
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          rows={2}
          className="w-full bg-bg-white rounded-sm px-4 py-3 text-caption leading-relaxed resize-none shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Full Story</label>
        <textarea
          value={fullStoryCopy}
          onChange={(e) => setFullStoryCopy(e.target.value)}
          rows={6}
          className="w-full bg-bg-white rounded-sm px-4 py-3 text-caption leading-relaxed resize-none shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      {/* Audio */}
      <div className="flex items-center gap-3">
        <RecordButton isRecording={isRecording} onStart={startRecording} onStop={stopRecording} />
      </div>
      {displayAudioUrl && (
        <AudioPlayer
          audioUrl={displayAudioUrl}
          onRemove={() => {
            if (audioUrl) {
              clearRecording()
            } else {
              handleRemoveExistingAudio()
            }
          }}
        />
      )}

      {/* Core H sections */}
      <h3 className="text-caption font-bold uppercase text-text-muted mt-2">5H Sections</h3>
      <div className="flex flex-col gap-3">
        {CORE_H_ITEMS.map((item) => (
          <StepCard
            key={item.key}
            item={item}
            value={values[item.key] || ''}
            onChange={(val) => updateValue(item.key, val)}
          />
        ))}
      </div>

      {/* Bonus H sections */}
      <button
        type="button"
        onClick={() => setShowBonus(!showBonus)}
        className="text-caption font-semibold text-primary-teal hover:opacity-80 transition-opacity self-start"
      >
        {showBonus ? 'Hide' : 'Show'} Bonus H's
      </button>
      {showBonus && (
        <div className="flex flex-col gap-3">
          {BONUS_H_ITEMS.map((item) => (
            <StepCard
              key={item.key}
              item={item}
              value={values[item.key] || ''}
              onChange={(val) => updateValue(item.key, val)}
            />
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="Add a tag..."
            className="flex-1 bg-bg-white rounded-sm px-4 py-2.5 text-caption shadow-card focus:outline-none focus:shadow-md transition-shadow"
          />
          <button type="button" onClick={addTag} className="bg-primary-teal/10 text-primary-teal rounded-full px-3 py-2 text-caption font-bold">
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="text-caption font-semibold px-3 py-1 rounded-full bg-primary-teal/10 text-primary-teal hover:bg-error/10 hover:text-error transition-colors"
              >
                {tag} &times;
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Mood (optional)</label>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full bg-bg-white rounded-sm px-4 py-2.5 text-caption shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="bg-primary-teal text-text-inverse rounded-full px-6 py-2.5 text-label font-bold hover:opacity-90 transition-opacity self-end"
      >
        Save Changes
      </button>
    </div>
  )
}
