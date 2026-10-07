/**
 * Sample content so a fresh database shows real-looking Insights and Careers pages.
 * Run once with `pnpm seed` (or `npm run seed`). It skips anything that already exists, so it is safe to re-run.
 * Replace or delete the samples in the CMS before launch.
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const ctx = { disableRevalidate: true }
const IMG = path.join(process.cwd(), 'public', 'media', 'services')

// ---------- tiny Lexical builders ----------
type N = Record<string, unknown>
const text = (t: string, format = 0): N => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })
const inline = (s: string): N[] => s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) => (part.startsWith('**') ? text(part.slice(2, -2), 1) : text(part)))
const el = (type: string, children: N[], extra: N = {}): N => ({ type, children, direction: 'ltr', format: '', indent: 0, version: 1, ...extra })
const p = (s: string) => el('paragraph', inline(s), { textFormat: 0, textStyle: '' })
const h = (tag: 'h2' | 'h3', s: string) => el('heading', [text(s)], { tag })
const ul = (items: string[]) => el('list', items.map((s, i) => el('listitem', inline(s), { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' })
const ol = (items: string[]) => el('list', items.map((s, i) => el('listitem', inline(s), { value: i + 1 })), { listType: 'number', start: 1, tag: 'ol' })
let bid = 0
const block = (blockType: string, fields: N): N => ({ type: 'block', version: 2, format: '', fields: { id: `seed${++bid}${Date.now().toString(36)}`, blockName: '', blockType, ...fields } })
const doc = (...children: N[]) => ({ root: { type: 'root', children, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 } })

const findOne = async (collection: 'categories' | 'authors' | 'posts' | 'jobs' | 'media', field: string, value: string) =>
  (await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, depth: 0, draft: true, overrideAccess: true })).docs[0] as { id: number } | undefined

// ---------- media ----------
const media = async (file: string, alt: string) => {
  const name = `seed-${file}`
  const found = await findOne('media', 'filename', name)
  if (found) return found.id
  const data = fs.readFileSync(path.join(IMG, file))
  const m = await payload.create({ collection: 'media', data: { alt }, file: { data, mimetype: 'image/webp', name, size: data.length }, context: ctx })
  return m.id
}

// ---------- categories and authors ----------
const CATS = [
  ['Web development', 'web-development', 'Building fast websites and web apps that load quickly, rank well and convert.'],
  ['Mobile apps', 'mobile-apps', 'Planning, designing and shipping iOS and Android apps people keep using.'],
  ['AI & automation', 'ai-automation', 'Practical AI and automation that saves real hours in real businesses.'],
  ['SEO & growth', 'seo-growth', 'Search, analytics and growth: getting the right visitors and turning them into customers.'],
  ['Design', 'design', 'UI and UX design that people understand the first time.'],
  ['Company news', 'company-news', 'News, launches and stories from the GEMSOFT team.'],
] as const
const cat: Record<string, number> = {}
for (const [title, slug, description] of CATS) {
  cat[slug] = (await findOne('categories', 'slug', slug))?.id ?? (await payload.create({ collection: 'categories', data: { title, slug, description }, context: ctx })).id
}

const AUTHORS = [
  { name: 'GEMSOFT Team', slug: 'gemsoft-team', role: 'Editorial', bio: 'Notes from the designers, engineers and marketers who build software at GEMSOFT Technologies.' },
  { name: 'GEMSOFT Engineering', slug: 'gemsoft-engineering', role: 'Engineering team', bio: 'The people who write, test and run the code behind our clients’ websites, apps and platforms.' },
]
const author: Record<string, number> = {}
for (const a of AUTHORS) author[a.slug] = (await findOne('authors', 'slug', a.slug))?.id ?? (await payload.create({ collection: 'authors', data: a, context: ctx })).id

// ---------- insights ----------
const day = (n: number) => new Date(Date.now() - n * 864e5).toISOString()
const POSTS = [
  {
    slug: 'how-much-does-a-website-cost-in-pakistan',
    title: 'How much does a business website cost in Pakistan in 2026?',
    excerpt: 'Real price ranges for business websites, online stores and web apps, what drives the cost up, and how to get a quote you can trust.',
    img: ['px-1181675.webp', 'Developer working on a website across three monitors'],
    cats: ['web-development'],
    author: 'gemsoft-team',
    featured: true,
    age: 3,
    tags: ['website cost', 'pricing', 'web development'],
    keyword: 'website cost in Pakistan',
    content: doc(
      p('“How much will a website cost?” is the first question almost every client asks us, and the honest answer is: it depends on what the site has to do. This guide gives you real ranges and explains exactly what moves the price.'),
      h('h2', 'Typical price ranges'),
      ul([
        '**Simple business website** (5 to 8 pages, contact form, basic SEO): the smallest budget, usually two to four weeks of work.',
        '**Custom designed website with a CMS** (blog, case studies, editable pages): a mid-range budget, four to eight weeks.',
        '**Online store** (catalogue, payments, delivery rules): depends heavily on the number of products and integrations.',
        '**Web application** (accounts, dashboards, custom logic): priced by scope, usually in phases.',
      ]),
      block('callout', { tone: 'tip', title: 'Ask for a fixed scope', text: 'A quote is only useful if it lists the pages, features and rounds of changes it covers. If it does not, the price will move later.' }),
      h('h2', 'What makes a website cost more'),
      h('h3', 'Custom design versus a theme'),
      p('A theme is quicker and cheaper, but every change fights the theme. A custom design costs more up front and is easier to grow, because it is built around your content.'),
      h('h3', 'Content and integrations'),
      p('Writing, photography and connections to other tools (CRM, payment gateways, ERPs) often cost more than the pages themselves. List them before you ask for quotes.'),
      h('h3', 'Speed, SEO and accessibility'),
      p('A fast, accessible site that search engines understand takes deliberate work. It is also the work that pays for itself, because it brings visitors without paying for ads.'),
      h('h2', 'How to get a quote you can trust'),
      ol(['Write down the goal of the site in one sentence.', 'List the pages and features you are sure about, and the ones you are not.', 'Ask each agency what is included, what is not, and what happens after launch.']),
      block('cta', { title: 'Want a clear quote?', text: 'Tell us what your website needs to do. We will send a fixed scope and price within two working days.', label: 'Get a quote', href: '/contact' }),
    ),
    faq: [
      { question: 'How long does it take to build a website?', answer: 'A simple business site takes two to four weeks. A custom site with a CMS usually takes four to eight weeks, depending on content and feedback.' },
      { question: 'Do I pay monthly after launch?', answer: 'You pay for hosting and your domain. Maintenance and support plans are optional and cover updates, backups and small changes.' },
    ],
  },
  {
    slug: 'nextjs-vs-wordpress-for-business-websites',
    title: 'Next.js or WordPress: which is better for your business website?',
    excerpt: 'An honest comparison of speed, editing, security and cost, and the simple question that decides which one you should pick.',
    img: ['px-270404.webp', 'Website code on a screen'],
    cats: ['web-development'],
    author: 'gemsoft-engineering',
    age: 9,
    tags: ['Next.js', 'WordPress', 'CMS'],
    keyword: 'Next.js vs WordPress',
    content: doc(
      p('Both can run a great business website. The right choice depends on who edits the site, how fast it must be, and what it has to connect to.'),
      h('h2', 'Speed'),
      p('A Next.js site sends pre-built pages from a global network, so pages usually load in under a second. WordPress can be fast too, but it needs caching, careful plugins and good hosting to get there.'),
      h('h2', 'Editing'),
      p('WordPress is familiar to many teams. With a modern headless CMS such as Payload, a Next.js site gets an editor that is just as easy, with live preview and drafts.'),
      h('h2', 'Security and upkeep'),
      p('Most hacked WordPress sites are hacked through out-of-date plugins. A Next.js site has far fewer moving parts on the public side, which means less to patch.'),
      block('code', { language: 'tsx', filename: 'app/insights/page.tsx', code: "export const revalidate = 3600\n\nexport default async function Page() {\n  const posts = await listPosts()\n  return <PostGrid posts={posts} />\n}" }),
      h('h2', 'So which one?'),
      ul(['Pick **WordPress** if you need a large plugin ecosystem and a small budget.', 'Pick **Next.js** if speed, SEO and custom features matter, or the site will grow into an app.']),
    ),
  },
  {
    slug: 'ai-automation-ideas-for-small-businesses',
    title: '7 AI automation ideas that save small businesses hours every week',
    excerpt: 'From answering common customer questions to reading invoices, these are the automations we see pay for themselves fastest.',
    img: ['px-8386434.webp', 'A robot hand reaching towards a human hand'],
    cats: ['ai-automation'],
    author: 'gemsoft-team',
    age: 15,
    tags: ['AI', 'automation', 'productivity'],
    keyword: 'AI automation for small business',
    content: doc(
      p('AI is most useful when it removes a boring, repeated task. Here are seven ideas, ordered by how quickly they usually pay back.'),
      h('h2', 'Customer-facing'),
      ol(['**Answer common questions** on your website and WhatsApp from your own documents.', '**Qualify leads** before they reach sales, with a short guided chat.', '**Draft replies** to emails, so your team only edits and sends.']),
      h('h2', 'Back office'),
      ol(['**Read invoices and receipts** into your accounting tool.', '**Summarise meetings** and turn them into tasks.', '**Tag and route support tickets** to the right person.', '**Write product descriptions** in your brand voice for review.']),
      block('callout', { tone: 'note', title: 'Start with one number', text: 'Pick one measure, such as hours spent on invoices each week, and prove the improvement with a small pilot before expanding.' }),
    ),
  },
  {
    slug: 'technical-seo-checklist-for-new-websites',
    title: 'The technical SEO checklist we run before every launch',
    excerpt: 'Canonical URLs, sitemaps, structured data, speed and redirects: the checks that stop a new website from losing its search traffic.',
    img: ['px-590022.webp', 'Charts on paper being reviewed with a pen'],
    cats: ['seo-growth'],
    author: 'gemsoft-engineering',
    age: 22,
    tags: ['SEO', 'launch checklist', 'structured data'],
    keyword: 'technical SEO checklist',
    content: doc(
      p('A redesign is the easiest way to lose search traffic. This is the list we run on every site before it goes live.'),
      h('h2', 'Crawling and indexing'),
      ul(['One canonical URL per page, with https and without trailing duplicates.', 'An XML sitemap that lists only pages you want indexed.', 'A robots.txt that blocks staging and admin, nothing else.', '301 redirects from every old URL that had traffic or links.']),
      h('h2', 'Understanding'),
      ul(['A unique title and description on every page.', 'Structured data for the organisation, articles, FAQs, services and jobs.', 'Headings in order, and descriptive alt text on images.']),
      h('h2', 'Speed'),
      ul(['Largest contentful paint under 2.5 seconds on mobile.', 'Images in modern formats and the right sizes.', 'No layout shift when fonts or images load.']),
      block('cta', { title: 'Launching a new site?', text: 'We will run this checklist on your site and send you the results.', label: 'Ask for an audit', href: '/contact' }),
    ),
  },
  {
    slug: 'planning-your-first-mobile-app',
    title: 'Planning your first mobile app: a step-by-step guide',
    excerpt: 'How to go from an idea to a first version people use, without spending your whole budget on features nobody needs.',
    img: ['px-5082579.webp', 'Hands holding a phone showing an app'],
    cats: ['mobile-apps', 'design'],
    author: 'gemsoft-team',
    age: 30,
    tags: ['mobile apps', 'MVP', 'planning'],
    keyword: 'how to plan a mobile app',
    content: doc(
      p('Most first apps try to do too much. The ones that succeed do one thing well, then grow from what users actually do.'),
      h('h2', '1. Define the one job'),
      p('Write the main job of the app in a sentence: “Customers can book and pay for a service in under a minute.” Every feature has to serve that sentence.'),
      h('h2', '2. Sketch the main flow'),
      p('Draw the screens a user sees from opening the app to finishing the job. This is where most of the cost is decided.'),
      h('h2', '3. Choose how to build it'),
      ul(['**Cross-platform** (Flutter or React Native): one codebase for iOS and Android, usually the best value.', '**Native**: when you need heavy device features or the very best performance.']),
      h('h2', '4. Test with real people early'),
      p('Put a clickable prototype in front of five target users before writing code. It is the cheapest change you will ever make.'),
    ),
  },
  {
    slug: 'ux-mistakes-that-cost-you-customers',
    title: '5 UX mistakes that quietly cost you customers',
    excerpt: 'Small design problems that make visitors leave, and the simple fixes that bring them back.',
    img: ['px-1779487.webp', 'A designer desk with a monitor lit in pink'],
    cats: ['design'],
    author: 'gemsoft-team',
    age: 38,
    tags: ['UX', 'conversion', 'design'],
    keyword: 'UX mistakes',
    content: doc(
      p('Most visitors do not complain. They just leave. These five problems are the ones we fix most often.'),
      ol(['**Unclear first screen.** Say what you do and who it is for in one line.', '**Too many choices.** One main action per page.', '**Long forms.** Ask only for what you need now.', '**Slow pages on mobile.** Test on a mid-range phone, not your laptop.', '**Hidden contact details.** Make it easy to talk to a person.']),
      block('callout', { tone: 'warning', title: 'Measure before you redesign', text: 'Look at where people drop off in your analytics first. A redesign without data often moves the problem somewhere else.' }),
    ),
  },
  {
    slug: 'gemsoft-new-website-launch',
    title: 'Our new website is live',
    excerpt: 'A faster site, a new look in our orange brand colours, and a home for our insights and open roles.',
    img: ['px-3184338.webp', 'The GEMSOFT team in a meeting'],
    cats: ['company-news'],
    author: 'gemsoft-team',
    age: 1,
    tags: ['news', 'GEMSOFT'],
    keyword: 'GEMSOFT Technologies',
    content: doc(
      p('We rebuilt our website from the ground up. It is faster, easier to read on a phone, and shows more of the work we do for our clients.'),
      h('h2', 'What is new'),
      ul(['A new look in our orange brand colours.', '**Insights**: guides and case studies from our team, updated regularly.', '**Careers**: our open roles, and how we hire.']),
      p('Have a look around, and tell us what you think.'),
    ),
  },
]

const created: Record<string, number> = {}
for (const s of POSTS) {
  const existing = await findOne('posts', 'slug', s.slug)
  if (existing) {
    created[s.slug] = existing.id
    continue
  }
  const heroImage = await media(...(s.img as [string, string]))
  const d = await payload.create({
    collection: 'posts',
    context: ctx,
    data: {
      title: s.title,
      slug: s.slug,
      excerpt: s.excerpt,
      heroImage,
      content: s.content as never,
      categories: s.cats.map((c) => cat[c]),
      authors: [author[s.author]],
      tags: s.tags,
      faq: s.faq,
      featured: !!s.featured,
      publishedAt: day(s.age),
      meta: { focusKeyword: s.keyword },
      _status: 'published',
    },
  })
  created[s.slug] = d.id
}
console.log(`insights: ${Object.keys(created).length}`)

// ---------- jobs ----------
const JOBS = [
  {
    slug: 'senior-nextjs-developer',
    title: 'Senior Next.js Developer',
    department: 'engineering',
    workplace: 'hybrid',
    experience: '4+ years',
    summary: 'Lead the build of fast, search-friendly websites and web apps in Next.js and TypeScript for clients across Pakistan, the Gulf and the UK.',
    about: 'You will lead front-end work on our biggest web projects, from architecture to launch. You will work directly with designers and clients, review code, and help the team ship faster.',
    responsibilities: ['Build websites and web apps with Next.js, React and TypeScript', 'Turn Figma designs into fast, accessible pages', 'Set up CMS integrations, caching and SEO foundations', 'Review pull requests and mentor other developers'],
    requirements: ['4+ years building production React apps', 'Strong TypeScript and modern CSS', 'Experience with a headless CMS', 'Clear written English for client updates'],
    niceToHave: ['GSAP or other animation libraries', 'Postgres and Node.js on the server', 'Experience with Core Web Vitals work'],
  },
  {
    slug: 'flutter-developer',
    title: 'Flutter Developer',
    department: 'engineering',
    workplace: 'onsite',
    experience: '2+ years',
    summary: 'Build and ship cross-platform mobile apps in Flutter, from first screen to the App Store and Google Play.',
    about: 'You will join our mobile team to build booking, delivery and e-commerce apps used by thousands of people every day.',
    responsibilities: ['Build features in Flutter and Dart', 'Connect apps to REST and GraphQL APIs', 'Release builds to TestFlight and Play Console', 'Fix bugs reported from crash analytics'],
    requirements: ['2+ years of Flutter in production', 'State management with Riverpod or Bloc', 'At least one app published in a store'],
    niceToHave: ['Native iOS or Android experience', 'Firebase and push notifications'],
  },
  {
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    department: 'design',
    workplace: 'hybrid',
    experience: '3+ years',
    summary: 'Design websites and apps that people understand the first time, from research and wireframes to polished Figma screens.',
    about: 'You will own the design of client projects end to end, working closely with developers so what ships matches what was designed.',
    responsibilities: ['Run short discovery sessions with clients', 'Create wireframes, prototypes and final UI in Figma', 'Build and maintain design systems', 'Test designs with real users'],
    requirements: ['3+ years designing websites or apps', 'A portfolio with process, not just final screens', 'Strong Figma skills including auto layout and components'],
    niceToHave: ['Motion design', 'Basic HTML and CSS'],
  },
  {
    slug: 'seo-specialist',
    title: 'SEO Specialist',
    department: 'marketing',
    workplace: 'remote',
    experience: '2+ years',
    summary: 'Grow organic traffic for our clients and our own brand with technical SEO, content planning and clear reporting.',
    about: 'You will plan and run SEO for a portfolio of client websites, working with our developers on technical fixes and with writers on content.',
    responsibilities: ['Run technical SEO audits and track fixes', 'Plan content from keyword research', 'Build monthly reports clients understand', 'Monitor rankings, traffic and conversions'],
    requirements: ['2+ years of hands-on SEO', 'Google Search Console, GA4 and a crawler such as Screaming Frog', 'Understanding of structured data and Core Web Vitals'],
    niceToHave: ['Local SEO for Pakistan and the Gulf', 'Experience with link building outreach'],
  },
] as const

let jobs = 0
for (const j of JOBS) {
  if (await findOne('jobs', 'slug', j.slug)) continue
  await payload.create({
    collection: 'jobs',
    context: ctx,
    data: {
      title: j.title,
      slug: j.slug,
      department: j.department,
      employmentType: 'FULL_TIME',
      workplace: j.workplace,
      location: 'Lahore, Pakistan',
      experience: j.experience,
      summary: j.summary,
      about: doc(p(j.about)) as never,
      responsibilities: j.responsibilities.map((item) => ({ item })),
      requirements: j.requirements.map((item) => ({ item })),
      niceToHave: j.niceToHave.map((item) => ({ item })),
      open: true,
      datePosted: day(5),
      _status: 'published',
    },
  })
  jobs++
}
console.log(`jobs created: ${jobs}`)

// ---------- site settings ----------
await payload.updateGlobal({
  slug: 'site-settings',
  context: ctx,
  data: {
    siteName: 'GEMSOFT Technologies',
    tagline: 'Websites, apps and custom software',
    defaultDescription: 'GEMSOFT Technologies builds fast websites, mobile apps, custom software and AI automation for growing businesses.',
    contact: { email: 'hello@gemsoft.example', careersEmail: 'careers@gemsoft.example', city: 'Lahore', country: 'PK' },
  },
})
console.log('done')
process.exit(0)
