import { NextResponse, type NextRequest } from 'next/server'

/**
 * Staging lock: when STAGING_PASSWORD is set, every page asks for a username and password
 * (any username, that password) and tells search engines not to index anything.
 * Leave it empty in production.
 */
export function proxy(req: NextRequest) {
  const pass = process.env.STAGING_PASSWORD
  if (!pass) return NextResponse.next()
  const auth = req.headers.get('authorization') || ''
  const [scheme, value] = auth.split(' ')
  if (scheme === 'Basic' && value) {
    const decoded = atob(value)
    if (decoded.slice(decoded.indexOf(':') + 1) === pass) {
      const res = NextResponse.next()
      res.headers.set('X-Robots-Tag', 'noindex, nofollow')
      return res
    }
  }
  return new NextResponse('Staging site. Ask the GEMSOFT team for the password.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="GEMSOFT staging", charset="UTF-8"', 'X-Robots-Tag': 'noindex, nofollow' },
  })
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
