import { useState, useCallback, useEffect } from 'react'
import type { Story } from '@/lib/types'
import { rowToStory, storyToRow } from '@/lib/types'
import { storyDb } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { uploadAudio, deleteAudio } from '@/lib/storage'

export function useStories() {
  const { team } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!team) return
    setLoading(true)
    const { data } = await storyDb
      .from('stories')
      .select('*')
      .eq('team_id', team.id)
      .order('date', { ascending: false })

    const mapped = (data || []).map(rowToStory)
    setStories(mapped)

    // Extract unique tags from all stories
    const tagSet = new Set<string>()
    for (const story of mapped) {
      for (const tag of story.tags) {
        tagSet.add(tag)
      }
    }
    setTags(Array.from(tagSet).sort())
    setLoading(false)
  }, [team])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createStory = useCallback(async (
    data: Omit<Story, 'id' | 'teamId' | 'createdAt' | 'updatedAt' | 'audioPath'> & { audioBlob?: Blob }
  ) => {
    if (!team) return null
    const { audioBlob, ...fields } = data
    const row = storyToRow({ ...fields, teamId: team.id })

    const { data: inserted, error } = await storyDb
      .from('stories')
      .insert(row)
      .select()
      .single()

    if (error || !inserted) return null

    // Upload audio if provided
    if (audioBlob) {
      const path = await uploadAudio(audioBlob, team.id, inserted.id)
      await storyDb
        .from('stories')
        .update({ audio_path: path })
        .eq('id', inserted.id)
    }

    await refresh()
    return rowToStory(inserted)
  }, [team, refresh])

  const updateStory = useCallback(async (
    id: string,
    data: Partial<Story> & { audioBlob?: Blob }
  ) => {
    if (!team) return
    const { audioBlob, ...fields } = data
    const row = storyToRow({ ...fields, teamId: team.id })

    // Upload new audio if provided
    if (audioBlob) {
      const path = await uploadAudio(audioBlob, team.id, id)
      Object.assign(row, { audio_path: path })
    }

    await storyDb
      .from('stories')
      .update(row)
      .eq('id', id)

    await refresh()
  }, [team, refresh])

  const removeStory = useCallback(async (id: string) => {
    // Delete audio from storage if it exists
    const story = stories.find((s) => s.id === id)
    if (story?.audioPath) {
      try { await deleteAudio(story.audioPath) } catch { /* ignore */ }
    }

    await storyDb
      .from('stories')
      .delete()
      .eq('id', id)

    await refresh()
  }, [stories, refresh])

  return { stories, tags, loading, refresh, createStory, updateStory, removeStory }
}

export function useStory(id: string | undefined) {
  const { team } = useAuth()
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!id || !team) {
      setStory(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await storyDb
      .from('stories')
      .select('*')
      .eq('id', id)
      .single()

    setStory(data ? rowToStory(data) : null)
    setLoading(false)
  }, [id, team])

  useEffect(() => {
    load()
  }, [load])

  return { story, loading, reload: load }
}
