import { notFound } from 'next/navigation'
import DesignPage from '@/components/DesignPage'
import JsonLd from '@/components/JsonLd'
import { SERVICES } from '@/lib/designPages'
import { breadcrumbs, ORG_ID } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { abs } from '@/lib/site'
import '@/design/pages/services.css'   // every service page shares the services styles

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => Object.keys(SERVICES).map((slug) => ({ slug }))

export async function generateMetadata({ params }: Props) {
  const s = SERVICES[(await params).slug]
  if (!s) return {}
  return pageMeta({ title: `${s.title} | GEMSOFT Technologies`, description: s.description, path: `/services/${(await params).slug}` })
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const s = SERVICES[slug]
  if (!s) notFound()
  return (
    <>
      <DesignPage page={`service-${slug}`} />
      <JsonLd
        data={[
          { '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: s.name, description: s.description, url: abs(`/services/${slug}`), provider: { '@id': ORG_ID }, areaServed: 'Worldwide' },
          breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: s.name, path: `/services/${slug}` }]),
        ]}
      />
    </>
  )
}
