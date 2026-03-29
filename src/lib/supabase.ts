import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)

const storykeeprSchema = supabase.schema('storykeepr')

export const storyDb = {
  from: (table: string) => storykeeprSchema.from(table),
  rpc: (fn: string, params?: Record<string, unknown>) => storykeeprSchema.rpc(fn, params),
}
