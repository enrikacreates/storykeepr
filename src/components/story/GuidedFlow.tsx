import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { CoreH } from '@/lib/types'
import { CORE_H_ITEMS, BONUS_H_ITEMS } from '@/lib/constants'
import { StepCard } from './StepCard'
import { ProgressIndicator } from './ProgressIndicator'
import { RecordButton } from '@/components/audio/RecordButton'
import { AudioPlayer } from '@/components/audio/AudioPlayer'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { todayISO } from '@/lib/utils'

interface GuidedFlowProps {
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
}

type Step = 'h-steps' | 'bonus' | 'details'

export function GuidedFlow({ onSave }: GuidedFlowProps) {
  const [currentH, setCurrentH] = useState(0)
  const [step, setStep] = useState<Step>('h-steps')
  const [values, setValues] = useState<Record<string, string>>({
    hope: '', hangup: '', handle: '', heart: '', hindsight: '',
    hook: '', humor: '', humility: '', hiddenHeroes: '', humdrum: '', headspace: '',
  })
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayISO())
  const [shortDescription, setShortDescription] = useState('')
  const [fullStoryCopy, setFullStoryCopy] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [mood, setMood] = useState('')
  const [showBonus, setShowBonus] = useState(false)

  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, clearRecording } = useAudioRecorder()

  const updateValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const generateDraft = () => {
    const sections = CORE_H_ITEMS
      .filter((item) => values[item.key]?.trim())
      .map((item) => `${item.label}: ${values[item.key]}`)
      .join('\n\n')
    return sections
  }

  const handleSave = () => {
    onSave({
      title: title || 'Untitled Story',
      date,
      shortDescription,
      fullStoryCopy: fullStoryCopy || generateDraft(),
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

  if (step === 'h-steps') {
    const item = CORE_H_ITEMS[currentH]
    return (
      <div className="flex flex-col gap-4">
        <ProgressIndicator total={CORE_H_ITEMS.length} current={currentH} />
        <p className="text-caption text-text-muted text-center">
          Step {currentH + 1} of {CORE_H_ITEMS.length}
        </p>
        <StepCard
          key={item.key}
          item={item}
          value={values[item.key as CoreH]}
          onChange={(val) => updateValue(item.key, val)}
          autoFocus
        />
        <div className="flex items-center gap-3">
          <RecordButton isRecording={isRecording} onStart={startRecording} onStop={stopRecording} />
        </div>
        {audioUrl && <AudioPlayer audioUrl={audioUrl} onRemove={clearRecording} />}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentH(Math.max(0, currentH - 1))}
            disabled={currentH === 0}
            className="flex items-center gap-1 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors disabled:opacity-30"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentH < CORE_H_ITEMS.length - 1) {
                setCurrentH(currentH + 1)
              } else {
                setStep('bonus')
              }
            }}
            className="flex items-center gap-1 bg-primary-teal text-text-inverse rounded-full px-5 py-2 text-caption font-bold hover:opacity-90 transition-opacity"
          >
            {currentH < CORE_H_ITEMS.length - 1 ? 'Next' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  if (step === 'bonus') {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-h3 font-bold text-text-heading text-center">
          Bonus H's
        </h2>
        <p className="text-caption text-text-muted text-center">
          These are optional. Add any that feel right.
        </p>
        {!showBonus ? (
          <div className="flex flex-col gap-3 items-center">
            <button
              type="button"
              onClick={() => setShowBonus(true)}
              className="bg-bg-white shadow-card rounded-full px-5 py-2.5 text-caption font-bold text-primary-teal hover:shadow-md transition-shadow"
            >
              + Add Bonus H's
            </button>
            <button
              type="button"
              onClick={() => setStep('details')}
              className="text-caption font-semibold text-text-muted hover:text-text-heading transition-colors"
            >
              Skip to details
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {BONUS_H_ITEMS.map((item) => (
                <StepCard
                  key={item.key}
                  item={item}
                  value={values[item.key]}
                  onChange={(val) => updateValue(item.key, val)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep('details')}
              className="self-end flex items-center gap-1 bg-primary-teal text-text-inverse rounded-full px-5 py-2 text-caption font-bold hover:opacity-90 transition-opacity"
            >
              Continue <ArrowRight size={16} />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setStep('h-steps')}
          className="flex items-center gap-1 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors"
        >
          <ArrowLeft size={16} /> Back to 5H's
        </button>
      </div>
    )
  }

  // Details step
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h3 font-bold text-text-heading text-center">
        Finish Your Story
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your story a name..."
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
        <label className="text-caption font-semibold text-text-muted">Full Story</label>
        <p className="text-caption text-text-muted">
          Write it out, or we'll stitch your 5H sections together.
        </p>
        <textarea
          value={fullStoryCopy}
          onChange={(e) => setFullStoryCopy(e.target.value)}
          placeholder={generateDraft() || 'Tell the full story...'}
          rows={6}
          className="w-full bg-bg-white rounded-sm px-4 py-3 text-caption leading-relaxed resize-none shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

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
          <button
            type="button"
            onClick={addTag}
            className="bg-primary-teal/10 text-primary-teal rounded-full px-3 py-2 text-caption font-bold hover:bg-primary-teal/20 transition-colors"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="text-caption font-semibold px-3 py-1 rounded-full bg-primary-teal/10 text-primary-teal hover:bg-error/10 hover:text-error transition-colors"
              >
                {tag} &times;
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-caption font-semibold text-text-muted">Mood / Emotion (optional)</label>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g. grateful, anxious, hopeful..."
          className="w-full bg-bg-white rounded-sm px-4 py-2.5 text-caption shadow-card focus:outline-none focus:shadow-md transition-shadow"
        />
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep('bonus')}
          className="flex items-center gap-1 text-caption font-semibold text-text-muted hover:text-text-heading transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-primary-teal text-text-inverse rounded-full px-6 py-2.5 text-label font-bold hover:opacity-90 transition-opacity"
        >
          Save Story
        </button>
      </div>
    </div>
  )
}
