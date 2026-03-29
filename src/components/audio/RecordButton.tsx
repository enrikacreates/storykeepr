import { Mic, Square } from 'lucide-react'

interface RecordButtonProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
}

export function RecordButton({ isRecording, onStart, onStop }: RecordButtonProps) {
  return (
    <button
      type="button"
      onClick={isRecording ? onStop : onStart}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-caption font-bold transition-all ${
        isRecording
          ? 'bg-error text-text-inverse animate-pulse'
          : 'bg-primary-teal text-text-inverse hover:opacity-90'
      }`}
    >
      {isRecording ? <Square size={16} /> : <Mic size={16} />}
      {isRecording ? 'Stop Recording' : 'Record Audio'}
    </button>
  )
}
