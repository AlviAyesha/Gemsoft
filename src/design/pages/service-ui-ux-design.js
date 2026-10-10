/* eslint-disable */
// Imported from the design page service-ui-ux-design.html by scripts/import-design.py. Edit the design and re-import.
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
  // ---------- services list: works with or without animation ----------
  const sMain=$('#sMain'),sItems=$$('.s-item'),sLinks=$$('.s-idx a'),sPics=$$('.s-pic-in img'),sNum=$('#sPicN');
  const desk=()=>matchMedia('(min-width:992px)').matches;
  let sCur=-1;
  const setActive=i=>{if(i===sCur)return;sCur=i;const it=sItems[i];
    sItems.forEach((x,k)=>x.classList.toggle('active',k===i));
    sLinks.forEach((a,k)=>{a.classList.toggle('active',k===i);a.toggleAttribute('aria-current',k===i)});
    sPics.forEach((p,k)=>p.classList.toggle('on',k<=i));
    if(sNum)sNum.textContent=pad(i+1)+' / '+pad(sItems.length);
    sMain.classList.toggle('on-dark',it.dataset.theme==='dark')};
  // mobile accordion: tap a service to open it, first one in each group starts open
  sItems.forEach(it=>{const h=$('.s-head',it);h.addEventListener('click',()=>{if(desk())return;const o=!it.classList.contains('open');it.classList.toggle('open',o);h.setAttribute('aria-expanded',o)})});
  $$('.s-grp').forEach(g=>{const f=$('.s-item',g);f.classList.add('open');$('.s-head',f).setAttribute('aria-expanded',true)});
  // index links scroll to the service
  sLinks.forEach((a,k)=>a.addEventListener('click',e=>{e.preventDefault();const t=sItems[k];window.__lenis?window.__lenis.scrollTo(t,{offset:-innerHeight*.3}):t.scrollIntoView({behavior:'smooth',block:'center'});history.replaceState(null,'','#'+t.id)}));
  // active service = the one crossing the middle of the screen
  const pickActive=()=>{const mid=innerHeight*.5;let best=0;sItems.forEach((it,k)=>{if(it.getBoundingClientRect().top<mid)best=k});setActive(best)};
  addEventListener('scroll',pickActive,{passive:true});addEventListener('resize',pickActive);pickActive();
  // deep link: services.html#mobile-apps opens and scrolls to that service
  const deep=location.hash&&document.getElementById(location.hash.slice(1));
  if(deep&&deep.classList.contains('s-item')){deep.classList.add('open');setTimeout(()=>deep.scrollIntoView({block:'center'}),60)}

  if(reduce||!window.gsap||!window.ScrollTrigger){const w=$('#wipe');w&&w.remove();return}
  gsap.registerPlugin(ScrollTrigger);
  const nav=$('#nav');

  // ---------- Lenis smooth scroll ----------
  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.2});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);window.__lenis=lenis;
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=document.querySelector(id);if(!t)return;e.preventDefault();lenis.scrollTo(t)}))}

  // ---------- nav: solid after hero, hide on scroll down ----------
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll();nav.classList.toggle('solid',y>40);nav.classList.toggle('hide',s.direction===1&&y>160&&!menu.classList.contains('open'))}});

  // ---------- line-mask reveals on H2 ----------
  const split=el=>{const words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(w=>`<span class="w" style="display:inline-block">${w}</span>`).join(' ');
    const lines=[];let top=null;$$('.w',el).forEach(w=>{const t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(l=>`<span class="ln"><span>${l.join(' ')}</span></span>`).join('')};
  document.fonts.ready.then(()=>{$$('[data-reveal]').forEach(el=>{split(el);gsap.from($$('.ln>span',el),{yPercent:110,duration:1.1,stagger:.08,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 85%'}})});ScrollTrigger.refresh()});

  // ---------- page intro: dark curtain lifts, H1 lines rise ----------
  gsap.timeline()
    .to('#wipe',{yPercent:-100,duration:window.__vt?0:1,ease:'power4.inOut',delay:window.__vt?0:.15})
    .from('#s-h1 .ln>span',{yPercent:110,duration:1.2,stagger:.1,ease:'power4.out'},'-=.45')
    .from('.crumb,.s-tick',{y:24,opacity:0,duration:.8,stagger:.1,ease:'power3.out'},'-=.9')
    .add(()=>$('#wipe').remove());

  // ---------- hero (unitedcarriers service-hero): pinned, photo zooms, copy drifts up while the tools section slides over ----------
  gsap.fromTo('.s-hero-bg img',{scale:1.12},{scale:1,ease:'none',scrollTrigger:{trigger:'.s-tech',start:'top bottom',end:'top top',scrub:true}});
  gsap.to('.s-hero-in',{y:-140,opacity:.2,ease:'none',scrollTrigger:{trigger:'.s-tech',start:'top bottom',end:'top top',scrub:true}});

  // ---------- tools: lines draw, photos unmask, corner dots pop ----------
  gsap.from('.s-tech-line',{scaleX:0,duration:1.4,ease:'power3.inOut',scrollTrigger:{trigger:'.s-tech-grid',start:'top 85%'}});
  $$('.s-tech-item').forEach((it,i)=>{
    gsap.fromTo(it,{'--ln':0},{'--ln':1,duration:1.6,ease:'power3.inOut',scrollTrigger:{trigger:it,start:'top 85%'}});
    gsap.fromTo($('.ph',it),{clipPath:'inset(100% 0 0 0 round 14px)'},{clipPath:'inset(0% 0 0 0 round 14px)',duration:1.3,delay:i*.12,ease:'power4.inOut',scrollTrigger:{trigger:it,start:'top 80%'}});
    gsap.fromTo($('.ph img',it),{scale:1.25},{scale:1,duration:1.6,delay:i*.12,ease:'power3.out',scrollTrigger:{trigger:it,start:'top 80%'}});
    gsap.from($$('.s-tech-img i',it),{scale:0,opacity:0,duration:.5,stagger:.08,delay:.9+i*.12,ease:'back.out(3)',scrollTrigger:{trigger:it,start:'top 80%'}});
    gsap.from($$('.s-tech-txt>*',it),{y:30,opacity:0,duration:.9,stagger:.1,delay:.4,ease:'power3.out',scrollTrigger:{trigger:it,start:'top 75%'}});
  });

  // ---------- intro: stage text fades up ----------
  gsap.from('.s-stage-txt>*',{y:40,opacity:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'#sStage',start:'top 70%'}});

  // ---------- pinned photo card (unitedcarriers service-img-deco): a row of photos rises in, stops,
  // then the row folds away to the right and the first card stays pinned as the list's photo ----------
  if(desk()&&$('#sDeco')){
    document.documentElement.classList.add('deco-on');
    const deco=$$('.s-deco-i'),box=$('#sPicBox'),card=$('.s-pic-in',box);
    gsap.set(deco,{clipPath:'inset(100% 0 0 0 round 16px)'});
    gsap.set(card,{clipPath:'inset(100% 0 0 0 round 16px)'});
    gsap.timeline({scrollTrigger:{trigger:'#sStage',start:'top 75%'}})
      .to(card,{clipPath:'inset(0% 0 0 0 round 16px)',duration:1.2,ease:'power4.inOut',onComplete:()=>gsap.set(card,{clearProps:'clipPath'})})
      .to(deco,{clipPath:'inset(0% 0 0 0 round 16px)',duration:1.2,stagger:.1,ease:'power4.inOut'},'-=1')
      .from($$('img',$('#sDeco')),{scale:1.3,duration:1.6,ease:'power3.out'},0);
    gsap.timeline({scrollTrigger:{trigger:'#sStage',start:'top top',end:'bottom bottom',scrub:.6}})
      .fromTo(box,{scale:1.12},{scale:1,ease:'none',duration:1},0)
      .to(deco,{xPercent:i=>60+i*35,yPercent:i=>-8-i*4,rotation:i=>4+i*2,opacity:0,ease:'power2.in',duration:.8,stagger:.05},0)
      .fromTo('#sPicN',{opacity:0,y:10},{opacity:1,y:0,duration:.2},.8);
  }

  // ---------- services list: top rule of each service draws in, index rows slide in ----------
  if(desk()){
    sItems.forEach(it=>gsap.fromTo(it,{'--sx':0},{'--sx':1,duration:1.2,ease:'power3.inOut',scrollTrigger:{trigger:it,start:'top 90%'}}));
    gsap.from('.s-idx-g',{x:-30,opacity:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'#sMain',start:'top 60%'}});
  }

  // ---------- CTA magnetic button ----------
  const mag=$('#mag');if(matchMedia('(hover:hover)').matches){mag.addEventListener('mousemove',e=>{const r=mag.getBoundingClientRect();gsap.to(mag,{x:(e.clientX-r.left-r.width/2)*.35,y:(e.clientY-r.top-r.height/2)*.35,duration:.4})});mag.addEventListener('mouseleave',()=>gsap.to(mag,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))}
  gsap.from('.cta-gem',{rotation:-20,scale:.8,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}});

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
