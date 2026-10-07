import { type JSXConvertersFunction, LinkJSXConverter, RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { CalloutBlock, CodeBlock, CtaBlock, Media } from '@/payload-types'
import { mediaUrl } from '@/lib/media'
import Btn from './Btn'
import CodeCopy from './CodeCopy'

type Heading = { tag: 'h2' | 'h3' | 'h4'; __id?: string; children: never[] }

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const d = linkNode.fields.doc
  const slug = typeof d?.value === 'object' ? (d.value as { slug?: string }).slug : ''
  return d?.relationTo === 'posts' ? `/insights/${slug}` : d?.relationTo === 'jobs' ? `/careers/${slug}` : '/'
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  heading: ({ node, nodesToJSX }) => {
    const n = node as unknown as Heading
    const Tag = n.tag
    return (
      <Tag id={n.__id} className="rt-h">
        {nodesToJSX({ nodes: node.children })}
        {n.__id && (
          <a className="rt-anchor" href={`#${n.__id}`} aria-label="Link to this section">
            #
          </a>
        )}
      </Tag>
    )
  },
  upload: ({ node }) => {
    const m = (node as unknown as { value: Media }).value
    if (!m || typeof m !== 'object') return null
    return (
      <figure className="rt-fig">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(m, 'wide')} alt={m.alt || ''} width={m.width ?? undefined} height={m.height ?? undefined} loading="lazy" />
        {(m.caption || m.credit) && (
          <figcaption>
            {m.caption}
            {m.credit && <span> · {m.credit}</span>}
          </figcaption>
        )}
      </figure>
    )
  },
  blocks: {
    code: ({ node }: { node: { fields: unknown } }) => {
      const b = node.fields as unknown as CodeBlock
      return (
        <div className="rt-code">
          <div className="rt-code-bar">
            <span>{b.filename || b.language}</span>
            <CodeCopy code={b.code} />
          </div>
          <pre>
            <code className={`language-${b.language}`}>{b.code}</code>
          </pre>
        </div>
      )
    },
    callout: ({ node }: { node: { fields: unknown } }) => {
      const b = node.fields as unknown as CalloutBlock
      return (
        <aside className={`rt-callout rt-callout--${b.tone}`}>
          {b.title && <strong>{b.title}</strong>}
          <p>{b.text}</p>
        </aside>
      )
    },
    cta: ({ node }: { node: { fields: unknown } }) => {
      const b = node.fields as unknown as CtaBlock
      return (
        <aside className="rt-cta">
          <div>
            <strong>{b.title}</strong>
            {b.text && <p>{b.text}</p>}
          </div>
          <Btn href={b.href || '/contact'}>{b.label || 'Start a project'}</Btn>
        </aside>
      )
    },
  },
})

/** An insight's body with the site's typography, heading anchors, figures, code, callouts and CTA blocks. */
export default function RichText({ data, className = '' }: { data: unknown; className?: string }) {
  return <LexicalRichText data={data as SerializedEditorState} converters={converters} className={`rt ${className}`} />
}
