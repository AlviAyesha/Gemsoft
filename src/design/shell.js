/* eslint-disable */
// Shared nav, menus, smooth scroll, curtain and footer motion for the CMS pages (cut from the design's about page).
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
  if(reduce||!window.gsap||!window.ScrollTrigger){const w=$('#wipe');w&&w.remove();dispatchEvent(new Event('gs:intro'));return}
  gsap.registerPlugin(ScrollTrigger);
  // ---------- Lenis smooth scroll ----------
  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.2});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);window.__lenis=lenis;
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=document.querySelector(id);if(!t)return;e.preventDefault();lenis.scrollTo(t)}))}

  // ---------- curtain lifts, then the page's own intro starts ----------
  const nav=$('#nav');
  gsap.to('#wipe',{yPercent:-100,duration:1,ease:'power4.inOut',delay:.15,onComplete:()=>{const w=$('#wipe');w&&w.remove()}});
  gsap.delayedCall(.8,()=>{window.__introDone=true;dispatchEvent(new Event('gs:intro'))});

  // ---------- nav: solid after hero, hide on scroll down ----------
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll();nav.classList.toggle('solid',y>40);nav.classList.toggle('hide',s.direction===1&&y>160&&!menu.classList.contains('open'))}});

  // ---------- footer curtain ----------
  const foot=$('.foot'),main=$('.main');
  const curtain=()=>{foot.classList.remove('curtain');main.style.marginBottom='';const h=foot.offsetHeight;if(innerWidth>=900&&h<innerHeight-40){foot.classList.add('curtain');main.style.marginBottom=h+'px'}ScrollTrigger.refresh()};
  addEventListener('load',curtain);window.__shellRefresh=curtain;addEventListener('resize',curtain);
  // ---------- 4.14 footer giant wordmark ----------
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
