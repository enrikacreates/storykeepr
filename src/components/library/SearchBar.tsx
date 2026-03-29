import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search stories..."
        className="w-full bg-bg-white rounded-full pl-10 pr-10 py-2.5 text-caption shadow-card focus:outline-none focus:shadow-md transition-shadow"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
