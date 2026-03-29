import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Team, TeamMember } from './types'

interface AuthState {
  user: User | null
  session: Session | null
  team: Team | null
  teamMember: TeamMember | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; needsConfirmation?: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const teamIdRef = useRef<string | null>(null)

  async function fetchTeam(userId: string) {
    const { data: member } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .limit(1)
      .single()

    if (member) {
      if (teamIdRef.current === member.team_id) return
      teamIdRef.current = member.team_id
      setTeamMember(member)
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('id', member.team_id)
        .single()

      if (teamData) setTeam(teamData)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchTeam(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchTeam(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        teamIdRef.current = null
        setTeam(null)
        setTeamMember(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    const needsConfirmation = !error && !!data?.user && !data.session
    return { error: error as Error | null, needsConfirmation }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, team, teamMember, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
