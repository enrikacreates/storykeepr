export interface Story {
  id: string
  teamId: string
  title: string
  date: string // ISO date (when it happened)
  shortDescription: string
  fullStoryCopy: string

  // Core 5H's
  hope: string
  hangup: string
  handle: string
  heart: string
  hindsight: string

  // Bonus H's (optional)
  hook?: string
  humor?: string
  humility?: string
  hiddenHeroes?: string
  humdrum?: string
  headspace?: string

  // Media
  audioPath?: string

  // Metadata
  tags: string[]
  mood?: string
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
}

export type CoreH = 'hope' | 'hangup' | 'handle' | 'heart' | 'hindsight'
export type BonusH = 'hook' | 'humor' | 'humility' | 'hiddenHeroes' | 'humdrum' | 'headspace'
export type AllH = CoreH | BonusH

export interface HFrameworkItem {
  key: AllH
  label: string
  prompt: string
  surface: string // Tailwind class
  isBonus: boolean
}

export interface Team {
  id: string
  name: string
  created_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: string
  created_at: string
}

// Maps a Supabase row to our camelCase Story interface
export function rowToStory(row: Record<string, unknown>): Story {
  return {
    id: row.id as string,
    teamId: row.team_id as string,
    title: row.title as string,
    date: row.date as string,
    shortDescription: (row.short_description as string) || '',
    fullStoryCopy: (row.full_story_copy as string) || '',
    hope: (row.hope as string) || '',
    hangup: (row.hangup as string) || '',
    handle: (row.handle as string) || '',
    heart: (row.heart as string) || '',
    hindsight: (row.hindsight as string) || '',
    hook: row.hook as string | undefined,
    humor: row.humor as string | undefined,
    humility: row.humility as string | undefined,
    hiddenHeroes: row.hidden_heroes as string | undefined,
    humdrum: row.humdrum as string | undefined,
    headspace: row.headspace as string | undefined,
    audioPath: row.audio_path as string | undefined,
    tags: (row.tags as string[]) || [],
    mood: row.mood as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

// Maps our camelCase Story fields to snake_case for Supabase insert/update
export function storyToRow(story: Partial<Story> & { teamId: string }) {
  return {
    ...(story.id && { id: story.id }),
    team_id: story.teamId,
    ...(story.title !== undefined && { title: story.title }),
    ...(story.date !== undefined && { date: story.date }),
    ...(story.shortDescription !== undefined && { short_description: story.shortDescription }),
    ...(story.fullStoryCopy !== undefined && { full_story_copy: story.fullStoryCopy }),
    ...(story.hope !== undefined && { hope: story.hope }),
    ...(story.hangup !== undefined && { hangup: story.hangup }),
    ...(story.handle !== undefined && { handle: story.handle }),
    ...(story.heart !== undefined && { heart: story.heart }),
    ...(story.hindsight !== undefined && { hindsight: story.hindsight }),
    ...(story.hook !== undefined && { hook: story.hook || null }),
    ...(story.humor !== undefined && { humor: story.humor || null }),
    ...(story.humility !== undefined && { humility: story.humility || null }),
    ...(story.hiddenHeroes !== undefined && { hidden_heroes: story.hiddenHeroes || null }),
    ...(story.humdrum !== undefined && { humdrum: story.humdrum || null }),
    ...(story.headspace !== undefined && { headspace: story.headspace || null }),
    ...(story.audioPath !== undefined && { audio_path: story.audioPath || null }),
    ...(story.tags !== undefined && { tags: story.tags }),
    ...(story.mood !== undefined && { mood: story.mood || null }),
  }
}
