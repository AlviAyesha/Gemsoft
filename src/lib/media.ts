import type { Media } from '@/payload-types'

type Size = 'thumb' | 'card' | 'wide' | 'og'
/** URL of an uploaded image at a given size (falls back to the original). */
export const mediaUrl = (m: unknown, size?: Size): string | undefined => {
  if (!m || typeof m !== 'object') return undefined
  const media = m as Media
  return (size && media.sizes?.[size]?.url) || media.url || undefined
}
export const mediaAlt = (m: unknown) => (m && typeof m === 'object' ? (m as Media).alt : '') || ''
