import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guide')

export interface GuideMeta {
  slug: string
  city: string
  title: string
  description: string
  destinationSlug: string
  emoji?: string
}

export function getGuidesForDestination(destinationSlug: string): GuideMeta[] {
  const dir = path.join(GUIDES_DIR, destinationSlug)
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))

  return files.map(file => {
    const citySlug = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { data } = matter(raw)
    return {
      slug: citySlug,
      city: data.city ?? citySlug,
      title: data.title ?? citySlug,
      description: data.description ?? '',
      emoji: data.emoji ?? '📍',
      destinationSlug,
    }
  })
}

export function getGuideContent(destinationSlug: string, citySlug: string): { meta: GuideMeta; content: string } | null {
  const filePath = path.join(GUIDES_DIR, destinationSlug, `${citySlug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    meta: {
      slug: citySlug,
      city: data.city ?? citySlug,
      title: data.title ?? citySlug,
      description: data.description ?? '',
      emoji: data.emoji ?? '📍',
      destinationSlug,
    },
    content,
  }
}

export function getAllGuideParams(): { slug: string; city: string }[] {
  if (!fs.existsSync(GUIDES_DIR)) return []

  const destinations = fs.readdirSync(GUIDES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  const params: { slug: string; city: string }[] = []
  for (const slug of destinations) {
    const guides = getGuidesForDestination(slug)
    for (const guide of guides) {
      params.push({ slug, city: guide.slug })
    }
  }
  return params
}
