import { Trash2 } from 'lucide-react'

interface AudioPlayerProps {
  audioUrl: string
  onRemove?: () => void
}

export function AudioPlayer({ audioUrl, onRemove }: AudioPlayerProps) {
  return (
    <div className="flex items-center gap-3 bg-surface-mint rounded-lg p-3">
      <audio controls src={audioUrl} className="flex-1 h-8" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-text-muted hover:text-error transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
