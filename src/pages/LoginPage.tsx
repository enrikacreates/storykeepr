import { useState } from 'react'
import { useAuth } from '@/lib/auth'

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    } else {
      const { error, needsConfirmation } = await signUp(email, password, fullName)
      if (error) setError(error.message)
      else if (needsConfirmation) setMessage('Check your email to confirm your account.')
    }

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-h1 font-semibold text-text-heading text-center mb-2">
          StoryKeepr
        </h1>
        <p className="text-caption text-text-muted text-center mb-8">
          Collect your stories. Keep them forever.
        </p>

        <form onSubmit={handleSubmit} className="bg-bg-white rounded-lg shadow-card p-6 flex flex-col gap-4">
          <h2 className="text-h3 font-bold text-text-heading">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>

          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-caption font-semibold text-text-muted">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-bg-cream-light rounded-sm px-4 py-2.5 text-caption shadow-input focus:outline-none focus:shadow-md transition-shadow"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-caption font-semibold text-text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-cream-light rounded-sm px-4 py-2.5 text-caption shadow-input focus:outline-none focus:shadow-md transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-caption font-semibold text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-bg-cream-light rounded-sm px-4 py-2.5 text-caption shadow-input focus:outline-none focus:shadow-md transition-shadow"
            />
          </div>

          {error && <p className="text-caption text-error">{error}</p>}
          {message && <p className="text-caption text-success">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-teal text-text-inverse rounded-full px-6 py-2.5 text-label font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? '...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage('') }}
            className="text-caption font-semibold text-primary-teal hover:opacity-80 transition-opacity"
          >
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
