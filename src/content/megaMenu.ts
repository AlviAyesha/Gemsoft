// Preview shown in the services mega menu for each service, taken from the design's services data (v2-services-src/services.json).
export type MegaService = { href: string; title: string; lead: string; headline: string; text: string; image: string; offers: string[] }

export const MEGA_SERVICES: MegaService[] = [
  {
    "href": "/services/web-development",
    "title": "Web development",
    "lead": "Websites that load fast",
    "headline": "and bring in leads",
    "text": "Marketing websites, landing pages and web apps built on Next.js, designed for speed, accessibility and search from day one.",
    "image": "/media/services/web.webp",
    "offers": [
      "Marketing websites",
      "Landing pages",
      "Web apps",
      "CMS and content"
    ]
  },
  {
    "href": "/services/e-commerce",
    "title": "E-commerce",
    "lead": "Online stores",
    "headline": "built to sell every day",
    "text": "Shopify and custom storefronts with fast product pages, simple checkout and payment gateways that work in your market.",
    "image": "/media/services/ecommerce.webp",
    "offers": [
      "Shopify stores",
      "Custom storefronts",
      "Checkout and payments",
      "Integrations"
    ]
  },
  {
    "href": "/services/mobile-apps",
    "title": "Mobile apps",
    "lead": "Mobile apps",
    "headline": "your customers keep using",
    "text": "Flutter and React Native apps designed for real users, tested on real devices and shipped to both app stores.",
    "image": "/media/services/mobile.webp",
    "offers": [
      "Cross-platform apps",
      "App design",
      "Backend and APIs",
      "Store launch"
    ]
  },
  {
    "href": "/services/custom-software",
    "title": "Custom software",
    "lead": "Custom software",
    "headline": "that fits how you work",
    "text": "Dashboards, portals, booking systems and internal tools built around the way your team already works.",
    "image": "/media/services/software.webp",
    "offers": [
      "Dashboards and reports",
      "Customer and partner portals",
      "Booking and operations",
      "Integrations"
    ]
  },
  {
    "href": "/services/ui-ux-design",
    "title": "UI/UX design",
    "lead": "Design that",
    "headline": "users understand first time",
    "text": "Research, user flows, wireframes and high-fidelity interfaces in Figma, with a design system your developers can reuse.",
    "image": "/media/services/uiux.webp",
    "offers": [
      "Research",
      "Flows and wireframes",
      "Interface design",
      "Design systems"
    ]
  },
  {
    "href": "/services/ai-automation",
    "title": "AI & automation",
    "lead": "AI and automation",
    "headline": "that saves real hours",
    "text": "Chat assistants, document processing and workflow automations that save your team hours every week.",
    "image": "/media/services/ai.webp",
    "offers": [
      "Chat assistants",
      "Document processing",
      "Workflow automation",
      "Data insights"
    ]
  },
  {
    "href": "/services/seo-growth",
    "title": "SEO & growth",
    "lead": "SEO that brings",
    "headline": "the right visitors",
    "text": "Technical SEO, site speed, content planning and local search, measured against leads and sales rather than rankings alone.",
    "image": "/media/services/seo.webp",
    "offers": [
      "Technical SEO",
      "Content planning",
      "Local SEO",
      "Tracking and reporting"
    ]
  },
  {
    "href": "/services/cloud-devops",
    "title": "Cloud & DevOps",
    "lead": "Cloud hosting",
    "headline": "that stays fast and stays up",
    "text": "Cloud setup on AWS, Google Cloud or Vercel with automated deployments, backups and monitoring.",
    "image": "/media/services/cloud.webp",
    "offers": [
      "Cloud setup",
      "Automated deployments",
      "Monitoring",
      "Security and backups"
    ]
  },
  {
    "href": "/services/maintenance-support",
    "title": "Maintenance & support",
    "lead": "Support after launch",
    "headline": "from the team that built it",
    "text": "Security updates, bug fixes, uptime monitoring and a set number of hours each month for new features.",
    "image": "/media/services/support.webp",
    "offers": [
      "Security updates",
      "Bug fixes",
      "Uptime monitoring",
      "Feature hours"
    ]
  },
  {
    "href": "/services/digital-marketing",
    "title": "Digital marketing",
    "lead": "Marketing that",
    "headline": "pays for itself",
    "text": "Google and Meta ads, email campaigns and conversion tracking, planned around your sales goals.",
    "image": "/media/services/marketing.webp",
    "offers": [
      "Google ads",
      "Meta ads",
      "Email marketing",
      "Conversion tracking"
    ]
  }
]
