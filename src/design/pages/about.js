/* eslint-disable */
// Imported from the design page about.html by scripts/import-design.py. Edit the design and re-import.
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

  // ---------- vision / mission / strategy: hover or focus expands a card ----------

  // ---------- team carousel: arrows, drag, counter, bio flip ----------
  const tr=$('#tmTrack'),cards=$$('.mate',tr),cnt=$('#tmCount'),prev=$('#tmPrev'),next=$('#tmNext');
  const pad=n=>String(n).padStart(2,'0');
  const stepW=()=>cards[0].getBoundingClientRect().width+18;
  const sync=()=>{const i=Math.round(tr.scrollLeft/stepW()),max=tr.scrollWidth-tr.clientWidth;cnt.textContent=`${pad(Math.min(cards.length,i+1))} / ${pad(cards.length)}`;prev.disabled=tr.scrollLeft<4;next.disabled=tr.scrollLeft>max-4};
  tr.addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);sync();
  prev.addEventListener('click',()=>tr.scrollBy({left:-stepW(),behavior:'smooth'}));next.addEventListener('click',()=>tr.scrollBy({left:stepW(),behavior:'smooth'}));
  let dx=null,sl=0,moved=0;tr.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.target.closest('button'))return;dx=e.clientX;sl=tr.scrollLeft;moved=0;tr.style.scrollSnapType='none';tr.style.cursor='grabbing'});
  addEventListener('pointermove',e=>{if(dx===null)return;moved=Math.abs(e.clientX-dx);tr.scrollLeft=sl-(e.clientX-dx)});
  addEventListener('pointerup',()=>{if(dx===null)return;dx=null;tr.style.cursor='';const i=Math.round(tr.scrollLeft/stepW());tr.scrollTo({left:i*stepW(),behavior:'smooth'});setTimeout(()=>tr.style.scrollSnapType='',450)});
  cards.forEach(c=>{const more=$('.more',c),close=$('.bio button',c),bio=$('.bio',c);
    more.addEventListener('click',()=>{c.classList.add('open');more.setAttribute('aria-expanded',true);bio.removeAttribute('inert');close.focus()});
    close.addEventListener('click',()=>{c.classList.remove('open');more.setAttribute('aria-expanded',false);bio.setAttribute('inert','');more.focus()})});

  // ---------- global reach: dot map + pins ----------
  const GW=280,GH=140,proj=(lon,lat)=>[(139.2+lon*.835)/GW*100,(56+(31.5-lat)*.9)/GH*100];
  $$('.pin').forEach(p=>{const [lon,lat]=p.dataset.ll.split(',').map(Number),[x,y]=proj(lon,lat);p.style.left=x+'%';p.style.top=y+'%'});
  const mapCv=$('#mapCv'),pts=(window.MAP_PTS||'').split(';').filter(Boolean).map(s=>s.split(',').map(Number));
  let mapP=reduce?1:0;
  const drawMap=()=>{const r=mapCv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(!r.width)return;mapCv.width=r.width*d;mapCv.height=r.height*d;const c=mapCv.getContext('2d');c.setTransform(d,0,0,d,0,0);
    const sx=r.width/GW,sy=r.height/GH,rad=Math.max(1,Math.min(sx,sy)*.42);
    pts.forEach(([x,y],i)=>{const t=Math.max(0,Math.min(1,mapP*1.6-(x/GW)*.6));if(t<=0)return;c.globalAlpha=t*.9;c.fillStyle='#4A4A4A';c.beginPath();c.arc((x+.5)*sx,(y+.5)*sy,rad,0,6.283);c.fill()});c.globalAlpha=1};
  addEventListener('resize',drawMap);drawMap();

  // ---------- reduced motion: finished states, no pins ----------
  const nums=$$('[data-to]');
  if(reduce||!window.gsap||!window.ScrollTrigger){nums.forEach(n=>n.textContent=n.dataset.to);const w=$('#wipe');w&&w.remove();return}
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Lenis smooth scroll ----------
  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.2});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=document.querySelector(id);if(!t)return;e.preventDefault();lenis.scrollTo(t)}))}

  // ---------- page intro: dark curtain lifts, H1 lines rise ----------
  const nav=$('#nav');
  gsap.timeline()
    .to('#wipe',{yPercent:-100,duration:1,ease:'power4.inOut',delay:.15})
    .from('#a-h1 .ln>span',{yPercent:110,duration:1.2,stagger:.1,ease:'power4.out'},'-=.45')
    .from('.crumb,#aHeroB',{y:24,opacity:0,duration:.8,stagger:.1,ease:'power3.out'},'-=.9')
    .add(()=>$('#wipe').remove());

  // ---------- nav: solid after hero, hide on scroll down ----------
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll();nav.classList.toggle('solid',y>40);nav.classList.toggle('hide',s.direction===1&&y>160&&!menu.classList.contains('open'))}});

  // ---------- hero: video zooms and dims as the page moves on ----------
  gsap.to('#aVid,.a-hero .poster',{scale:1.15,ease:'none',scrollTrigger:{trigger:'.a-hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.a-hero .wrap',{y:-120,opacity:0,ease:'none',scrollTrigger:{trigger:'.a-hero',start:'center center',end:'bottom top',scrub:true}});
  const vid=$('#aVid');ScrollTrigger.create({trigger:'.a-hero',start:'top bottom',end:'bottom top',onToggle:s=>{s.isActive?vid.play().catch(()=>{}):vid.pause()}});

  // ---------- line-mask reveals on H2 ----------
  const split=el=>{const words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(w=>`<span class="w" style="display:inline-block">${w}</span>`).join(' ');
    const lines=[];let top=null;$$('.w',el).forEach(w=>{const t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(l=>`<span class="ln"><span>${l.join(' ')}</span></span>`).join('')};
  document.fonts.ready.then(()=>{$$('[data-reveal]').forEach(el=>{split(el);gsap.from($$('.ln>span',el),{yPercent:110,duration:1.1,stagger:.08,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 85%'}})});ScrollTrigger.refresh()});

  // ---------- story (unitedcarriers about-intro): text pinned low, words fill in as the gallery scrolls past; photos unmask + drift ----------
  const sText=$('#storyText'),sGal=$('#storyGallery');
  $$('[data-fill]',sText).forEach(p=>{p.innerHTML=p.textContent.trim().split(/\s+/).map(w=>`<span class="fw">${w}</span>`).join(' ')});
  if(mobile){ // mobile: gallery becomes an endless photo strip, same as the reference
    $$('.sg',sGal).forEach(f=>{const c=f.cloneNode(true);c.setAttribute('aria-hidden','true');$('img',c).alt='';sGal.appendChild(c)});
    $$('.fw',sText).forEach(w=>w.style.opacity=1);
  }else if(!reduce){
    gsap.to($$('.fw',sText),{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'#story',start:'top 70%',end:()=>'+='+Math.max(400,sGal.offsetHeight*.75),scrub:.6}});
    gsap.fromTo(sText,{scale:.94,opacity:.6},{scale:1,opacity:1,ease:'none',scrollTrigger:{trigger:'#story',start:'top 90%',end:'top 30%',scrub:true}});
    $$('.sg',sGal).forEach((f,i)=>{
      gsap.fromTo(f,{clipPath:'inset(100% 0% 0% 0% round 20px)'},{clipPath:'inset(0% 0% 0% 0% round 20px)',duration:1.4,ease:'power4.inOut',scrollTrigger:{trigger:f,start:'top 88%'}});
      gsap.fromTo($('img',f),{scale:1.3},{scale:1.06,ease:'none',scrollTrigger:{trigger:f,start:'top bottom',end:'bottom top',scrub:true}});
      gsap.fromTo(f,{y:i%2?90:40},{y:i%2?-90:-40,ease:'none',scrollTrigger:{trigger:f,start:'top bottom',end:'bottom top',scrub:true}});
    });
  }else $$('.fw',sText).forEach(w=>w.style.opacity=1);

  // ---------- principles: cards rise ----------
  gsap.from('#prGrid .pr',{y:70,opacity:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'#prGrid',start:'top 85%'}});

  // ---------- difference: each headline fills ink as it crosses the screen ----------
  $$('.diff-row').forEach(r=>{gsap.fromTo($('h3',r),{backgroundPosition:'100% 0'},{backgroundPosition:'0% 0',ease:'none',scrollTrigger:{trigger:r,start:'top 85%',end:'top 45%',scrub:.6}});
    gsap.from($$('.n,p',r),{opacity:0,x:-20,duration:.8,ease:'power3.out',scrollTrigger:{trigger:r,start:'top 80%'}})});

  // ---------- vision/mission/strategy (unitedcarriers about-fea): pinned; each title fills left to right, words rise, photo unmasks, white fade into the next section ----------
  const feaItems=$$('.fea-item'),feaList=$('#feaList'),feaProg=$('#feaProg'),feaBg=$$('.fea-bg-item'),feaOv=$('#feaOverlay');
  $$('.fea-desc').forEach(p=>{p.innerHTML=p.textContent.trim().split(/\s+/).map((w,i)=>`<span class="word" style="--d:${(i*0.025).toFixed(3)}s">${w}</span>`).join(' ')});
  if(!reduce&&matchMedia('(min-width:768px)').matches){
    let feaCur=-1;
    const showBg=i=>feaBg.forEach((b,k)=>{if(!k)return;const on=k<=i;gsap.to(b,{clipPath:on?'inset(0% 0 0 0)':'inset(100% 0 0 0)',duration:1.1,ease:'power3.inOut',overwrite:true});
      gsap.to($('img',b),{scale:on?1:1.2,duration:1.4,ease:'power3.out',overwrite:true})});
    ScrollTrigger.create({trigger:'#feaWrap',start:'top top',end:'bottom bottom',onUpdate:s=>{
      const n=feaItems.length,P=s.progress,x=Math.min(P*n,n-1e-4),i=Math.floor(x),p=x-i;
      if(i!==feaCur){feaCur=i;feaList.style.setProperty('--index',i);feaItems.forEach((it,k)=>{it.classList.toggle('active',k===i);it.classList.toggle('is-prev',k<i);it.classList.toggle('is-far',k<i-1)});showBg(i)}
      $('.fea-title',feaItems[i]).style.setProperty('--p',((1-Math.min(p*1.25,1))*100).toFixed(2)+'%');
      feaProg.style.width=(p*100).toFixed(2)+'%';
    }});
    gsap.set($$('img',feaBg[0]),{scale:1.15});
    gsap.to($$('img',feaBg[0]),{scale:1,ease:'none',scrollTrigger:{trigger:'#feaWrap',start:'top bottom',end:'top top',scrub:true}});
  }

  // ---------- values: pinned, one value per step ----------
  const vl=$$('#valList li'),vn=$('#valNum');let cur=0;
  ScrollTrigger.create({trigger:'#vals',start:'top top',end:'bottom bottom',onUpdate:s=>{const i=Math.min(vl.length-1,Math.floor(s.progress*vl.length));$('#valProg').style.transform=`scaleX(${s.progress})`;
    if(i===cur)return;const dir=i>cur?1:-1;cur=i;vl.forEach((li,j)=>li.classList.toggle('on',j===i));
    gsap.timeline().to(vn,{yPercent:-110*dir,duration:.3,ease:'power2.in'}).add(()=>vn.textContent=pad(i+1)).set(vn,{yPercent:110*dir}).to(vn,{yPercent:0,duration:.45,ease:'power3.out'})}});

  // ---------- global reach: map dots sweep in west to east, pins drop, counters ----------
  ScrollTrigger.create({trigger:'#map',start:'top 80%',once:true,onEnter:()=>{gsap.to({p:0},{p:1,duration:2.2,ease:'power2.out',onUpdate(){mapP=this.targets()[0].p;drawMap()}});
    gsap.from('.pin',{scale:0,opacity:0,duration:.7,stagger:.15,delay:.8,ease:'back.out(2)'})}});
  ScrollTrigger.create({trigger:'.r-stats',start:'top 90%',once:true,onEnter:()=>nums.forEach(n=>{const o={v:0};gsap.to(o,{v:+n.dataset.to,duration:1.8,ease:'power3.out',onUpdate:()=>n.textContent=Math.round(o.v)})})});

  // ---------- team: cards stagger in from the right ----------
  gsap.from('.mate',{x:120,opacity:0,duration:1.1,stagger:.08,ease:'power4.out',scrollTrigger:{trigger:'#tmTrack',start:'top 85%'}});

  // ---------- CTA magnetic button ----------
  const mag=$('#mag');if(matchMedia('(hover:hover)').matches){mag.addEventListener('mousemove',e=>{const r=mag.getBoundingClientRect();gsap.to(mag,{x:(e.clientX-r.left-r.width/2)*.35,y:(e.clientY-r.top-r.height/2)*.35,duration:.4})});mag.addEventListener('mouseleave',()=>gsap.to(mag,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))}
  gsap.from('.cta-gem',{rotation:-20,scale:.8,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}});

  // ---------- footer curtain ----------
  const foot=$('.foot'),main=$('.main');
  const curtain=()=>{foot.classList.remove('curtain');main.style.marginBottom='';const h=foot.offsetHeight;if(innerWidth>=900&&h<innerHeight-40){foot.classList.add('curtain');main.style.marginBottom=h+'px'}ScrollTrigger.refresh()};
  addEventListener('load',curtain);addEventListener('resize',curtain);
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
