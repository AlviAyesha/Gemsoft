/* eslint-disable */
// Imported from the design page index.html by scripts/import-design.py. Edit the design and re-import.
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
  document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(menu.classList.contains('open'))setMenu(false);if(mega.classList.contains('open')){mega.classList.remove('open');megaBtn.setAttribute('aria-expanded',false);megaBtn.focus()}});
  // testimonials arrows
  const tt=$('#tTrack');const step=()=>tt.firstElementChild.getBoundingClientRect().width+16;
  $('#tPrev').addEventListener('click',()=>tt.scrollBy({left:-step(),behavior:'smooth'}));$('#tNext').addEventListener('click',()=>tt.scrollBy({left:step(),behavior:'smooth'}));
  // chips
  $$('.chip').forEach(c=>c.addEventListener('click',()=>$$('.chip').forEach(x=>x.setAttribute('aria-pressed',x===c))));

  const pre=$('#pre');
  if(reduce||!window.gsap||!window.ScrollTrigger){pre.remove();$('#heroB').style.opacity=1;return}
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Lenis smooth scroll ----------
  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.2});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length<2)return;const t=document.querySelector(id);if(!t)return;e.preventDefault();lenis.scrollTo(t)}))}

  // ---------- 4.1 preloader: dotted world map ----------
  // preloader: diamond outline draws, facets light up, then a shine sweeps across
  const gemLines=$$('#preGem .ln'),gemFacets=$$('#preGem .fc');
  // icon outline draws piece by piece (swoosh, flame, arc, then diamond facets), fill follows, lines fade out
  gemLines.forEach(l=>{const n=l.getTotalLength();l.style.strokeDasharray=n;l.style.strokeDashoffset=n;l.dataset.n=n});
  const clamp=v=>Math.max(0,Math.min(1,v)),N=gemLines.length;
  const drawGem=p=>{gemLines.forEach((l,i)=>{const t=clamp((p-i/N*.45)/.3);l.style.strokeDashoffset=l.dataset.n*(1-t);l.style.opacity=1-clamp((p-.8)/.2)*.85});
    gemFacets.forEach((f,i)=>f.style.opacity=clamp((p-.42-i/N*.3)/.2))};
  const nav=$('#nav');nav.classList.add('hide');
  if(lenis)lenis.stop();
  const po={p:0};
  const intro=gsap.timeline();
  intro.to(po,{p:1,duration:window.__vt?0:1.9,ease:'power1.inOut',onUpdate:()=>{drawGem(po.p);$('#preCount').textContent=Math.round(po.p*100)+'%';$('#preBar').style.transform=`scaleX(${po.p})`}})
    .fromTo('#gemShineBar',{opacity:1,x:0},{x:560,duration:window.__vt?0:.8,ease:'power2.inOut'})
    .to(pre,{yPercent:-100,duration:window.__vt?0:.9,ease:'power4.inOut'},window.__vt?'+=0':'+=.05')
    .from('#h1 .ln>span',{yPercent:110,duration:1.2,stagger:.1,ease:'power4.out'},'-=.35')
    .from('#heroCopy [data-fade]',{y:24,opacity:0,duration:.8,stagger:.1,ease:'power3.out'},'-=.8')
    .add(()=>nav.classList.remove('hide'),'<')
    .add(()=>{pre.remove();lenis&&lenis.start()});

  // ---------- 4.2 nav: hide on scroll down, show on up, logo -> icon ----------
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll();nav.classList.toggle('solid',y>40);nav.classList.toggle('compact',y>innerHeight*.6);nav.classList.toggle('hide',s.direction===1&&y>160&&!menu.classList.contains('open'))}});

  // ---------- smooth frame sequences: eased playhead + crossfade between neighbouring frames ----------
  function Seq(cv,urls,onFirst){const cx=cv.getContext('2d'),fr=[];let pos=0,target=0,last=-1,started=false;
    const ok=im=>im&&im.complete&&im.naturalWidth;
    const near=i=>{for(let d=0;d<fr.length;d++){if(ok(fr[i-d]))return fr[i-d];if(ok(fr[i+d]))return fr[i+d]}return null};
    const paint=im=>{const cw=cv.width,ch=cv.height,k=Math.max(cw/im.naturalWidth,ch/im.naturalHeight),w=im.naturalWidth*k,h=im.naturalHeight*k;cx.drawImage(im,(cw-w)/2,(ch-h)/2,w,h)};
    const render=()=>{const i=Math.floor(pos),f=pos-i,a=ok(fr[i])?fr[i]:near(i);if(!a)return;cx.globalAlpha=1;paint(a);if(f>.01&&ok(fr[i+1])&&a===fr[i]){cx.globalAlpha=f;paint(fr[i+1]);cx.globalAlpha=1}last=pos};
    const fit=()=>{const r=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);render()};
    const load=()=>{if(started)return;started=true;urls.forEach((u,i)=>{const im=new Image();im.decoding='async';im.onload=i===0?()=>{fit();onFirst&&onFirst()}:()=>{if(Math.abs(i-pos)<2)render()};im.src=u;fr.push(im)})};
    gsap.ticker.add(()=>{const d=target-pos;if(Math.abs(d)<.001){if(last!==target&&started){pos=target;render()}return}pos+=d*.16;render()});
    addEventListener('resize',()=>started&&fit());
    return {load,set:p=>{target=Math.max(0,Math.min(1,p))*(urls.length-1)}}}
  const urlsOf=(dir,n)=>Array.from({length:n},(_,i)=>`media/${dir}/f${String(i).padStart(3,'0')}.webp`);

  // ---------- 4.3 hero: frame sequence scrubbed by scroll ----------
  const heroSeq=Seq($('#heroCanvas'),(mobile?urlsOf('hero-d',120).filter((u,i)=>i%2===0):urlsOf('hero-d',120)),()=>$('#heroMedia').classList.add('live'));heroSeq.load();
  const ht=gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:.5,onUpdate:s=>heroSeq.set(s.progress)}});
  ht.to('#heroCopy',{y:-80,opacity:0,duration:.22,ease:'none'},.12)
    .to('.scroll-hint',{opacity:0,duration:.1},.05)
    .to('#heroB',{opacity:1,duration:.18,ease:'none'},.42)
    .to({},{duration:.5});

  // ---------- global: line-mask reveals on H2 ----------
  const split=el=>{const words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(w=>`<span class="w" style="display:inline-block">${w}</span>`).join(' ');
    const lines=[];let top=null;$$('.w',el).forEach(w=>{const t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(l=>`<span class="ln"><span>${l.join(' ')}</span></span>`).join('')};
  document.fonts.ready.then(()=>{$$('[data-reveal]').forEach(el=>{split(el);gsap.from($$('.ln>span',el),{yPercent:110,duration:1.1,stagger:.08,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 85%'}})});ScrollTrigger.refresh()});

  // ---------- 4.4 assembly + counters + live scroll-speed counter ----------
  const pieces=$$('.pc'),steps=$$('#steps li'),pill=$('#pill'),canvas=$('#canvas'),nums=$$('[data-to]');
  const k=mobile?0.45:1;
  const setStats=p=>nums.forEach(n=>{n.textContent=Math.round(+n.dataset.to*p)+n.dataset.suffix});
  const setStep=p=>steps.forEach((s,i)=>s.classList.toggle('on',p>=[0.02,0.3,0.55,0.86][i]));
  pieces.forEach(el=>{const [x,y,r]=el.dataset.from.split(',').map(Number);gsap.set(el,{x:x*k,y:y*k,rotation:r})});
  setStats(0);
  const tl=gsap.timeline({defaults:{ease:'power2.inOut'},scrollTrigger:{trigger:'#track',start:'top top',end:'bottom bottom',scrub:.6,
    onUpdate:s=>{setStats(Math.min(1,s.progress/0.9));setStep(s.progress);const live=s.progress>0.9;pill.textContent=live?'Live':'Draft';pill.classList.toggle('live',live);canvas.classList.toggle('built',s.progress>0.8)}}});
  const lock=(sel,at,d=0.12)=>tl.to(sel,{x:0,y:0,rotation:0,duration:d},at);
  lock('.p-nav',0.02);lock('.p-head',0.14);lock('.p-sub',0.22,0.1);lock('.p-img',0.30,0.16);lock('.p-btn',0.46,0.1);
  lock('.c1',0.56,0.1);lock('.c2',0.63,0.1);lock('.c3',0.70,0.1);
  tl.to('#cursor',{left:'22%',top:'64%',duration:0.1,ease:'power1.inOut'},0.8)
    .to('.p-btn',{scale:0.92,duration:0.02},0.9).to('.p-btn',{scale:1,duration:0.03},0.92)
    .fromTo('#click',{opacity:0.9,scale:0.4},{opacity:0,scale:1.8,duration:0.06,immediateRender:false},0.9)
    .to({},{duration:0.04},0.96);
  let vel=0,shown=0;const velEl=$('#vel');
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{vel=Math.abs(s.getVelocity())}});
  gsap.ticker.add(()=>{vel*=.92;shown+=(vel-shown)*.15;velEl.textContent=String(Math.min(9999,Math.round(shown))).padStart(4,'0')});

  // ---------- 4.5 services stagger ----------
  gsap.from('#svcGrid .svc',{y:60,opacity:0,duration:.9,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#svcGrid',start:'top 85%'}});

  // ---------- 4.7 why us: client video as a scroll-scrubbed frame sequence ----------
  const planeSeq=Seq($('#planeCanvas'),(mobile?urlsOf('plane-v',128).filter((u,i)=>i%2===0):urlsOf('plane-v',128)),()=>$('#whyMedia').classList.add('live'));
  ScrollTrigger.create({trigger:'#why',start:'top 300%',once:true,onEnter:planeSeq.load});
  ScrollTrigger.create({trigger:'#why',start:'top top',end:'bottom bottom',onUpdate:s=>planeSeq.set(s.progress)});
  $$('.why-card').forEach(c=>gsap.from(c,{y:60,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 88%'}}));

  // ---------- 4.8 ocean: video plays in view, ship crosses, fg clouds fast ----------
  const shipSeq=Seq($('#shipCanvas'),urlsOf('ship-v',120),()=>$('#sea').classList.add('live'));
  ScrollTrigger.create({trigger:'#work',start:'top 300%',once:true,onEnter:shipSeq.load});
  ScrollTrigger.create({trigger:'#work',start:'top 60%',end:'bottom bottom',onUpdate:s=>shipSeq.set(s.progress)});
  gsap.from('.oc',{y:50,opacity:0,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.ocean-cards',start:'top 85%'}});

  // ---------- 4.9 testimonials: drag to scroll ----------
  let dx=null,sl=0;tt.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dx=e.clientX;sl=tt.scrollLeft;tt.style.scrollSnapType='none'});
  addEventListener('pointermove',e=>{if(dx!==null)tt.scrollLeft=sl-(e.clientX-dx)});addEventListener('pointerup',()=>{if(dx!==null){dx=null;tt.style.scrollSnapType=''}});
  gsap.from('.t-card',{y:40,opacity:0,duration:.8,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'#tTrack',start:'top 85%'}});

  // ---------- 4.11 insights ----------
  gsap.from('.post',{y:50,opacity:0,duration:.8,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.ins-grid',start:'top 85%'}});

  // ---------- 4.12 FAQ: height auto + plus -> x ----------
  $$('#faqList details').forEach(d=>{const s=$('summary',d),a=$('.a',d);s.addEventListener('click',e=>{e.preventDefault();
    if(d.open){gsap.to(a,{height:0,opacity:0,duration:.45,ease:'power3.inOut',onComplete:()=>{d.open=false;gsap.set(a,{clearProps:'all'})}});d.classList.remove('o')}
    else{d.open=true;gsap.fromTo(a,{height:0,opacity:0},{height:'auto',opacity:1,duration:.55,ease:'power3.out',clearProps:'height'})}})});

  // ---------- 4.13 CTA magnetic button ----------
  const mag=$('#mag');if(matchMedia('(hover:hover)').matches){mag.addEventListener('mousemove',e=>{const r=mag.getBoundingClientRect();gsap.to(mag,{x:(e.clientX-r.left-r.width/2)*.35,y:(e.clientY-r.top-r.height/2)*.35,duration:.4})});mag.addEventListener('mouseleave',()=>gsap.to(mag,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))}
  gsap.from('.cta-gem',{rotation:-20,scale:.8,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}});

  // ---------- 4.14 footer curtain: page slides up to uncover a fixed footer ----------
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


// 4.6 RELIABILITY (rebuilt from trionn's "Our services" scroll scene, chunk 0sue_k2sp00no.js):
// the section sticks for five screens. White fades to black, the GEMSOFT gem turns frame by frame with the scroll,
// the tagline swaps letter by letter, the big words break into letters that fly off in 3D (a few grow huge and drift to the middle),
// then six cards sweep in pairs: left cards rise from the bottom-left, right cards drop from the top-right, and their line icons draw.
(()=>{
const sec=document.getElementById('rel');if(!sec||document.documentElement.classList.contains('rm'))return;
const $=(s,r=sec)=>r.querySelector(s),$$=(s,r=sec)=>[...r.querySelectorAll(s)];
const cv=$('.rs-gem'),cx=cv.getContext('2d'),flash=$('.rs-flash'),glow=$('.rs-glow'),copy=$('.rs-copy'),words=$('.rs-words');
const cards=$$('.rs-card'),tags=$$('.rs-tags p');
const N=+cv.dataset.frames,frames=new Array(N);let loaded=0,loading=false;
const R=(a,b)=>a+Math.random()*(b-a),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mob=()=>innerWidth<768;

// ---------- gem frames: 12 sprite sheets of 10 frames (2 across, 5 down), loaded when the section gets close ----------
const PER=+cv.dataset.per,FW=1280,FH=720,sheets=[];
const load=()=>{if(loading)return;loading=true;for(let k=0;k*PER<N;k++){const im=new Image();im.decoding='async';im.src=cv.dataset.src.replace('##',String(k).padStart(2,'0'));sheets[k]=im;im.onload=()=>{loaded++;shown=-1;draw(want)}}};
let shown=-1,want=0;
const ready=i=>{const im=sheets[Math.floor(i/PER)];return im&&im.complete&&im.naturalWidth};
const draw=k=>{want=k;const i=Math.round(k);if(i===shown)return;let f=i;if(!ready(f)){f=-1;for(let d=1;d<N;d++){if(i-d>=0&&ready(i-d)){f=i-d;break}if(i+d<N&&ready(i+d)){f=i+d;break}}}if(f<0)return;
  if(cv.width!==FW){cv.width=FW;cv.height=FH}const n=f%PER;cx.clearRect(0,0,FW,FH);cx.drawImage(sheets[Math.floor(f/PER)],(n%2)*FW,Math.floor(n/2)*FH,FW,FH,0,0,FW,FH);shown=f===i?i:-1};

// ---------- tagline: letters blur out, the second line blurs in ----------
const split=p=>{const t=p.textContent;p.textContent='';const out=[];t.split(' ').forEach((w,k)=>{if(k)p.appendChild(document.createTextNode(' '));const wd=document.createElement('span');wd.style.whiteSpace='nowrap';p.appendChild(wd);[...w].forEach(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c;wd.appendChild(s);out.push(s)})});return out};
const tagA=split(tags[0]),tagB=split(tags[1]);

// ---------- big words break apart: every letter becomes a flying particle ----------
let flyer=null,parts=[];
const letters=()=>{const out=[];$$('span',words).forEach(line=>{const n=line.firstChild;if(!n||n.nodeType!==3)return;const st=getComputedStyle(line),txt=n.textContent,up=txt.toUpperCase(),rg=document.createRange();
  for(let i=0;i<txt.length;i++){rg.setStart(n,i);rg.setEnd(n,i+1);const r=rg.getBoundingClientRect();if(r.width||r.height)out.push({ch:up[i],x:r.left+r.width/2,y:r.top+r.height/2,size:parseFloat(st.fontSize),font:st.fontFamily,weight:st.fontWeight,color:st.color})}});return out};
const burst=()=>{calm();flyer=document.createElement('div');flyer.className='rs-flyer';document.body.appendChild(flyer);
  const L=letters(),M=Math.max(innerWidth,innerHeight),hero=new Set;const h=Math.round(R(2,3));while(hero.size<Math.min(h,L.length))hero.add(Math.floor(Math.random()*L.length));
  parts=L.map((l,i)=>{const big=hero.has(i),el=document.createElement('span');el.textContent=l.ch;
    el.style.cssText=`font-family:${l.font};font-weight:${l.weight};font-size:${l.size}px;color:${l.color}`;flyer.appendChild(el);const b=el.getBoundingClientRect(),a=R(-Math.PI,Math.PI);
    return {el,ox:l.x,oy:l.y,size:l.size,big,offX:-b.width/2,offY:-b.height/2,tx:big?innerWidth/2+R(-.15,.15)*innerWidth:0,ty:big?innerHeight/2+R(-.15,.15)*innerHeight:0,
      grow:big?R(6,10):1,dx:Math.cos(a),dy:Math.sin(a)*R(-1,.18),sp:big?R(.05,.15)*M:R(.4,.9)*M,rx:R(-360,360),ry:R(-360,360),rz:big?R(-15,15):R(-180,180),fade:R(0,.3)}});
  fly(0)};
const fly=t=>parts.forEach(p=>{const x=p.big?p.ox+(p.tx-p.ox)*t:p.ox+p.dx*p.sp*t,y=p.big?p.oy+(p.ty-p.oy)*t:p.oy+p.dy*p.sp*t;
  const o=p.big?(t<.15?t/.15:t>.7?1-(t-.7)/.3:1):(t<p.fade+.3?1:Math.max(0,1-(t-p.fade-.3)/.35));
  const s=p.big?1+(p.grow-1)*Math.min(1,t/.5):1,sx=Math.cos(p.ry*t*Math.PI/180),sy=p.big?1:Math.cos(p.rx*t*Math.PI/180);
  p.el.style.opacity=Math.max(0,o);p.el.style.transform=`translate(${x+p.offX*s}px,${y+p.offY*s}px) rotate(${p.rz*t}deg) scale(${sx*s},${sy*s})`});
const calm=()=>{flyer&&flyer.remove();flyer=null;parts=[]};

// ---------- cards: pairs sweep in on curved paths (phones: one by one, straight up) ----------
let size={w:0,h:0};
const sizeCards=()=>{const W=innerWidth,H=innerHeight,m=mob(),mid=W>=768&&W<1512,g=m?24:40;size=m?{w:W-2*g,h:Math.round(.55*(W-2*g))}:{w:Math.round((mid?.42:.28)*W),h:Math.round(.32*H)};
  if(!m)size.h=Math.max(size.h,250);if(m)size.h=Math.max(size.h,230);cards.forEach(c=>{c.style.width=size.w+'px';c.style.height=size.h+'px'})};
const fade=a=>a<.15?a/.15:a>.85?1-(a-.85)/.15:1;
const drawn=new Set;
const icon=c=>{if(drawn.has(c))return;drawn.add(c);$$('path',c).forEach((p,i)=>{const L=p.getTotalLength();p.style.transition='none';p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();
  p.style.transition=`stroke-dashoffset 1.5s linear ${i*.04}s`;p.style.strokeDashoffset=0})};
const hideIcons=()=>{drawn.clear();$$('.rs-card path').forEach(p=>{const L=p.getTotalLength();p.style.transition='none';p.style.strokeDasharray=L;p.style.strokeDashoffset=L})};
const placeCards=l=>{const W=innerWidth,H=innerHeight,{w,h}=size,m=mob(),mid=W>=768&&W<1512,g=m?24:40;
  if(m){const T=.12*5+.3,t=l*T;cards.forEach((c,i)=>{const a=clamp((t-.12*i)/.3);c.style.opacity=a>0&&a<1?fade(a):0;c.style.transform=`translate(${(W-w)/2}px,${H+a*(-h-H)}px)`;if(t>=.12*i+.09)icon(c)});return}
  const T=.85,t=l*T;cards.forEach((c,i)=>{const pair=Math.floor(i/2),left=i%2===0,a=clamp((t-.2*pair)/.45),d=a<=.5?Math.sin(a*Math.PI):1;let x,y;
    if(left){const x0=-.7*w,x1=mid?g:.1*W;x=x0+d*(x1-x0);y=H+a*(-h-H)}else{const x0=W-.3*w,x1=mid?W-g-w:.9*W-w;x=x0+d*(x1-x0);y=-h+a*(H+h)}
    c.style.opacity=a>0&&a<1?fade(a):0;c.style.transform=`translate(${x}px,${y}px)`;if(t>=.2*pair+.135)icon(c)})};

// ---------- scroll loop ----------
const prog=()=>{const r=sec.getBoundingClientRect(),run=sec.offsetHeight-innerHeight;return run>0?clamp(-r.top/run):0};
let idx=0,cardsT=0,inZone=false,live=false,lastT=-1,wordsShown=true;
const showWords=v=>{if(v!==wordsShown){words.style.opacity=v?1:0;wordsShown=v}};
const tick=()=>{if(!live)return;requestAnimationFrame(tick);const T=prog();
  flash.style.opacity=T<=0?1:T>=.12?0:1-T/.12;
  const e=clamp((T-.01)/.12),col=Math.round(216+39*e);copy.style.color=`rgb(${col},${col},${col})`;copy.classList.toggle('rs-plain',T>=.12);
  tagA.forEach((c,i)=>{const a=clamp((e-i/tagA.length*.3)/.2);c.style.opacity=1-a;c.style.filter=`blur(${12*a}px)`});
  tagB.forEach((c,i)=>{const a=clamp((e-.5-i/tagB.length*.3)/.2);c.style.opacity=a;c.style.filter=`blur(${(1-a)*12}px)`});
  cv.style.opacity=clamp(T/.08);glow.style.opacity=.5*clamp((T-.04)/.08);
  idx+=((N-1)*T-idx)*.12;draw(idx);
  const z=T>=.35&&T<=.53;if(z&&!inZone)burst();if(!z&&inZone)calm();inZone=z;
  if(z){fly((T-.35)/.18);showWords(false)}else showWords(T<.35);
  cardsT+=(T-cardsT)*.08;
  if(cardsT<.56){if(lastT>=.56)hideIcons();cards.forEach(c=>c.style.opacity=0)}else placeCards(Math.min(1,(cardsT-.56)/.44));lastT=cardsT};
sizeCards();hideIcons();
new IntersectionObserver(([en])=>{const was=live;live=en.isIntersecting;if(live){load();if(!was)requestAnimationFrame(tick)}else calm(),inZone=false},{rootMargin:'100% 0px'}).observe(sec);
addEventListener('resize',()=>{sizeCards();calm();inZone=false});
})();


}
