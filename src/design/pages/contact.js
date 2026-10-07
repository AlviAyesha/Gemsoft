/* eslint-disable */
// Imported from the design page contact.html by scripts/import-design.py. Edit the design and re-import.
export default function run() {

(function(){
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=document.documentElement.classList.contains('rm');
  const mobile=matchMedia('(max-width:820px)').matches;

  // ---------- menus ----------
  const menu=$('#mobileMenu'),mBtn=$('#menuBtn'),mClose=$('#menuClose');
  const setMenu=v=>{menu.classList.toggle('open',v);mBtn.setAttribute('aria-expanded',v);document.body.style.overflow=v?'hidden':'';(v?mClose:mBtn).focus()};
  mBtn.addEventListener('click',()=>setMenu(true));mClose.addEventListener('click',()=>setMenu(false));
  $$('a',menu).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  const megaBtn=$('#megaBtn'),mega=$('#mega');
  megaBtn.addEventListener('click',()=>{const o=!mega.classList.contains('open');mega.classList.toggle('open',o);megaBtn.setAttribute('aria-expanded',o)});
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(menu.classList.contains('open'))setMenu(false);if(mega.classList.contains('open')){mega.classList.remove('open');megaBtn.setAttribute('aria-expanded',false);megaBtn.focus()}
    $$('.mate.open').forEach(m=>{m.classList.remove('open');$('.more',m).focus()})});

  const pad=n=>String(n).padStart(2,'0');

  // ---------- contact form: custom dropdowns, checks, thank-you state (works with or without motion) ----------
  const cForm=$('#cFormEl'),cDone=$('#cDone');
  const sels=$$('.c-sel',cForm);
  const closeSel=(s,focus)=>{s.classList.remove('open');$('.c-sel-btn',s).setAttribute('aria-expanded','false');if(focus)$('.c-sel-btn',s).focus()};
  const pick=(s,li)=>{const v=li.dataset.v;$$('[role=option]',s).forEach(o=>o.setAttribute('aria-selected',o===li?'true':'false'));
    $('.c-sel-val',s).textContent=v;$('input',s).value=v;s.classList.add('has');s.classList.remove('bad');$('.c-err',s).textContent='';closeSel(s,true)};
  sels.forEach(s=>{
    const btn=$('.c-sel-btn',s),list=$('.c-sel-list',s),opts=$$('[role=option]',s);let at=-1;
    const mark=i=>{at=(i+opts.length)%opts.length;opts.forEach((o,k)=>o.classList.toggle('at',k===at));list.setAttribute('aria-activedescendant',opts[at].id);opts[at].scrollIntoView({block:'nearest'})};
    const open=()=>{sels.forEach(o=>o!==s&&closeSel(o));s.classList.add('open');btn.setAttribute('aria-expanded','true');list.focus();mark(Math.max(0,opts.findIndex(o=>o.getAttribute('aria-selected')==='true')))};
    btn.addEventListener('click',()=>s.classList.contains('open')?closeSel(s,true):open());
    btn.addEventListener('keydown',ev=>{if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();open()}});
    list.addEventListener('keydown',ev=>{
      if(ev.key==='ArrowDown'){ev.preventDefault();mark(at+1)}else if(ev.key==='ArrowUp'){ev.preventDefault();mark(at-1)}
      else if(ev.key==='Home'){ev.preventDefault();mark(0)}else if(ev.key==='End'){ev.preventDefault();mark(opts.length-1)}
      else if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();pick(s,opts[at])}
      else if(ev.key==='Escape'||ev.key==='Tab'){ev.stopPropagation();closeSel(s,ev.key==='Escape')}});
    opts.forEach((o,k)=>{o.addEventListener('click',()=>pick(s,o));o.addEventListener('mousemove',()=>at!==k&&mark(k))});
  });
  document.addEventListener('click',ev=>sels.forEach(s=>!s.contains(ev.target)&&closeSel(s)));

  const MSG={name:'Please tell us your name.',email:'Please enter a valid email address.',service:'Please choose a service.',details:'A line or two about the project helps us reply properly.',budget:'Please choose a budget range.'};
  const check=el=>{const f=el.closest('.c-field'),v=el.value.trim();let bad=el.required&&!v;
    if(!bad&&el.name==='email')bad=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if(!bad&&el.name==='details')bad=v.length<10;
    f.classList.toggle('bad',bad);$('.c-err',f).textContent=bad?MSG[el.name]:'';if(el.type!=='hidden')el.setAttribute('aria-invalid',bad);return !bad};
  $$('input:not([type=hidden]),textarea',cForm).forEach(el=>{el.addEventListener('blur',()=>{if(el.value.trim()||el.closest('.c-field').classList.contains('bad'))check(el)});
    el.addEventListener('input',()=>{el.closest('.c-field').classList.contains('bad')&&check(el)})});
  cForm.addEventListener('submit',ev=>{ev.preventDefault();
    const els=$$('input[name],textarea',cForm).filter(el=>el.required);const ok=els.map(check);
    const first=els[ok.indexOf(false)];
    if(first){(first.type==='hidden'?$('.c-sel-btn',first.closest('.c-sel')):first).focus();return}
    const b=$('.c-submit',cForm);b.disabled=true;b.classList.add('busy');
    const fail=t=>{b.disabled=false;b.classList.remove('busy');const e=$('.c-form-err',cForm);e.textContent=t;e.hidden=false};
    $('.c-form-err',cForm).hidden=true;
    fetch('/next/inquiry',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...Object.fromEntries(new FormData(cForm)),page:location.pathname})})
      .then(r=>r.json().catch(()=>({})).then(j=>{if(!r.ok)throw new Error(j.error||'')}))
      .then(()=>{
      $('#cDoneName').textContent=$('[name=name]',cForm).value.trim().split(/\s+/)[0];
      cForm.hidden=true;cDone.hidden=false;cDone.focus();b.disabled=false;b.classList.remove('busy');
      window.gsap&&!reduce&&gsap.from(cDone.children,{autoAlpha:0,y:24,stagger:.08,duration:.7,ease:'power3.out'});
      window.ScrollTrigger&&ScrollTrigger.refresh()})
      .catch(err=>fail(err.message||'Sorry, that did not go through. Please try again, or email us directly.'))});
  $('#cAgain').addEventListener('click',()=>{cForm.reset();sels.forEach(s=>{$('.c-sel-val',s).textContent=s.dataset.name==='service'?'Select a service':'Select your estimated budget';s.classList.remove('has');$$('[role=option]',s).forEach(o=>o.setAttribute('aria-selected','false'))});
    cDone.hidden=true;cForm.hidden=false;$('[name=name]',cForm).focus();window.ScrollTrigger&&ScrollTrigger.refresh()});

  // ---------- questions: one answer open at a time ----------
  const accItems=$$('.c-acc-item');
  const setAcc=(it,on)=>{const b=$('.c-acc-btn',it),body=$('.c-acc-body',it);if(on===it.classList.contains('open'))return;
    it.classList.toggle('open',on);b.setAttribute('aria-expanded',on);
    if(!window.gsap||reduce){body.hidden=!on;return}
    gsap.killTweensOf(body);
    if(on){body.hidden=false;gsap.fromTo(body,{height:0,opacity:0},{height:'auto',opacity:1,duration:.6,ease:'power3.inOut',onComplete:()=>window.ScrollTrigger&&ScrollTrigger.refresh()})}
    else gsap.to(body,{height:0,opacity:0,duration:.5,ease:'power3.inOut',onComplete:()=>{body.hidden=true;body.style.height='';window.ScrollTrigger&&ScrollTrigger.refresh()}})};
  accItems.forEach(it=>$('.c-acc-btn',it).addEventListener('click',()=>{const on=!it.classList.contains('open');accItems.forEach(o=>o!==it&&setAcc(o,false));setAcc(it,on)}));

  if(reduce||!window.gsap||!window.ScrollTrigger){const w=$('#wipe');w&&w.remove();return}
  gsap.registerPlugin(ScrollTrigger);
  const nav=$('#nav');

  // ---------- Lenis smooth scroll ----------
  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.2});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);window.__lenis=lenis;
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=document.querySelector(id);if(!t)return;e.preventDefault();lenis.scrollTo(t)}))}

  // ---------- nav: solid after hero, hide on scroll down ----------
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll();nav.classList.toggle('solid',y>40);nav.classList.toggle('hide',s.direction===1&&y>160&&!menu.classList.contains('open'))}});

  // ---------- helpers: split text into letters (words stay whole, <br> kept) ----------
  const letters=el=>{const out=[];const walk=n=>[...n.childNodes].forEach(c=>{
      if(c.nodeType===3){const frag=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(' '));return}
        const wd=document.createElement('span');wd.className='wd';[...w].forEach(ch=>{const s=document.createElement('span');s.className='ch';s.textContent=ch;wd.appendChild(s);out.push(s)});frag.appendChild(wd)});c.replaceWith(frag)}
      else if(c.nodeType===1&&c.tagName!=='BR')walk(c)});walk(el);return out};
  const blurIn={autoAlpha:1,filter:'blur(0px)',y:0,ease:'power2.out'};

  // ---------- 1. hero: curtain lifts, the icon drops onto its cable, the title blurs in letter by letter ----------
  const h1c=letters($('.c-h1'));
  gsap.set(h1c,{autoAlpha:0,filter:'blur(12px)'});gsap.set('.c-hero-p,.c-scroll',{autoAlpha:0,y:16});
  const heroIn=()=>{
    gsap.timeline().to('#wipe',{yPercent:-100,duration:1,ease:'power4.inOut',delay:.15}).add(()=>{$('#wipe')&&$('#wipe').remove();dispatchEvent(new Event('cp-intro'))})
      .to(h1c,{...blurIn,duration:.7,stagger:.06},'-=.15')
      .to('.c-hero-p',{autoAlpha:1,y:0,duration:.8,ease:'power3.out'},'-=.3')
      .to('.c-scroll',{autoAlpha:.5,y:0,duration:.6,ease:'power3.out'},'-=.4');
  };
  if(document.readyState==='complete')heroIn();else addEventListener('load',heroIn,{once:true});
  // arrow in the circle drops in, rests, drops out, again
  gsap.timeline({repeat:-1,repeatDelay:.08}).set('.c-scroll-ic i',{y:-15,opacity:0}).to('.c-scroll-ic i',{y:0,opacity:1,duration:.62,ease:'power3.out'}).to('.c-scroll-ic i',{duration:.36}).to('.c-scroll-ic i',{y:15,opacity:0,duration:.5,ease:'power2.in'});
  gsap.to('.c-scroll',{autoAlpha:0,ease:'none',scrollTrigger:{start:0,end:100,scrub:true}});

  // pinned: the icon rises a little, five stripes grow from the bottom one by one, then the dark form slides over
  const touch=ScrollTrigger.isTouch===1||matchMedia('(pointer:coarse)').matches;
  gsap.to('#cHang',{y:'-10rem',ease:'none',scrollTrigger:{trigger:'#cHero',start:'top top',end:'+=150%',scrub:true}});
  const stl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#cHero',start:'top top',end:touch?'+=150%':'+=200%',pin:true,scrub:.6,pinSpacing:true}});
  $$('.c-stripes i').forEach((s,i)=>{const a=.3*(4-i)/4;stl.to(s,{scaleY:1,duration:.3},a)});
  stl.to({},{duration:.1});

  // ---------- 2. form: video plays only on screen, title letters blur in, fields rise ----------
  const cv=$('#cVid');ScrollTrigger.create({trigger:'#cForm',start:'top bottom',end:'bottom top',onToggle:s=>{if(s.isActive){cv.preload='auto';cv.play().catch(()=>{})}else cv.pause()}});
  $$('.c-reveal').forEach(el=>{const c=letters(el);gsap.set(c,{autoAlpha:0,filter:'blur(10px)'});
    gsap.to(c,{...blurIn,duration:.6,stagger:el.tagName==='SPAN'?.02:.035,scrollTrigger:{trigger:el,start:'top 85%',once:true}})});
  $$('.c-up').forEach(el=>gsap.from(el,{autoAlpha:0,y:30,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
  gsap.from('.c-form .c-field,.c-proto',{autoAlpha:0,y:40,duration:.8,ease:'power3.out',stagger:.07,clearProps:'transform',scrollTrigger:{trigger:'.c-form',start:'top 82%',once:true}});
  gsap.from('.c-or i',{scaleX:0,duration:1.1,ease:'power3.inOut',scrollTrigger:{trigger:'.c-or',start:'top 90%',once:true}});
  gsap.from('.c-call,.c-pref',{autoAlpha:0,y:24,duration:.8,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'.c-or',start:'top 90%',once:true}});

  // ---------- 3. info: divider draws out from the middle, plus turns in; questions rise ----------
  gsap.from('.c-lp i',{scaleX:0,duration:1.2,ease:'power3.inOut',scrollTrigger:{trigger:'.c-lp',start:'top 88%',once:true}});
  gsap.from('.c-lp .plus',{rotation:-180,scale:0,duration:.9,ease:'back.out(2)',scrollTrigger:{trigger:'.c-lp',start:'top 88%',once:true}});
  gsap.from('.c-acc-item',{autoAlpha:0,y:30,duration:.8,stagger:.07,ease:'power3.out',scrollTrigger:{trigger:'#cAcc',start:'top 85%',once:true}});

  // ---------- footer curtain ----------
  const foot=$('.foot'),main=$('.main');
  const curtain=()=>{foot.classList.remove('curtain');main.style.marginBottom='';const h=foot.offsetHeight;if(innerWidth>=900&&h<innerHeight-40){foot.classList.add('curtain');main.style.marginBottom=h+'px'}ScrollTrigger.refresh()};
  addEventListener('load',curtain);addEventListener('resize',curtain);
  // dot-matrix wordmark: dots sampled from the logo, scatter away from the pointer and spring back home
  (()=>{const wrap=$('#giantWrap'),img=$('#giant'),cv=$('#giantDots'),cx=cv.getContext('2d');let dots=[],W=0,H=0,dpr=1,run=false,ptr={x:-9999,y:-9999},assembled=false;
    const build=()=>{const r=wrap.getBoundingClientRect();if(!r.width||!img.naturalWidth)return;W=r.width;const h=r.width*img.naturalHeight/img.naturalWidth,P=Math.round(h*.6);H=h+P*2;dpr=Math.min(devicePixelRatio||1,2);
      cv.style.top=-P+'px';cv.style.height=H+'px';cv.width=W*dpr;cv.height=H*dpr;const step=W<600?4:Math.max(5,Math.round(W/230)),o=document.createElement('canvas');o.width=Math.ceil(W/step);o.height=Math.ceil(h/step);
      const oc=o.getContext('2d');oc.drawImage(img,0,0,o.width,o.height);let px;try{px=oc.getImageData(0,0,o.width,o.height).data}catch(e){return}
      const old=dots;dots=[];for(let y=0;y<o.height;y++)for(let x=0;x<o.width;x++){const k=(y*o.width+x)*4;if(px[k+3]<110)continue;
        const orange=px[k]>180&&px[k+2]<120,hx=x*step+step/2,hy=y*step+step/2+P,prev=old[dots.length];
        dots.push({hx,hy,x:prev?prev.x:hx+(Math.random()-.5)*W*.6,y:prev?prev.y:hy+(Math.random()-.5)*H*1.2,vx:0,vy:0,c:orange?'#FF7A00':'#8C8C8C',r:step*.26})}
      wrap.classList.add('live');kick()};
    const frame=()=>{cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);let moving=false;const R=Math.max(70,W*.07),R2=R*R;
      for(const d of dots){const dx=d.x-ptr.x,dy=d.y-ptr.y,q=dx*dx+dy*dy;if(q<R2&&assembled){const dist=Math.sqrt(q)||1,f=(1-dist/R)**1.5*9;d.vx+=dx/dist*f+(Math.random()-.5)*f*1.6;d.vy+=dy/dist*f+(Math.random()-.5)*f*1.6}
        d.vx+=(d.hx-d.x)*.022;d.vy+=(d.hy-d.y)*.022;d.vx*=.86;d.vy*=.86;d.x+=d.vx;d.y+=d.vy;
        if(Math.abs(d.vx)+Math.abs(d.vy)>.02||Math.abs(d.hx-d.x)+Math.abs(d.hy-d.y)>.3)moving=true;cx.fillStyle=d.c;cx.fillRect(d.x-d.r,d.y-d.r,d.r*2,d.r*2)}
      if(moving||ptr.in)requestAnimationFrame(frame);else run=false};
    const kick=()=>{if(!run&&assembled){run=true;requestAnimationFrame(frame)}};
    const at=e=>{const r=cv.getBoundingClientRect();ptr.x=e.clientX-r.left;ptr.y=e.clientY-r.top;ptr.in=true;kick()};
    wrap.addEventListener('pointermove',at);wrap.addEventListener('pointerdown',at);
    wrap.addEventListener('pointerleave',()=>{ptr.x=ptr.y=-9999;ptr.in=false});
    const go=()=>{build();new IntersectionObserver((es,ob)=>{if(es[0].isIntersecting){assembled=true;kick();ob.disconnect()}},{threshold:.25}).observe(wrap)};
    img.complete&&img.naturalWidth?go():img.addEventListener('load',go);
    let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(build,200)});
  })();
})();

}
