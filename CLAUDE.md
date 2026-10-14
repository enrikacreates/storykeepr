# StoryKeepr — CLAUDE.md

## What This App Is

**StoryKeepr** is a personal story collection app built around the 5H Heart Story Framework (Hope, Hangup, Handle, Heart, Hindsight + 6 bonus H's). It gives a structured, beautiful place to capture life stories with narrative shape, audio recordings, and tags.

**Domain:** storykeepr.app
**Brand:** Part of Small Gorilla Creative app suite

---

## Tech Stack

- **Frontend:** React 19 + Vite 8 + TypeScript 5.9
- **Styling:** Tailwind CSS v4 with CreamyDesign tokens
- **Routing:** React Router v7
- **Backend:** Supabase (shared project `bmwpqxsdarevgaznslcz`, schema `storykeepr`)
- **Audio:** MediaRecorder API (browser-native) + Supabase Storage
- **Icons:** lucide-react
- **Deploy:** Vercel

---

## Architecture

### Schema Isolation
- App data lives in `storykeepr` Postgres schema
- Auth uses shared `auth.users` + `public.teams` + `public.team_members`
- `storyDb.from('table')` queries the storykeepr schema
- `supabase.from('table')` queries the public schema (teams, auth)

### Key Files
- `src/lib/supabase.ts` — Supabase client + `storyDb` helper
- `src/lib/auth.tsx` — AuthProvider with team fetching
- `src/lib/storage.ts` — Audio upload/download to Supabase Storage
- `src/lib/types.ts` — All TypeScript interfaces + row mapping functions
- `src/lib/constants.ts` — 5H framework definitions, prompts, colors

### Hooks Pattern
Each feature has a hook: `useStories`, `useSearch`, `useAudioRecorder`. Hooks use `useState` + `useCallback` + fetch-on-mount. No TanStack Query or Zustand.

### Audio Pipeline
1. User records via MediaRecorder API (useAudioRecorder hook)
2. On save, blob is uploaded to `storykeepr-audio/{team_id}/{story_id}.webm`
3. Story record stores `audio_path` reference
4. Playback via signed URL from Supabase Storage

---

## Design System

Uses **CreamyDesign** with these specifics:
- **NO borders or outlines on ANY element** — shadows only
- Cards: `shadow-card`, inputs: `shadow-input`, floating elements: `shadow-float`
- Buttons: `rounded-full` pills
- Cream layering: `bg-bg-cream` (app) → `bg-bg-cream-light` (cards) → `bg-bg-white` (elevated)
- Display font: **Fredoka** (`font-display`)
- UI font: **Inter** (`font-sans`)
- Focus states use box-shadow rings, not outline/border

### 5H Surface Colors
- Hope → `bg-surface-mint`
- Hangup → `bg-surface-pink`
- Handle → `bg-surface-beige`
- Heart → `bg-surface-lavender`
- Hindsight → `bg-primary-teal/10`

---

## Database Schema

All tables in `storykeepr` schema. Team-scoped via `team_id` + RLS.

| Table | Purpose |
|-------|---------|
| `stories` | Main story data — all 5H + bonus fields, audio_path, tags (text[]), mood |

Tags are stored as a `text[]` array column on stories (not a separate table).

RLS: `storykeepr.user_team_ids()` (SECURITY DEFINER) for team-scoped access.

---

## Routes

| Path | Page | Purpose |
|------|------|---------|
| `/` | LibraryPage | Story library with search and tag filters |
| `/new` | NewStoryPage | Mode picker (Guided vs Freeform) |
| `/story/:id` | StoryDetailPage | Full story view with 5H breakdown |
| `/story/:id/edit` | EditStoryPage | Edit all story fields |
| `/login` | LoginPage | Auth (sign in/up) |

---

## Environment Variables

```
VITE_SUPABASE_URL=https://bmwpqxsdarevgaznslcz.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

---

## Dev Server

```bash
npm run dev    # Vite dev server on localhost:5173
npm run build  # TypeScript check + Vite build
```

---

## Important Notes for Agents

- **Designer-led project** — respect visual/design decisions, collaborate don't override
- **Shadow-only** — never add `border` or `outline` classes to any element
- **CreamyDesign** reference: `/Apps/CreamyDesign.md`
- **Shared Supabase** — never modify public schema tables (teams, team_members) from this app
- **React (not Next.js)** — this is a Vite + React SPA
- All data queries go through hooks in `src/hooks/`
- Story fields use camelCase in TypeScript, snake_case in the database — mapping functions in `types.ts`

---

## Future

- Claude API for story generation from 5H sections
- Audio transcription via Whisper/Web Speech API
- Export as JSON for cross-app portability (WorkshopBlocks, talks, content)

## Build locally before pushing

Before any `git push` or `vercel deploy`, run the project's build (`npm run build`, or the equivalent for its package manager) and make sure it passes. Every push to `main` triggers a paid Vercel build, and failed builds still burn build minutes, so catch errors locally first.

- If the build fails, fix it before pushing. Don't push "to see if Vercel builds it."
- Batch related commits and push once, rather than pushing after every small change.
