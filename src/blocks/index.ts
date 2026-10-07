import type { Block } from 'payload'

/** Extra building blocks inside an insight's body. */
export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'ts',
      options: ['ts', 'tsx', 'js', 'jsx', 'json', 'bash', 'css', 'html', 'python', 'sql', 'php', 'yaml', 'text'].map((v) => ({ label: v, value: v })),
    },
    { name: 'filename', type: 'text' },
    { name: 'code', type: 'code', required: true },
  ],
}

export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  fields: [
    { name: 'tone', type: 'select', defaultValue: 'note', options: [{ label: 'Note', value: 'note' }, { label: 'Tip', value: 'tip' }, { label: 'Warning', value: 'warning' }] },
    { name: 'title', type: 'text' },
    { name: 'text', type: 'textarea', required: true },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Planning something like this?' },
    { name: 'text', type: 'textarea', defaultValue: 'Tell us about your project. We reply within one business day.' },
    { name: 'label', type: 'text', defaultValue: 'Start a project' },
    { name: 'href', type: 'text', defaultValue: '/contact' },
  ],
}

export const postBlocks = [CodeBlock, CalloutBlock, CtaBlock]
