import type { HFrameworkItem } from './types'

export const CORE_H_ITEMS: HFrameworkItem[] = [
  {
    key: 'hope',
    label: 'Hope',
    prompt: 'What were you hoping for today?',
    surface: 'bg-surface-mint',
    isBonus: false,
  },
  {
    key: 'hangup',
    label: 'Hangup',
    prompt: 'What was the hangup or hard part?',
    surface: 'bg-surface-pink',
    isBonus: false,
  },
  {
    key: 'handle',
    label: 'Handle',
    prompt: "How'd you handle it? What happened? What did you do?",
    surface: 'bg-surface-beige',
    isBonus: false,
  },
  {
    key: 'heart',
    label: 'Heart',
    prompt: 'What was the true heart of the matter — the underlying emotion, tension, stakes?',
    surface: 'bg-surface-lavender',
    isBonus: false,
  },
  {
    key: 'hindsight',
    label: 'Hindsight',
    prompt: 'Looking back, what was the lesson learned or learning in hindsight?',
    surface: 'bg-primary-teal/10',
    isBonus: false,
  },
]

export const BONUS_H_ITEMS: HFrameworkItem[] = [
  {
    key: 'hook',
    label: 'Hook',
    prompt: 'If this day was a story, what would be the hook? What would the title be?',
    surface: 'bg-bg-cream-light',
    isBonus: true,
  },
  {
    key: 'humor',
    label: 'Humor',
    prompt: 'Was there something funny, ironic, or absurd about it?',
    surface: 'bg-bg-cream-light',
    isBonus: true,
  },
  {
    key: 'humility',
    label: 'Humility',
    prompt: "What humbled you? What reminded you that you don't have it all figured out?",
    surface: 'bg-bg-cream-light',
    isBonus: true,
  },
  {
    key: 'hiddenHeroes',
    label: 'Hidden Heroes',
    prompt: "Who showed up for you that you didn't expect? Who deserves credit?",
    surface: 'bg-bg-cream-light',
    isBonus: true,
  },
  {
    key: 'humdrum',
    label: 'Humdrum',
    prompt: 'What was the ordinary, mundane detail that actually mattered?',
    surface: 'bg-bg-cream-light',
    isBonus: true,
  },
  {
    key: 'headspace',
    label: 'Headspace',
    prompt: 'Where was your mind? What was your internal state?',
    surface: 'bg-bg-cream-light',
    isBonus: true,
  },
]

export const ALL_H_ITEMS: HFrameworkItem[] = [...CORE_H_ITEMS, ...BONUS_H_ITEMS]
