import { useState } from 'react'
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import { CORE_H_ITEMS, BONUS_H_ITEMS } from '@/lib/constants'
import { StepCard } from './StepCard'
import { RecordButton } from '@/components/audio/RecordButton'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { todayISO } from '@/lib/utils'

interface FreeformEditorProps {
  onSave: (data: {
    title: string
    date: string
    shortDescription: string
    fullStoryCopy: string
    hope: string
    hangup: string
    handle: string
    heart: string
    hindsight: string
    hook?: string
    humor?: string
    humility?: string
    hiddenHeroes?: string
    humdrum?: string
    headspace?: string
    audioBlob?: Blob
    tags: string[]
    mood?: string
  }) => void
  onBack: () => void
}

export function FreeformEditor({ onSave, onBack }: FreeformEditorProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayISO())
  const [shortDescription, setShortDescription] = useState('')
  const [fullStoryCopy, setFullStoryCopy] = useState('')
  const [showH, setShowH] = useState(false)
  const [showBonus, setShowBonus] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({
    hope: '', hangup: '', handle: '', heart: '', hindsight: '',
    hook: '', humor: '', humility: '', hiddenHeroes: '', humdrum: '', headspace: '',
  })
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState('')

  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, clearRecording } = useAudioRecorder()

  const updateValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const handleSave = () => {
    onSave({
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
      audioBlob: audioBlob ?? undefined,
      tags,
      mood: mood || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors self-start"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your story a name..."
          autoFocus
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
          placeholder="A 1-2 sentence summary..."
          rows={2}
          className="w-full bg-bg-white rounded-sm px-4 py-3 text-caption leading-relaxed resize-none shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Your Story</label>
        <textarea
          value={fullStoryCopy}
          onChange={(e) => setFullStoryCopy(e.target.value)}
          placeholder="Just write. Tell the story however it comes out..."
          rows={8}
          className="w-full bg-bg-white rounded-sm px-4 py-3 text-caption leading-relaxed resize-none shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <div className="flex items-center gap-3">
        <RecordButton isRecording={isRecording} onStart={startRecording} onStop={stopRecording} />
      </div>
      {audioUrl && <AudioPlayer audioUrl={audioUrl} onRemove={clearRecording} />}

      {/* Optional 5H sections */}
      <button
        type="button"
        onClick={() => setShowH(!showH)}
        className="flex items-center gap-2 text-caption font-semibold text-primary-teal hover:opacity-80 transition-opacity"
      >
        {showH ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showH ? 'Hide' : 'Add'} 5H Framework Sections
      </button>
      {showH && (
        <div className="flex flex-col gap-3">
          {CORE_H_ITEMS.map((item) => (
            <StepCard
              key={item.key}
              item={item}
              value={values[item.key]}
              onChange={(val) => updateValue(item.key, val)}
            />
          ))}
          <button
            type="button"
            onClick={() => setShowBonus(!showBonus)}
            className="flex items-center gap-2 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors"
          >
            {showBonus ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Bonus H's
          </button>
          {showBonus && BONUS_H_ITEMS.map((item) => (
            <StepCard
              key={item.key}
              item={item}
              value={values[item.key]}
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
          placeholder="e.g. grateful, anxious, hopeful..."
          className="w-full bg-bg-white rounded-sm px-4 py-2.5 text-caption shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="bg-primary-teal text-text-inverse rounded-full px-6 py-2.5 text-label font-bold hover:opacity-90 transition-opacity self-end"
      >
        Save Story
      </button>
    </div>
  )
}
