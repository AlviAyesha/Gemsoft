import 'server-only'
import fs from 'fs/promises'
import path from 'path'

export type DesignKey = 'home' | 'about' | 'services' | 'work' | 'contact' | `service-${string}`

export { SERVICES } from '@/content/services'

export const PAGE_SEO: Record<'home' | 'about' | 'services' | 'work' | 'contact', { title: string; description: string; path: string }> = {
  home: { path: '/', title: 'GEMSOFT Technologies | Websites, Apps and Custom Software', description: 'GEMSOFT Technologies builds fast websites, mobile apps, custom software and AI automation for growing businesses. One accountable team from first sketch to support.' },
  about: { path: '/about', title: 'About GEMSOFT Technologies | Your Software Partner', description: 'Meet GEMSOFT Technologies: a team of engineers and designers building websites, apps and custom software with clear plans, honest timelines and code you own.' },
  services: { path: '/services', title: 'Services | Web, Mobile, Software, AI and SEO | GEMSOFT', description: 'Every digital service from one accountable team: web development, mobile apps, UI/UX design, custom software, e-commerce, AI automation, SEO, cloud and support.' },
  work: { path: '/work', title: 'Our Work | Case Studies | GEMSOFT Technologies', description: 'Selected GEMSOFT projects: online stores, booking apps, dashboards and AI assistants, with the challenge, approach and results of each.' },
  contact: { path: '/contact', title: 'Contact GEMSOFT Technologies | Start Your Project', description: 'Tell us about your project. We reply within one business day with next steps, or book a 30-minute call with the team.' },
}

const DIR = path.join(process.cwd(), 'src', 'design', 'pages')

/** Body markup of a design page (nav, menus, sections, footer), read once at build time. */
export const designMarkup = (key: DesignKey) => fs.readFile(path.join(DIR, `${key}.html`), 'utf8')
