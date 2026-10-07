import { esc, isEmail, json, mailTable, str, tooMany } from '@/lib/forms'
import { getSettings, payload } from '@/lib/payload'

/** Contact form: saves the inquiry in the CMS (Forms > Inquiries) and emails the team. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return json({ error: 'Please fill in the form and try again.' }, 400)
  // bots fill the hidden "website" field; pretend it worked
  if (str(body.website)) return json({ ok: true })
  if (tooMany(req)) return json({ error: 'Too many messages from your connection. Please try again later, or email us directly.' }, 429)

  const data = {
    name: str(body.name, 120),
    email: str(body.email, 160),
    company: str(body.company, 160),
    service: str(body.service, 120),
    budget: str(body.budget, 80),
    details: str(body.details, 5000),
    page: str(body.page, 200),
  }
  if (data.name.length < 2 || !isEmail(data.email) || !data.service || !data.budget || data.details.length < 10)
    return json({ error: 'Please check the highlighted fields and try again.' }, 422)

  const p = await payload()
  const doc = await p.create({ collection: 'inquiries', data, overrideAccess: true })
  const settings = await getSettings().catch(() => null)
  const to = settings?.notify?.inquiries || settings?.contact?.email
  if (to) {
    await p
      .sendEmail({
        to,
        replyTo: data.email,
        subject: `New inquiry from ${data.name}${data.company ? ` (${data.company})` : ''}`,
        html:
          mailTable('New project inquiry', [
            ['Name', data.name],
            ['Email', data.email],
            ['Company', data.company],
            ['Service', data.service],
            ['Budget', data.budget],
            ['Details', data.details],
            ['Sent from', data.page],
          ]) + `<p style="font-family:Arial,sans-serif;font-size:13px"><a href="${esc(new URL(`/admin/collections/inquiries/${doc.id}`, req.url).toString())}">Open in the CMS</a></p>`,
      })
      .catch((e: unknown) => p.logger.error({ err: e }, 'inquiry email failed'))
  }
  return json({ ok: true })
}
