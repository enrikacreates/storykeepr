import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Sparkles, PenLine } from 'lucide-react'
import { useStories } from '@/hooks/useStories'
import { GuidedFlow } from '@/components/story/GuidedFlow'
import { FreeformEditor } from '@/components/story/FreeformEditor'

type Mode = 'pick' | 'guided' | 'freeform'

export function NewStoryPage() {
  const [mode, setMode] = useState<Mode>('pick')
  const { createStory } = useStories()
  const navigate = useNavigate()

  const handleSave = async (data: Parameters<typeof createStory>[0]) => {
    const story = await createStory(data)
    if (story) navigate(`/story/${story.id}`)
  }

  if (mode === 'guided') {
    return <GuidedFlow onSave={handleSave} />
  }

  if (mode === 'freeform') {
    return <FreeformEditor onSave={handleSave} onBack={() => setMode('pick')} />
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="text-center">
        <h2 className="text-h2 font-bold text-text-heading mb-1">New Story</h2>
        <p className="text-caption text-text-muted">How do you want to tell it?</p>
      </div>

      <button
        type="button"
        onClick={() => setMode('guided')}
        className="bg-bg-white rounded-lg shadow-card p-6 text-left hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-surface-mint flex items-center justify-center">
            <Sparkles size={20} className="text-primary-teal" />
          </div>
          <h3 className="text-body font-bold text-text-heading">Guided Mode</h3>
        </div>
        <p className="text-caption text-text-muted leading-relaxed">
          Walk through the 5H Heart Story Framework step by step. Each H helps you
          shape your story with narrative structure.
        </p>
        <span className="inline-block mt-3 text-caption font-semibold text-primary-teal">
          Recommended
        </span>
      </button>

      <button
        type="button"
        onClick={() => setMode('freeform')}
        className="bg-bg-white rounded-lg shadow-card p-6 text-left hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-surface-beige flex items-center justify-center">
            <PenLine size={20} className="text-text-heading" />
          </div>
          <h3 className="text-body font-bold text-text-heading">Freeform Mode</h3>
        </div>
        <p className="text-caption text-text-muted leading-relaxed">
          Just write. Title, description, and your story. The 5H sections are there
          if you want them.
        </p>
      </button>
    </div>
  )
}
