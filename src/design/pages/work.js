/* eslint-disable */
// Imported from the design page work.html by scripts/import-design.py. Edit the design and re-import.
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

  if(reduce||!window.gsap||!window.ScrollTrigger){const w=$('#wipe');w&&w.remove();return}
  gsap.registerPlugin(ScrollTrigger);
  const nav=$('#nav');

  // ---------- Lenis smooth scroll ----------
  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.2});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);window.__lenis=lenis;
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=document.querySelector(id);if(!t)return;e.preventDefault();lenis.scrollTo(t)}))}

  // ---------- nav: solid after hero, hide on scroll down ----------
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll();nav.classList.toggle('solid',y>40);nav.classList.toggle('hide',s.direction===1&&y>160&&!menu.classList.contains('open'))}});

  // ---------- helpers ----------
  const chars=el=>{const t=el.textContent;el.textContent='';return [...t].map(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c===' '?' ':c;el.appendChild(s);return s})};
  const isDesk=()=>matchMedia('(min-width:768px)').matches;

  // ---------- hero copy waits for the intro ----------
  const heroRows=$$('.w-h1 .row-txt').map(chars);
  const rotEl=$('#wRot'),rotWords=JSON.parse(rotEl.dataset.words);let rotI=0;
  const rotChars=()=>chars(rotEl);
  let rc=rotChars();
  gsap.set(heroRows.flat().concat(rc),{autoAlpha:0,filter:'blur(12px)'});
  gsap.set('.w-hero-up',{autoAlpha:0,y:24});
  const cycle=()=>{gsap.to(rc,{autoAlpha:0,filter:'blur(12px)',duration:.5,ease:'power2.in',stagger:{each:.04,from:'random'},onComplete:()=>{
    rotI=(rotI+1)%rotWords.length;rotEl.textContent=rotWords[rotI];rc=rotChars();
    gsap.fromTo(rc,{autoAlpha:0,filter:'blur(12px)'},{autoAlpha:1,filter:'blur(0px)',duration:.6,ease:'power2.out',stagger:{each:.05,from:'random'},onComplete:()=>gsap.delayedCall(1.8,cycle)})}})};

  const heroIn=()=>{
    const tl=gsap.timeline();
    tl.to('#wipe',{yPercent:-100,duration:window.__vt?0:1,ease:'power4.inOut',delay:window.__vt?0:.15}).add(()=>$('#wipe')&&$('#wipe').remove())
      .to(heroRows.flat().concat(rc),{autoAlpha:1,filter:'blur(0px)',duration:.7,ease:'power2.out',stagger:.04},'-=.1')
      .to('.w-hero-up',{autoAlpha:1,y:0,duration:.9,stagger:.1,ease:'power3.out'},'-=.5')
      .add(()=>gsap.delayedCall(1.6,cycle));
  };

  if(document.readyState==='complete')heroIn();else addEventListener('load',heroIn,{once:true});

  // ---------- hero on scroll: copy blurs away while the 3D logo blasts apart (hero3d.js) ----------
  gsap.to('.w-hero-in,.w-scroll',{autoAlpha:0,filter:'blur(10px)',y:-60,ease:'none',scrollTrigger:{trigger:'.w-hero',start:'top top',end:()=>'+='+innerHeight*.5,scrub:true}});

  // ---------- 3. statement: pinned while five stripes wipe up into the light key facts (trionn vision-section) ----------
  const vis=$('#wVis'),facts=$('#wFacts'),stripes=$$('.w-stripes i');
  const visTl=gsap.timeline({scrollTrigger:{trigger:vis,start:'top top',end:()=>'+='+(ScrollTrigger.isTouch?1.5:2)*innerHeight,pin:true,scrub:.6,anticipatePin:1},defaults:{ease:'none'}});
  stripes.forEach((s,e)=>{const st=.3*(4-e)/4;visTl.to(s,{scaleY:1,duration:.3},st)});
  visTl.to({},{duration:.1});
  const pullFacts=()=>gsap.set(facts,{marginTop:-vis.offsetHeight});pullFacts();ScrollTrigger.addEventListener('refreshInit',pullFacts);
  gsap.from('.w-vis-top span,.w-vis-bot',{autoAlpha:0,filter:'blur(10px)',y:20,duration:.9,stagger:.12,ease:'power2.out',scrollTrigger:{trigger:vis,start:'top 70%'}});

  // ---------- 4. key facts: cards tip up in 3D, numbers count, industries rotate ----------
  gsap.from('.w-facts-head>*',{y:40,autoAlpha:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.w-facts-head',start:'top 85%'}});
  gsap.from('.w-card',{rotationX:-38,y:120,autoAlpha:0,transformOrigin:'50% 100%',duration:1.3,stagger:.12,ease:'power4.out',scrollTrigger:{trigger:'.w-cards',start:'top 85%'}});
  $$('[data-count]').forEach(el=>{const to=+el.dataset.count,o={v:0};gsap.to(o,{v:to,duration:2,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%'},onUpdate:()=>el.textContent=String(Math.round(o.v)).padStart(3,'0')})});
  const ind=$$('.k-ind span');if(ind.length>1){gsap.set(ind,{yPercent:110});gsap.set(ind[0],{yPercent:0});let k=0;
    gsap.delayedCall(2,function next(){const a=ind[k];k=(k+1)%ind.length;gsap.to(a,{yPercent:-110,duration:.6,ease:'power3.inOut'});gsap.fromTo(ind[k],{yPercent:110},{yPercent:0,duration:.6,ease:'power3.inOut'});gsap.delayedCall(2,next)})}

  // ---------- 5. works: pinned, the track slides left; each card rises from below as it comes in, its divider draws and its text fades in (trionn work-section) ----------
  const work=$('#wWork'),track=$('#wTrack'),pans=$$('.w-pan',track),cardsW=$$('.w-pan-proj',track),edge=$('.w-edge i'),edgePlus=$('.w-edge .plus'),prog=$('.w-prog i'),progN=$('.w-prog span');
  const titleCh=$$('.w-pan-title h2 span').map(chars).flat();
  gsap.set(titleCh,{autoAlpha:0,filter:'blur(10px)'});
  gsap.to(titleCh,{autoAlpha:1,filter:'blur(0px)',duration:.6,stagger:.04,ease:'power2.out',scrollTrigger:{trigger:work,start:'top 60%'}});
  const bits=p=>$$('.w-proj-top,.w-proj-bot>*',p);
  gsap.set(cardsW.map(bits).flat(),{autoAlpha:0,y:16});
  const reveal=p=>gsap.to(bits(p),{autoAlpha:1,y:0,duration:.7,stagger:.12,ease:'sine.out'});
  const mm=gsap.matchMedia();let wkST=null;
  mm.add('(min-width:768px)',()=>{
    document.documentElement.classList.add('wk-on');
    const inner=cardsW.map(p=>$('.w-card-in',p));gsap.set(inner,{y:550});
    const shown=new Set,drawn=new Set,dist=()=>Math.max(0,track.scrollWidth-innerWidth);
    const place=self=>{const p=self?self.progress:0,S=p*dist(),W=innerWidth;gsap.set(track,{x:-S});
      pans.forEach((pn,i)=>{const r=(pn.offsetLeft+pn.offsetWidth/2-S)/W,isCard=pn.classList.contains('w-pan-proj');
        if(isCard){const y=r>1.2?550:r>.5?550*(1-(1-Math.pow(1-(1.2-r)/.7,3))):0;gsap.set($('.w-card-in',pn),{y});
          if(r<1.05&&!shown.has(i)){shown.add(i);reveal(pn)}}
        const vl=$('.vline',pn);if(vl&&r<1.15&&!drawn.has(i)){drawn.add(i);gsap.to(vl,{scaleY:1,duration:1.2,ease:'power2.out'})}});
      gsap.set(edge,{scaleY:p});gsap.set(edgePlus,{rotation:360*p,opacity:p>.01&&p<.99?1:0});
      gsap.set(prog,{scaleX:p});const cur=Math.min(cardsW.length,Math.max(1,Math.round(p*cardsW.length+.5)));progN.textContent=pad(cur)+' / '+pad(cardsW.length)};
    const st=ScrollTrigger.create({trigger:work,start:'top top',end:()=>'+='+dist(),pin:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:place,onRefresh:place});
    place(st);wkST=st;
    return()=>{wkST=null;document.documentElement.classList.remove('wk-on');gsap.set([track].concat(inner),{clearProps:'transform'})};
  });
  mm.add('(max-width:767px)',()=>{
    pans.forEach(pn=>{const h=$('.hline',pn);h&&gsap.fromTo(h,{scaleX:0},{scaleX:1,duration:1.2,ease:'power2.out',scrollTrigger:{trigger:pn,start:'bottom 95%'}});
      if(pn.classList.contains('w-pan-proj'))ScrollTrigger.create({trigger:pn,start:'top 80%',once:true,onEnter:()=>reveal(pn)})});
  });

  // ---------- 6. case study in place: "Explore project" keeps the slider pinned underneath, the picture flies to a sticky side column and the story opens beside it (trionn /work/<project>) ----------
  const cs=$("#wCase"),LN=window.__lenis;
  if(cs){
    const arts={};$$('.wc',cs).forEach(a=>arts[a.dataset.slug]=a);
    const cardOf=sl=>$('#'+sl),cardImg=sl=>$('.w-proj-img img',cardOf(sl));
    let cur=null,busy=false,opener=null;
    const split={};
    // title letters, kept inside whole words so a long name never breaks mid-word
    const words=el=>{const t=el.textContent.trim().split(/\s+/);el.textContent='';const out=[];
      t.forEach((w,k)=>{const s=document.createElement('span');s.className='wd';el.appendChild(s);if(k<t.length-1)el.appendChild(document.createTextNode(' '));
        [...w].forEach(c=>{const ch=document.createElement('span');ch.className='ch';ch.textContent=c;s.appendChild(ch);out.push(ch)})});return out};
    const hide=a=>{const sl=a.dataset.slug;if(!split[sl])split[sl]=words($('.wc-h',a));
      gsap.set(split[sl],{autoAlpha:0,filter:'blur(10px)'});gsap.set($('.wc-lp i',a),{scaleX:0});gsap.set($('.wc-lp .plus',a),{rotation:-180,autoAlpha:0});
      gsap.set($$('.wc-back,.wc-meta,.wc-sub,.wc-svc li,.wc-facts,.wc-over,.wc-tabs,.wc-panes,.wc-res,.wc-gal>*,.wc-next,.wc-foot',a),{autoAlpha:0,y:24})};
    const tell=a=>{const sl=a.dataset.slug;hide(a);
      const tl=gsap.timeline({defaults:{ease:'power3.out'}});
      tl.to($('.wc-lp i',a),{scaleX:1,duration:1,ease:'power2.inOut'},0).to($('.wc-lp .plus',a),{rotation:0,autoAlpha:1,duration:1},0)
        .to($$('.wc-back,.wc-meta',a),{autoAlpha:1,y:0,duration:.7,stagger:.08},.05)
        .to(split[sl],{autoAlpha:1,filter:'blur(0px)',duration:.6,stagger:.025,ease:'power2.out'},.15)
        .to($$('.wc-sub,.wc-svc li,.wc-facts,.wc-over,.wc-tabs,.wc-panes,.wc-res',a),{autoAlpha:1,y:0,duration:.8,stagger:.06},.35)
        .to($$('.wc-gal>*,.wc-next',a),{autoAlpha:1,y:0,duration:1,stagger:.1},.55)
        .to($('.wc-foot',a),{autoAlpha:1,y:0,duration:.7},.6);
      return tl};
    // keep the slider underneath on the open project, so closing lands on its card
    const under=sl=>{const pn=cardOf(sl).closest('.w-pan');let y;
      if(wkST){const S=Math.min(Math.max(0,track.scrollWidth-innerWidth),Math.max(0,pn.offsetLeft+pn.offsetWidth/2-innerWidth/2));y=wkST.start+S}
      else y=pn.getBoundingClientRect().top+scrollY-innerHeight*.12;
      LN?LN.scrollTo(y,{immediate:true,force:true}):scrollTo(0,y);ScrollTrigger.update()};
    const fly=(img,from,to,back)=>{const f=document.createElement('div');f.className='wc-fly';f.innerHTML='<img alt="">';$('img',f).src=img.currentSrc||img.src;document.body.appendChild(f);
      const box=r=>({left:r.left,top:r.top,width:r.width,height:r.height});
      gsap.set(f,{...box(from),borderRadius:back?12:6});gsap.set($('img',f),{scale:back?1:1.08});
      return gsap.timeline({onComplete:()=>f.remove()}).to(f,{...box(to),borderRadius:back?6:12,duration:1.05,ease:'power3.inOut'},0).to($('img',f),{scale:back?1.08:1,duration:1.05,ease:'power3.inOut'},0)};
    const show=sl=>{Object.values(arts).forEach(a=>a.hidden=a.dataset.slug!==sl);cur=sl};
    const open=(sl,trigger)=>{if(busy||!arts[sl])return;busy=true;opener=trigger||null;
      LN&&LN.stop();const a=arts[sl],ci=cardImg(sl),from=ci.getBoundingClientRect();
      show(sl);cs.hidden=false;cs.scrollTop=0;document.documentElement.classList.add('case-open');
      const pic=$('.wc-pic',a);hide(a);gsap.set(pic,{autoAlpha:0});gsap.set($('.wc-x',cs),{scale:0,rotation:-90});
      gsap.fromTo(cs,{backgroundColor:'rgba(11,11,11,0)'},{backgroundColor:'rgba(11,11,11,1)',duration:.7,ease:'power2.out'});
      gsap.set(ci,{autoAlpha:0});
      fly(ci,from,$('.wc-pic',a).getBoundingClientRect(),false).add(()=>{gsap.set(pic,{autoAlpha:1});
        gsap.to($('.wc-x',cs),{scale:1,rotation:0,duration:.6,ease:'back.out(1.6)'});$('.wc-x',cs).focus({preventScroll:true});
        tell(a).add(()=>busy=false,.4)});
    };
    const close=()=>{if(busy||!cur)return;busy=true;const a=arts[cur],ci=cardImg(cur),pic=$('.wc-pic',a);
      gsap.to($$('.wc-main,.wc-foot,.wc-x',cs),{autoAlpha:0,duration:.35,ease:'power2.in'});
      const go=()=>{const from=$('.wc-pic',a).getBoundingClientRect();gsap.set(pic,{autoAlpha:0});
        gsap.to(cs,{backgroundColor:'rgba(11,11,11,0)',duration:.8,delay:.25,ease:'power2.inOut'});
        fly($('img',pic),from,ci.getBoundingClientRect(),true).add(()=>{gsap.set(ci,{autoAlpha:1});cs.hidden=true;document.documentElement.classList.remove('case-open');
          gsap.set([$$('.wc-main,.wc-foot,.wc-x',cs),pic].flat(),{clearProps:'opacity,visibility'});
          LN&&LN.start();const o=opener||$('.btn',cardOf(cur));cur=null;busy=false;o&&o.focus({preventScroll:true})})};
      // on phones the picture scrolls with the page: bring it back into view first
      if(!isDesk()&&cs.scrollTop>0)gsap.to(cs,{scrollTop:0,duration:.5,ease:'power2.inOut',onComplete:go});else go()};
    const goTo=sl=>{if(busy||!arts[sl]||sl===cur)return;busy=true;const old=arts[cur],a=arts[sl];
      gsap.timeline().to(old,{autoAlpha:0,duration:.45,ease:'power2.in'}).add(()=>{
        gsap.set(cardImg(cur),{autoAlpha:1});gsap.set(old,{clearProps:'opacity,visibility'});
        show(sl);cs.scrollTop=0;under(sl);gsap.set(cardImg(sl),{autoAlpha:0});opener=null;
        const pic=$('.wc-pic img',a);gsap.set(pic,{autoAlpha:1});
        gsap.fromTo($('.wc-pic',a),{clipPath:'inset(100% 0% 0% 0% round 12px)'},{clipPath:'inset(0% 0% 0% 0% round 12px)',duration:1,ease:'power4.inOut',clearProps:'clipPath'});
        gsap.fromTo(pic,{scale:1.25},{scale:1,duration:1.4,ease:'power3.out'});
        tell(a).add(()=>busy=false,.4)})};
    // clicks: card picture or "Explore project" open in place; buttons inside the layer close or move on
    track.addEventListener('click',ev=>{const l=ev.target.closest('.w-proj a[href^="#"]');if(!l)return;ev.preventDefault();open(l.getAttribute('href').slice(1),l)});
    cs.addEventListener('click',ev=>{const b=ev.target.closest('[data-close],[data-go]');if(!b)return;b.dataset.go?goTo(b.dataset.go):close()});
    addEventListener('keydown',ev=>{if(ev.key==='Escape'&&cur)close()});
    // arriving from the home page with work.html#<project>: bring the slider to that card, then open its story
    const h0=decodeURIComponent(location.hash.slice(1));if(arts[h0])setTimeout(()=>{under(h0);setTimeout(()=>open(h0),700)},1600);
    // tabs: The challenge / Approach / Outcome / What we did
    $$('.wc-tabs',cs).forEach(tl=>{const tabs=$$('.wc-tab',tl),panes=$$('.wc-pane',tl.nextElementSibling);
      const pick=i=>{tabs.forEach((t,k)=>{t.classList.toggle('on',k===i);t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1});panes.forEach((p,k)=>p.classList.toggle('on',k===i))};
      tabs.forEach((t,i)=>{t.addEventListener('click',()=>pick(i));t.addEventListener('keydown',ev=>{const d=ev.key==='ArrowRight'?1:ev.key==='ArrowLeft'?-1:0;if(d){const n=(i+d+tabs.length)%tabs.length;pick(n);tabs[n].focus()}})})});
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
