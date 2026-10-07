import 'server-only'
import fs from 'fs/promises'
import path from 'path'

export type DesignKey = 'home' | 'about' | 'services' | 'work' | 'contact' | `service-${string}`

/** Search titles and descriptions for the pages that come from the design. */
export const SERVICES: Record<string, { name: string; title: string; description: string }> = {
  'web-development': { name: 'Web development', title: 'Web Development Company in Pakistan', description: 'Websites that load fast and bring in leads. Every site ships with performance budgets, analytics and an editor your team enjoys using.' },
  'mobile-apps': { name: 'Mobile apps', title: 'Mobile App Development (iOS and Android)', description: 'Mobile apps your customers keep using. Every build goes to a test group first, so you try new features before your customers do.' },
  'ui-ux-design': { name: 'UI/UX design', title: 'UI/UX Design Services', description: 'Design that users understand the first time. You see and comment on every screen in Figma, and developers build from the same file.' },
  'custom-software': { name: 'Custom software', title: 'Custom Software Development', description: 'Custom software that fits how you work. You own the code, the servers and the documentation, and you can see the work as it happens.' },
  'e-commerce': { name: 'E-commerce', title: 'E-commerce Website Development', description: 'Online stores built to sell every day, with conversion tracking and a dashboard for revenue, top products and drop-off points.' },
  'ai-automation': { name: 'AI & automation', title: 'AI and Automation Services', description: 'AI and automation that saves real hours. We agree on one number to improve, prove the value with a pilot, then expand.' },
  'seo-growth': { name: 'SEO & growth', title: 'SEO Services that Bring the Right Visitors', description: 'SEO that brings the right visitors. You see what changed, what it brought in and what we will do next, without jargon.' },
  'cloud-devops': { name: 'Cloud & DevOps', title: 'Cloud Hosting and DevOps Services', description: 'Cloud hosting that stays fast and stays up, with monitoring, logs, alerts and a clear plan for incidents on every system we run.' },
  'digital-marketing': { name: 'Digital marketing', title: 'Digital Marketing that Pays for Itself', description: 'Marketing that pays for itself. Tracking comes first, so every campaign shows what it cost and what it brought in.' },
  'maintenance-support': { name: 'Maintenance & support', title: 'Website and App Maintenance and Support', description: 'Support after launch from the team that built it. Raise requests in one place and see who is on it, what changed and when it went live.' },
}

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
