import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getGuideContent, getAllGuideParams } from '@/lib/guides'
import { getDestinationBySlug } from '@/lib/data'

export const revalidate = false

interface Props {
  params: { slug: string; city: string }
}

export async function generateStaticParams() {
  return getAllGuideParams()
}

export async function generateMetadata({ params }: Props) {
  const guide = getGuideContent(params.slug, params.city)
  if (!guide) return {}
  return {
    title: `${guide.meta.title} — travelclub`,
    description: guide.meta.description,
  }
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-display font-semibold" style={{ fontSize: 20, color: '#1A2010', marginTop: 36, marginBottom: 12, lineHeight: 1.2 }} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-display font-semibold" style={{ fontSize: 16, color: '#1A2010', marginTop: 24, marginBottom: 8 }} {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p style={{ fontSize: 14, color: '#3A4A2A', lineHeight: 1.75, marginBottom: 16 }} {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul style={{ marginBottom: 16, paddingLeft: 20 }} {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li style={{ fontSize: 14, color: '#3A4A2A', lineHeight: 1.75, marginBottom: 6 }} {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong style={{ fontWeight: 700, color: '#1A2010' }} {...props} />
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid #DDE4D0', margin: '28px 0' }} />
  ),
}

export default async function GuidaPage({ params }: Props) {
  const [guide, dest] = await Promise.all([
    Promise.resolve(getGuideContent(params.slug, params.city)),
    getDestinationBySlug(params.slug),
  ])

  if (!guide || !dest) notFound()

  return (
    <div>
      {/* Hero */}
      <div style={{ background: '#1A2010', padding: '32px 24px 28px' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-5" style={{ fontSize: 12 }}>
            <Link href="/destinazioni" style={{ color: '#A8C468' }} className="hover:opacity-80 transition-opacity">
              Destinazioni
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <Link href={`/destinazioni/${dest.slug}`} style={{ color: 'rgba(255,255,255,0.5)' }} className="hover:opacity-80 transition-opacity">
              {dest.name}
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{guide.meta.city}</span>
          </div>

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8C468', marginBottom: 8 }}>
            {guide.meta.emoji} Guida città
          </p>
          <h1 className="font-display font-bold" style={{ fontSize: 36, color: 'white', lineHeight: 1.1, marginBottom: 8 }}>
            {guide.meta.title}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.6 }}>
            {guide.meta.description}
          </p>
        </div>
      </div>

      {/* Contenuto */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <MDXRemote source={guide.content} components={mdxComponents} />

        {/* Footer */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          style={{ borderTop: '1px solid #DDE4D0' }}>
          <p style={{ fontSize: 12, color: '#7A8F6A' }}>
            Guida redatta dalla community travelclub.
          </p>
          <Link href={`/destinazioni/${dest.slug}`}
            className="font-semibold transition-colors"
            style={{ fontSize: 13, color: '#5A7A35' }}>
            ← Torna a {dest.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
