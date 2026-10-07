import fs from 'fs/promises'
import path from 'path'
import ShellMotion from './ShellMotion'

const read = (f: string) => fs.readFile(path.join(process.cwd(), 'src', 'design', f), 'utf8')

/** Nav, menus and footer from the design, around a CMS page (Insights, Careers). */
export default async function Shell({ children }: { children: React.ReactNode }) {
  const [top, foot] = await Promise.all([read('shell-top.html'), read('shell-foot.html')])
  return (
    <>
      <div className="design-root" dangerouslySetInnerHTML={{ __html: top }} />
      <main className="main cms" id="top">
        {children}
      </main>
      <div className="design-root" dangerouslySetInnerHTML={{ __html: foot }} />
      <ShellMotion />
    </>
  )
}
