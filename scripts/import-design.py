"""Imports the approved HTML design (gemsoft/design/v2) into the Next.js app.

For every design page it writes, under src/design/:
  pages/<key>.html   the body markup (nav, menus, page sections, footer), links and media paths made site-absolute
  pages/<key>.css    the page's own styles (the shared shell styles go to shell.css once)
  pages/<key>.js     the page's motion code, wrapped as `export default function run()`
  pages/<key>.3d.js  the page's three.js module, if it has one
and copies media/ and brand/ into public/.

Run again whenever the design changes:  python3 scripts/import-design.py [path/to/design/v2]"""
import os, re, shutil, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('DESIGN_DIR', '/mnt/project-files/gemsoft/design/v2')
OUT = os.path.join(ROOT, 'src', 'design')
PUB = os.path.join(ROOT, 'public')
R = lambda p: open(p, encoding='utf-8').read()

PAGES = {'index.html': 'home', 'about.html': 'about', 'services.html': 'services', 'work.html': 'work', 'contact.html': 'contact'}
for f in sorted(os.listdir(SRC)):
    if f.startswith('service-') and f.endswith('.html'):
        PAGES[f] = 'service-' + f[len('service-'):-5]

ROUTE = {'index': '/', 'about': '/about', 'services': '/services', 'work': '/work', 'contact': '/contact'}
SPECIAL = {'index.html#insights': '/insights', 'index.html#careers': '/careers', '#insights': '/insights', '#careers': '/careers'}

def route(m):
    name, hash_ = m.group(2), m.group(3) or ''
    key = f'{name}.html{hash_}'
    if key in SPECIAL:
        return f'{m.group(1)}{SPECIAL[key]}{m.group(4)}'
    if name.startswith('service-'):
        path = '/services/' + name[len('service-'):]
    else:
        path = ROUTE.get(name)
    if path is None:
        return m.group(0)
    if hash_ and path == '/':
        return f'{m.group(1)}/{hash_}{m.group(4)}'
    return f'{m.group(1)}{path}{hash_}{m.group(4)}'

def fix_paths(s):
    s = re.sub(r'''(["'(=\s])(media|brand)/''', r'\1/\2/', s)
    s = re.sub(r'''(href=["'])([a-z0-9-]+)\.html(#[A-Za-z0-9_-]*)?(["'])''', route, s)
    s = re.sub(r'''(location\.href\s*=\s*["'])([a-z0-9-]+)\.html(#[A-Za-z0-9_-]*)?(["'])''', route, s)
    # home sections that became their own pages
    s = s.replace('href="#insights"', 'href="/insights"').replace('href="#careers"', 'href="/careers"')
    return s

os.makedirs(os.path.join(OUT, 'pages'), exist_ok=True)
about_css = re.search(r'<style[^>]*>(.*?)</style>', R(os.path.join(SRC, 'about.html')), re.S).group(1)
cut = about_css.index('/* ===== ABOUT PAGE')
shell_css = about_css[:cut]
open(os.path.join(OUT, 'shell.css'), 'w').write(fix_paths(shell_css))


def live_contact(markup, js, css):
    """The design's contact form only pretends to send; on the live site it posts to /api/inquiry."""
    note = re.search(r'<p class="c-proto">.*?</p>', markup, re.S)
    assert note, 'contact form note not found'
    markup = markup.replace(note.group(0), '<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
                            '<p class="c-proto c-form-err" role="alert" hidden></p>')
    a = js.index("    setTimeout(()=>{   // prototype")
    b = js.index("},900)});", a) + len("},900)});")
    body = js[js.index('\n', a) + 1:js.index("},900)});", a)]
    js = js[:a] + ("    const fail=t=>{b.disabled=false;b.classList.remove('busy');const e=$('.c-form-err',cForm);e.textContent=t;e.hidden=false};\n"
                   "    $('.c-form-err',cForm).hidden=true;\n"
                   "    fetch('/api/inquiry',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...Object.fromEntries(new FormData(cForm)),page:location.pathname})})\n"
                   "      .then(r=>r.json().catch(()=>({})).then(j=>{if(!r.ok)throw new Error(j.error||'')}))\n"
                   "      .then(()=>{\n" + body + "})\n"
                   "      .catch(err=>fail(err.message||'Sorry, that did not go through. Please try again, or email us directly.'))});") + js[b:]
    css += '\n.hp{position:absolute!important;left:-9999px;width:1px;height:1px;opacity:0}\n.c-form-err{color:#ff8a7d}\n'
    return markup, js, css

manifest = {}
for f, key in PAGES.items():
    s = R(os.path.join(SRC, f))
    title = re.search(r'<title>(.*?)</title>', s, re.S).group(1)
    css = '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', s, re.S))
    if css.startswith(shell_css):
        css = css[len(shell_css):]          # page part only; shell.css is loaded on every page
    body_start = s.rindex('</style>') + len('</style>')
    first_script = s.index('<script', body_start)
    markup = s[body_start:first_script].strip()
    scripts = re.findall(r'<script([^>]*)>(.*?)</script>', s[first_script:], re.S)
    classic, module, needs_map = [], None, False
    for attrs, code in scripts:
        if 'src=' in attrs:
            needs_map |= 'media/map.js' in attrs
            continue
        if 'importmap' in attrs:
            continue
        if 'module' in attrs:
            module = code
        else:
            classic.append(code)
    js = '/* eslint-disable */\n// Imported from the design page ' + f + ' by scripts/import-design.py. Edit the design and re-import.\nexport default function run() {\n' + '\n'.join(classic) + '\n}\n'
    markup = re.sub(r'<div class="proto" id="proto".*?</div>\s*', '', markup, flags=re.S)   # the "design prototype" note is not part of the live site
    if key == 'contact':
        markup, js, css = live_contact(markup, js, css)
        css = css.replace('html.cp', 'html:has(#cHero)')   # the design marks the contact page with a class on <html>; here the page itself is the marker
    open(os.path.join(OUT, 'pages', key + '.html'), 'w').write(fix_paths(markup))
    open(os.path.join(OUT, 'pages', key + '.css'), 'w').write(fix_paths(css))
    open(os.path.join(OUT, 'pages', key + '.js'), 'w').write(fix_paths(js))
    if module:
        open(os.path.join(OUT, 'pages', key + '.3d.js'), 'w').write('/* eslint-disable */\n' + fix_paths(module))
    manifest[key] = {'title': title, 'three': bool(module), 'map': needs_map}
open(os.path.join(OUT, 'manifest.json'), 'w').write(json.dumps(manifest, indent=2))

for d in ('media', 'brand'):
    dst = os.path.join(PUB, d)
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(os.path.join(SRC, d), dst, ignore=shutil.ignore_patterns('gem'))   # gem/: single frames, the site uses the gem-s sheets
print(json.dumps(manifest, indent=1))
