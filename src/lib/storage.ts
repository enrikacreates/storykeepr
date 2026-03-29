import { supabase } from './supabase'

const BUCKET = 'storykeepr-audio'

export async function uploadAudio(
  blob: Blob,
  teamId: string,
  storyId: string
): Promise<string> {
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
  const path = `${teamId}/${storyId}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: blob.type,
      upsert: true,
    })

  if (error) throw error
  return path
}

export async function getAudioUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600)

  if (error || !data) return null
  return data.signedUrl
}

export async function deleteAudio(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
