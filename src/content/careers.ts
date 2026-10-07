/** Fixed copy on the Careers page. Open roles come from the CMS (Careers > Jobs). */

export const DEPARTMENTS: Record<string, string> = {
  engineering: 'Engineering',
  design: 'Design',
  marketing: 'Marketing',
  'project-management': 'Project management',
  'quality-assurance': 'Quality assurance',
  operations: 'Operations',
}

export const EMPLOYMENT: Record<string, string> = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACTOR: 'Contract', INTERN: 'Internship' }
export const WORKPLACE: Record<string, string> = { onsite: 'On-site', hybrid: 'Hybrid', remote: 'Remote' }

export const STATEMENT =
  'We are a small team that ships real software for real businesses. Everyone talks to clients, everyone owns their work, and nobody hides behind process. If you like learning fast and seeing your work go live, you will fit right in.'

export const PERKS: { title: string; text: string; icon: string }[] = [
  { title: 'Learning budget', text: 'Courses, books and conference tickets, paid for every year.', icon: 'M4 6.5 12 3l8 3.5-8 3.5L4 6.5Zm3 2.2V14c0 1.7 2.2 3 5 3s5-1.3 5-3V8.7M20 6.5V12' },
  { title: 'Health cover', text: 'Medical insurance for you and your family from your first month.', icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Zm-3-9h2V9h2v2h2v2h-2v2h-2v-2H9v-2Z' },
  { title: 'Flexible hours', text: 'Core hours for meetings, the rest of the day is yours to plan.', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2' },
  { title: 'Real ownership', text: 'You lead features from the first call to launch, not just tickets.', icon: 'M5 20V5m0 0h11l-2 3.5L16 12H5' },
  { title: 'Good kit', text: 'A fast laptop, a second screen and the tools you ask for.', icon: 'M4 5h16v10H4zM2 19h20M9 15v4m6-4v4' },
  { title: 'Team time', text: 'Monthly dinners, a yearly trip and Friday demos with snacks.', icon: 'M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3 2.2-5 5-5s5 2 5 5m0 0c0-3 2.2-5 5-5s5 2 5 5' },
]

export const LIFE: { src: string; alt: string }[] = [
  { src: '/img/careers/team-meeting.webp', alt: 'The team talking through a project around a table' },
  { src: '/img/careers/code-review.webp', alt: 'Two developers reviewing code on a laptop' },
  { src: '/img/careers/team-desk.webp', alt: 'A designer smiling at her desk' },
  { src: '/img/careers/pairing.webp', alt: 'Developers working side by side, seen from above' },
  { src: '/img/careers/focus.webp', alt: 'A developer focused on her screens' },
  { src: '/img/careers/team-review.webp', alt: 'A team reviewing work together' },
  { src: '/img/careers/laptop.webp', alt: 'A developer working on a laptop' },
  { src: '/img/careers/dev-desk.webp', alt: 'An engineer at a desk with two monitors' },
]

export const STEPS: { title: string; text: string }[] = [
  { title: 'Apply', text: 'Send your CV and a few lines about you. A person reads every application.' },
  { title: 'Intro call', text: 'A 30 minute chat about you, the role and how we work. Ask us anything.' },
  { title: 'Skills task', text: 'A short, paid task or a talk through your past work. No trick questions.' },
  { title: 'Offer', text: 'Meet the team, get an answer within a week, and plan your first day.' },
]

export const FAQ: { question: string; answer: string }[] = [
  { question: 'Do you hire people without a degree?', answer: 'Yes. We look at what you have built and how you think, not where you studied.' },
  { question: 'Can I work remotely?', answer: 'Some roles are remote or hybrid, and each role says so. Most of the team works from our Lahore office a few days a week.' },
  { question: 'How long does hiring take?', answer: 'Usually two to three weeks from your application to an offer. We tell you where you stand after every step.' },
  { question: 'Do you offer internships?', answer: 'Yes, a few times a year. Internship roles are listed here when they open, and interns are paid.' },
  { question: "I don't see a role for me. Can I still apply?", answer: 'Yes. Send a general application with your CV and we will contact you when something fits.' },
]
