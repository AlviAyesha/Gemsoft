import { doc, h, p, ul } from '@/lib/lexical'

/**
 * Privacy, Terms and Cookies. These show whenever the CMS has no published page with the same slug,
 * so the footer links always work; a page made in the CMS (Pages) replaces the text below.
 * EMAIL is swapped for the email saved under Settings > Site settings when the page is shown.
 */
export const EMAIL = 'hello@gemsoft.example'
export const LEGAL_UPDATED = '2026-10-13T00:00:00.000Z'

export const LEGAL: Record<string, { title: string; intro: string; content: ReturnType<typeof doc> }> = {
  privacy: {
    title: 'Privacy policy',
    intro: 'What we collect when you use this website, why we collect it, and the choices you have.',
    content: doc(
      p('This policy explains how GEMSOFT Technologies (“GEMSOFT”, “we”, “us”) handles personal information collected through this website. It does not cover the software we build for clients; each project has its own written agreement.'),
      h('h2', 'Who we are'),
      p(`GEMSOFT Technologies is a software company based in Lahore, Pakistan. For anything about your information, email ${EMAIL}.`),
      h('h2', 'What we collect'),
      ul([
        '**When you contact us:** your name, email address, company, the service you are interested in, your budget range and your message.',
        '**When you apply for a job:** your name, email address, phone number, any links you share (such as a portfolio or LinkedIn profile), your message and your CV.',
        '**When you accept analytics cookies:** information about the pages you visit, how you reached the site, and your device and browser type. IP addresses are anonymised.',
        '**Server logs:** our hosting provider records technical information such as IP address, browser and the time of each request, to keep the site secure and working.',
      ]),
      p('We do not ask for sensitive information such as health or financial details. Please do not include it in a message or CV.'),
      h('h2', 'Why we use it'),
      ul([
        'To reply to your enquiry, prepare proposals and work with you if you become a client.',
        'To assess job applications and contact candidates.',
        'To understand which pages are useful and improve the website.',
        'To protect the website against spam, abuse and security threats.',
        'To meet legal and accounting requirements.',
      ]),
      p('We do not sell your information, and we do not use it for advertising or share it with advertisers.'),
      h('h2', 'Who we share it with'),
      p('We share information only with service providers that help us run this website and our business, such as our hosting, database, file storage, email and analytics providers, and only as much as they need to provide their service. We may also share information when the law requires it.'),
      p('Some of these providers store data on servers outside Pakistan. We choose providers that protect personal information with appropriate security measures.'),
      h('h2', 'How long we keep it'),
      ul([
        'Enquiries: up to two years after our last contact, unless you become a client.',
        'Job applications: up to one year, so we can consider you for future roles. Ask us and we will delete your application sooner.',
        'Analytics data: up to 14 months.',
      ]),
      h('h2', 'How we protect it'),
      p('The website is served over HTTPS, access to the content editor is limited to our team and protected by passwords, and we keep our software up to date. No method of sending or storing data is completely secure, but we work to protect your information.'),
      h('h2', 'Your rights'),
      p(`You can ask us to show you the information we hold about you, correct it, delete it, or stop using it for a particular purpose. You can also withdraw your consent to analytics cookies at any time (see our Cookie policy). To make a request, email ${EMAIL}. We reply within 30 days.`),
      h('h2', 'Children'),
      p('This website is meant for businesses and job seekers. We do not knowingly collect information from children under 16.'),
      h('h2', 'Changes to this policy'),
      p('We may update this policy when our website or the law changes. The date at the top of this page shows when it last changed.'),
    ),
  },
  terms: {
    title: 'Terms of use',
    intro: 'The rules for using this website. Please read them before you use the site.',
    content: doc(
      p('These terms apply to your use of this website, run by GEMSOFT Technologies (“GEMSOFT”, “we”, “us”). By using the website you agree to them. If you do not agree, please do not use the site.'),
      h('h2', 'Our services'),
      p('This website describes our services and work. It is not an offer to provide services. Any project is governed by a separate written agreement or proposal, and those terms apply to the project instead of these.'),
      h('h2', 'Information on this site'),
      p('We work to keep the information on this website accurate and up to date, but it is provided for general information only. Prices, timelines, results and examples are indicative and may change. Case studies marked as samples illustrate the kind of work we do.'),
      h('h2', 'Intellectual property'),
      p('The text, images, logos, videos, designs and code on this website belong to GEMSOFT Technologies or are used with permission. You may view the site and share links to its pages. You may not copy, reproduce or reuse its content for commercial purposes without our written permission.'),
      h('h2', 'What you send us'),
      p('When you send us a message or a job application, you confirm that the information is accurate and that you are allowed to share it. We handle it as described in our Privacy policy.'),
      h('h2', 'Acceptable use'),
      ul([
        'Do not use the website for anything unlawful or fraudulent.',
        'Do not try to gain unauthorised access to the website, its servers or the content editor.',
        'Do not send spam, malware or automated requests that put load on the site.',
        'Do not copy the website’s content with automated tools.',
      ]),
      h('h2', 'Links to other websites'),
      p('The website may link to other websites. We do not control them and are not responsible for their content or how they handle your information.'),
      h('h2', 'Limitation of liability'),
      p('The website is provided “as is”. We do not guarantee that it will always be available or free of errors. To the extent the law allows, we are not liable for any loss arising from your use of the website or from relying on its content.'),
      h('h2', 'Governing law'),
      p('These terms are governed by the laws of Pakistan, and the courts of Lahore have jurisdiction over any dispute about them.'),
      h('h2', 'Changes to these terms'),
      p('We may update these terms from time to time. The date at the top of this page shows when they last changed. Using the website after a change means you accept the updated terms.'),
      h('h2', 'Contact'),
      p(`Questions about these terms can be sent to ${EMAIL}.`),
    ),
  },
  cookies: {
    title: 'Cookie policy',
    intro: 'Which cookies this website uses, why, and how to control them.',
    content: doc(
      p('Cookies are small files a website saves in your browser. Similar technologies, such as your browser’s local storage, work in the same way. This policy explains what this website uses.'),
      h('h2', 'Needed for the site to work'),
      ul([
        '**gs-consent** (local storage): remembers whether you accepted or declined analytics, so we do not ask again on every page. Kept until you clear your browser data.',
        '**payload-token** (cookie): only set for our team when they sign in to the content editor. It keeps them signed in.',
      ]),
      p('These do not track you and cannot be switched off, because the site needs them.'),
      h('h2', 'Analytics cookies'),
      p('If you click “Accept” on the cookie notice, we use Google Analytics to count visits and see which pages are popular. IP addresses are anonymised, and we do not use analytics for advertising.'),
      ul([
        '**_ga**: tells visits apart. Kept for up to 2 years.',
        '**_ga_[id]**: keeps the state of your current visit. Kept for up to 2 years.',
      ]),
      p('If you click “Decline”, or do not answer the notice, no analytics cookies are set and Google Analytics is not loaded.'),
      h('h2', 'Changing your choice'),
      p('To change your choice, clear this site’s data in your browser settings and reload the page. The cookie notice will appear again. You can also block cookies in your browser settings; the website still works without them.'),
      h('h2', 'Contact'),
      p(`Questions about cookies can be sent to ${EMAIL}.`),
    ),
  },
}
