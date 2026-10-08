import type { Job } from '@/payload-types'
import { esc, isEmail, isUrl, json, mailTable, str, tooMany } from '@/lib/forms'
import { getSettings, payload } from '@/lib/payload'

// hosts such as Vercel cap request bodies at 4.5 MB
const MAX = 4 * 1024 * 1024
const TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

/** Job application: stores the CV privately, saves the application (Careers > Applications) and emails the team. */
export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null)
  if (!fd) return json({ error: 'Please fill in the form and try again.' }, 400)
  if (str(fd.get('website'))) return json({ ok: true })
  if (tooMany(req, 4)) return json({ error: 'Too many applications from your connection. Please try again later.' }, 429)

  const data = {
    name: str(fd.get('name'), 120),
    email: str(fd.get('email'), 160),
    phone: str(fd.get('phone'), 40),
    linkedin: str(fd.get('linkedin'), 300),
    portfolio: str(fd.get('portfolio'), 300),
    message: str(fd.get('message'), 3000),
  }
  const jobId = Number(fd.get('job'))
  const file = fd.get('resume')
  if (data.name.length < 2 || !isEmail(data.email) || !isUrl(data.linkedin) || !isUrl(data.portfolio)) return json({ error: 'Please check your details and try again.' }, 422)
  if (!(file instanceof File) || !file.size) return json({ error: 'Please attach your CV.' }, 422)
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!TYPES[ext] || file.size > MAX) return json({ error: 'Your CV must be a PDF or Word file up to 4 MB.' }, 422)

  const p = await payload()
  const job = (await p.findByID({ collection: 'jobs', id: jobId, depth: 0 }).catch(() => null)) as Job | null
  if (!job || job._status !== 'published' || !job.open) return json({ error: 'This role is no longer open.' }, 410)

  const safe = `${data.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40)}-${Date.now()}.${ext}`
  const buf = Buffer.from(await file.arrayBuffer())
  const resume = await p
    .create({ collection: 'resumes', data: {}, file: { data: buf, mimetype: TYPES[ext], name: safe, size: buf.length }, overrideAccess: true })
    .catch(() => null)
  if (!resume) return json({ error: 'We could not read your CV. Please save it again as a PDF and retry.' }, 422)
  const app = await p.create({ collection: 'applications', data: { ...data, job: job.id, resume: resume.id }, overrideAccess: true })

  const settings = await getSettings().catch(() => null)
  const to = settings?.notify?.applications || settings?.contact?.careersEmail || settings?.contact?.email
  if (to) {
    await p
      .sendEmail({
        to,
        replyTo: data.email,
        subject: `Application: ${job.title} from ${data.name}`,
        html:
          mailTable(`New application for ${job.title}`, [
            ['Name', data.name],
            ['Email', data.email],
            ['Phone', data.phone],
            ['LinkedIn', data.linkedin],
            ['Portfolio', data.portfolio],
            ['Message', data.message],
          ]) + `<p style="font-family:Arial,sans-serif;font-size:13px"><a href="${esc(new URL(`/admin/collections/applications/${app.id}`, req.url).toString())}">Open the application and CV in the CMS</a></p>`,
        attachments: [{ filename: safe, content: buf }],
      })
      .catch((e: unknown) => p.logger.error({ err: e }, 'application email failed'))
  }
  return json({ ok: true })
}
