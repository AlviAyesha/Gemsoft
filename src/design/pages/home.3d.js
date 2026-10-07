/* eslint-disable */

// 4.8b WORK IN MOTION (trionn "Exploring ideas through daily design practice"):
// the section sticks for 6.5 screens; project photos ride a rising 3D spiral as a bent film strip with two lines drawing along its edges,
// the big words slide across, then six photos fly in from the edges, wave like flags and settle into a grid; five stripes wipe up into the next section.
import * as THREE from 'three';
(()=>{
const sec=document.getElementById('hOrbit');if(!sec)return;
const $=(s,r=sec)=>r.querySelector(s),$$=(s,r=sec)=>[...r.querySelectorAll(s)];
const HEL=JSON.parse(sec.dataset.helix),GRID=JSON.parse(sec.dataset.grid);
const fail=()=>sec.classList.add('ho-static');
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return fail();
const canvas=$('.ho-cv'),title=$('.ho-title'),stripes=$$('.ho-stripes i');
let R;try{R=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true})}catch(e){return fail()}
R.setPixelRatio(Math.min(2,devicePixelRatio||1));R.setSize(innerWidth,innerHeight,false);R.setClearColor(0x000000,0);

// ---------- sizes (trionn values: desktop / tablet / phone) ----------
const mob=()=>innerWidth<768,tab=()=>innerWidth>=768&&innerWidth<1200,wide=()=>innerWidth>=1440;
const fov=()=>mob()?58:tab()?54:52,camZ=()=>mob()?28:tab()?24:22,cols=()=>mob()?2:3,rows=()=>mob()?3:2;
const colGap=()=>mob()?.18:tab()?.28:wide()?.5:.38,rowGap=()=>mob()?.22:tab()?.36:wide()?.7:.55;
const AR=2/3; // our photos are 3:2
const halfH=()=>Math.tan(fov()*Math.PI/360)*camZ(),halfW=()=>halfH()*innerWidth/innerHeight;
const tileW=()=>{const r=cols(),n=rows();return Math.min((2*halfW()*(mob()?.88:tab()?.84:wide()?.78:.8)-(r-1)*colGap())/r,(2*halfH()*(mob()||tab()?.82:wide()?.78:.8)-(n-1)*rowGap())/n/AR,mob()?99:tab()?8.5:9.2)};
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(fov(),innerWidth/innerHeight,.1,500);cam.position.set(0,0,camZ());cam.lookAt(0,0,0);

// ---------- the spiral: radius 12, two turns rising 28 units, with a soft dip in the middle ----------
const TURN=4*Math.PI,RAD=12,b=28/TURN,V=2*Math.PI,ARC=Math.sqrt(RAD*RAD+b*b),LEN=TURN*ARC;
const SW=5.8,GAP=6.2,N=HEL.length,STRIP=(N-1)*GAP+SW,SH=SW*AR;
const q=t=>{const d=(t-V)/2;return new THREE.Vector3(RAD*Math.cos(t),-16+t*b-2.5*Math.exp(-d*d),RAD*Math.sin(t))};
const tan=t=>{const d=(t-V)/2;return new THREE.Vector3(-RAD*Math.sin(t),b+d*2.5*Math.exp(-d*d),RAD*Math.cos(t)).normalize()};
const across=t=>{const v=new THREE.Vector3().crossVectors(tan(t),new THREE.Vector3(Math.cos(t),0,Math.sin(t))).normalize();v.y+=.6;return v.normalize()};
const PHASE=400/600,GRID_AT=(.5*LEN+STRIP+10)/(LEN+STRIP)*PHASE;

const loader=new THREE.TextureLoader();
const tex=src=>{const t=loader.load(src);t.minFilter=t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;return t};
const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';

// film strip: one bent plane per photo, mirrored on the side facing us so the photo always reads the right way round
const strip=HEL.map(src=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1,116,1),new THREE.ShaderMaterial({uniforms:{map:{value:tex(src)}},vertexShader:VS,
  fragmentShader:'uniform sampler2D map;varying vec2 vUv;void main(){vec2 uv=vUv;if(gl_FrontFacing)uv.x=1.0-uv.x;gl_FragColor=texture2D(map,uv);}',side:THREE.DoubleSide}));
  m.visible=false;m.frustumCulled=false;m.renderOrder=1;m.userData.hover=1;scene.add(m);return m});
const bend=(m,t,s)=>{const p=m.geometry.attributes.position,uv=m.geometry.attributes.uv,a=SW*s,o=t+2.9-.5*a,w=SH*s,first=!m.userData.uv;
  for(let e=0;e<117;e++){const f=e/116,r=(o+f*a)/ARC,c=q(r),x=across(r);
    for(let k=0;k<2;k++){const h=(k?.5:-.5)*w,i=117*k+e;p.setXYZ(i,c.x+x.x*h,c.y+x.y*h,c.z+x.z*h);first&&uv.setXY(i,f,k)}}
  p.needsUpdate=true;if(first){uv.needsUpdate=true;m.userData.uv=1}};

// two grey lines run along the strip's edges; the lower one enters from the top of the screen
const lineMat=new THREE.LineBasicMaterial({color:0x9E9E9E});
let edgeA,edgeB,TRAIL=86;
const buildEdges=()=>{edgeA&&scene.remove(edgeA);edgeB&&scene.remove(edgeB);
  const off=.5*SH+4/innerHeight*2*halfH()+.12*SH,U=[],D=[];
  for(let e=0;e<=600;e++){const r=e/600*TURN,c=q(r),x=across(r);U.push(c.clone().addScaledVector(x,off));D.push(c.clone().addScaledVector(x,-off))}
  U.reverse();D.reverse();
  const h=halfH(),p0=D[0],dir=p0.clone().sub(D[1]).normalize(),k=(h-p0.y)/dir.y,ext=[];
  for(let e=20;e>=1;e--)ext.push(p0.clone().addScaledVector(dir,e/20*k));D.unshift(...ext);
  edgeA=new THREE.Line(new THREE.BufferGeometry().setFromPoints(U),lineMat);edgeB=new THREE.Line(new THREE.BufferGeometry().setFromPoints(D),lineMat);
  [edgeA,edgeB].forEach(l=>{l.frustumCulled=false;l.renderOrder=5;l.geometry.setDrawRange(0,0);scene.add(l)})};

// grid: six photos with rounded corners that fly in from the sides and wave like flags until they settle
const FS='uniform sampler2D map;uniform vec2 uSize;uniform float uRadius;varying vec2 vUv;void main(){vec2 px=(vUv-0.5)*uSize;vec2 q=abs(px)-uSize*0.5+uRadius;float d=min(max(q.x,q.y),0.0)+length(max(q,0.0))-uRadius;float a=1.0-smoothstep(-0.5,0.5,d);if(a<=0.0)discard;vec4 c=texture2D(map,vUv);gl_FragColor=vec4(c.rgb,c.a*a);}';
const gridTex=GRID.map(g=>tex(g.src));let tiles=[],A=0,H=0,C=3;
const buildTiles=()=>{tiles.forEach(t=>scene.remove(t));A=tileW();H=A*AR;C=cols();
  const ppu=innerHeight/(2*halfH()),size=new THREE.Vector2(A*ppu,H*ppu);
  tiles=gridTex.map((t,i)=>{const g=new THREE.PlaneGeometry(A,H,20,12),m=new THREE.Mesh(g,new THREE.ShaderMaterial({uniforms:{map:{value:t},uSize:{value:size},uRadius:{value:8}},vertexShader:VS,fragmentShader:FS,side:THREE.DoubleSide,transparent:true}));
    const pa=g.attributes.position.array,n=pa.length/3,rx=new Float32Array(n),ry=new Float32Array(n);for(let e=0;e<n;e++){rx[e]=pa[3*e];ry[e]=pa[3*e+1]}
    m.userData={rx,ry,wave:1,waveT:0,flat:false,i,href:GRID[i].href};m.visible=false;m.renderOrder=3;m.frustumCulled=false;scene.add(m);return m})};
const wave=(m,amt,t,idx)=>{const p=m.geometry.attributes.position,{rx,ry}=m.userData,col=idx%C,row=Math.floor(idx/C),mid=col>0&&col<C-1;
  for(let e=0;e<p.count;e++){const x=rx[e],y=ry[e];let n;
    if(mid)n=1-(y/H+.5);else{const u=x/A+.5,v=1-(y/H+.5);n=col===0?(row===0?u+v:u+1-v)*.5:(row===0?1-u+v:1-u+1-v)*.5}
    p.setXYZ(e,x,y,amt*n*Math.sin(n*Math.PI*.9-2*t)*A*.12)}p.needsUpdate=true};
const slot=i=>{const r=rows(),o=colGap(),s=rowGap();return new THREE.Vector3(-(.5*(C*A+(C-1)*o))+.5*A+(i%C)*(A+o),.5*(r*H+(r-1)*s)-.5*H-Math.floor(i/C)*(H+s),0)};

// thin lines between the grid rows draw across
const sepMat=new THREE.LineBasicMaterial({color:0x9E9E9E,transparent:true});
const row=(y,rev)=>{const w=halfW(),m=mob()?0:w*(80/innerWidth),l=-w+m,r=w-m,pts=[];for(let e=0;e<=600;e++){const f=e/600;pts.push(new THREE.Vector3(rev?r-f*(r-l):l+f*(r-l),y,0))}return pts};
const sepA=new THREE.Line(new THREE.BufferGeometry().setFromPoints(row(0)),sepMat),sepB=new THREE.Line(new THREE.BufferGeometry().setFromPoints(row(0)),sepMat);
[sepA,sepB].forEach(l=>{l.frustumCulled=false;l.renderOrder=5;l.geometry.setDrawRange(0,0);scene.add(l)});let sepSet=false;

const build=()=>{cam.fov=fov();cam.aspect=innerWidth/innerHeight;cam.position.set(0,0,camZ());cam.updateProjectionMatrix();R.setSize(innerWidth,innerHeight,false);
  buildEdges();buildTiles();sepSet=false};
build();

// ---------- scroll: section top -> how far through its sticky run ----------
const mainPart=()=>{const run=sec.offsetHeight-innerHeight;return run>0?(mob()?3:5)*innerHeight/run:1};
const prog=()=>{const r=sec.getBoundingClientRect(),run=sec.offsetHeight-innerHeight;return run>0?Math.max(0,Math.min(1,-r.top/run)):0};

// big words slide across while the strip turns (trionn: top word to the right, bottom word to the left)
if(window.gsap&&window.ScrollTrigger){
  const span=()=>innerHeight*((mob()?1.5:5)+1)*GRID_AT+innerHeight/2;
  gsap.timeline({scrollTrigger:{trigger:sec,start:'top center',end:()=>'+='+span(),scrub:.6,invalidateOnRefresh:true}})
    .to('.ho-top',{x:'100vw',ease:'none'},0).to('.ho-bot',{x:'-100vw',ease:'none'},0);
  // title words blur in when the section arrives
  const words=title.innerHTML.split('<br>').map(l=>l.trim().split(/\s+/).map(w=>`<span class="wd">${w}</span>`).join(' ')).join('<br>');title.innerHTML=words;
  gsap.set($$('.wd',title),{autoAlpha:0,filter:'blur(10px)'});
  ScrollTrigger.create({trigger:sec,start:'top 60%',once:true,onEnter:()=>gsap.to($$('.wd',title),{autoAlpha:1,filter:'blur(0px)',duration:.7,stagger:.05,ease:'power2.out'})});
  gsap.from('.ho-foot>*',{autoAlpha:0,y:24,duration:.9,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:sec,start:'top 30%'}});
}

// ---------- pointer: hover lifts a strip photo; a grid photo opens its project ----------
const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();let inside=false,overTile=null;
sec.addEventListener('pointermove',e=>{ptr.x=e.clientX/innerWidth*2-1;ptr.y=-(e.clientY/innerHeight)*2+1;inside=true});
sec.addEventListener('pointerleave',()=>{inside=false;overTile=null;sec.classList.remove('tile-hover')});
sec.addEventListener('click',e=>{if(overTile&&!e.target.closest('a,button'))location.href=overTile.userData.href});

// ---------- render loop: runs only while the section is near the screen ----------
let last=0,live=false,lineA=0,lineB=0,smooth=null;
const frame=now=>{if(!live)return;requestAnimationFrame(frame);const dt=last?Math.min((now-last)/1000,.05):1/60;last=now;
  const raw=prog(),mp=mainPart();
  smooth=smooth===null?raw:smooth+(raw-smooth)*(1-Math.pow(.001,dt));
  const run=sec.offsetHeight-innerHeight,endP=run>0?(run-innerHeight)/run:1,g=Math.min(smooth/mp,1),stripeP=Math.max(0,Math.min(1,(raw-mp)/(endP-mp)));
  // stripes wipe up into the next section
  const st=stripeP*.7;stripes.forEach((s,n)=>{const a=.3*(stripes.length-1-n)/(stripes.length-1);s.style.transform=`scaleY(${Math.max(0,Math.min(1,(st-a)/.3))})`});
  // edge lines: a short trail travels down the spiral
  const P=Math.min(1,g/PHASE),ta=P*(601+TRAIL),tb=P*(621+TRAIL),k=1-Math.pow(.01,dt);
  lineA+=(ta-lineA)*k;lineB+=(tb-lineB)*k;
  const ca=Math.floor(lineA),fa=Math.max(0,ca-TRAIL);edgeA.geometry.setDrawRange(fa,Math.max(0,Math.min(ca,601)-fa+1));
  const cb=Math.floor(lineB),fb=Math.max(0,cb-TRAIL);edgeB.geometry.setDrawRange(fb,Math.max(0,Math.min(cb,621)-fb+1));
  // photos travel up the spiral
  const head=P*(LEN+STRIP)-STRIP+25;
  strip.forEach((m,e)=>{const t=head+GAP*e,on=P<1&&t>0&&t<LEN;m.visible=on;if(on)bend(m,Math.min(t,LEN-.001),m.userData.hover)});
  let hit=null,tileHit=null;
  if(inside){ray.setFromCamera(ptr,cam);const v=strip.filter(m=>m.visible);if(v.length){const h=ray.intersectObjects(v,false);if(h.length)hit=h[0].object}
    const vt=tiles.filter(m=>m.visible&&m.userData.wave<.5);if(vt.length){const h=ray.intersectObjects(vt,false);if(h.length)tileHit=h[0].object}}
  const kk=1-Math.pow(.001,dt);strip.forEach(m=>{const to=m===hit&&m.visible?1.12:1;m.userData.hover+=(to-m.userData.hover)*kk});
  if(tileHit!==overTile){overTile=tileHit;sec.classList.toggle('tile-hover',!!tileHit)}
  // grid phase
  const Hp=Math.max(0,Math.min(1,(g-GRID_AT)/(1-GRID_AT)));
  title.style.opacity=String(Math.max(0,1-4*Hp));
  if(Hp>0&&!sepSet){const n=rows(),gp=rowGap(),tot=n*H+(n-1)*gp;
    if(mob()){sepA.geometry.setFromPoints(row(.5*tot-H-.5*gp,false));sepB.geometry.setFromPoints(row(.5*tot-2*H-1.5*gp,true))}
    else{sepA.geometry.setFromPoints(row(0,false));sepB.geometry.setFromPoints(row(0,false))}sepSet=true}
  if(sepSet){const e=1-Math.pow(1-Math.max(0,Math.min(1,(Hp-.2)/.8)),2.5);sepA.geometry.setDrawRange(0,Math.round(600*e));
    if(mob()){const f=Math.max(0,Math.min(1,(Hp-.28)/.72));sepB.geometry.setDrawRange(0,Math.round((1-Math.pow(1-f,2.5))*600))}else sepB.geometry.setDrawRange(0,0)}
  const hh=halfH(),hw=halfW();
  tiles.forEach((m,e)=>{const r=Math.max(0,Math.min(1,(Hp-.08*e)/.4));if(r<=0&&m.userData.wave>=1){m.visible=false;return}m.visible=true;
    const n=1-Math.pow(1-r,3),to=slot(e),col=e%C,fy=e<C?hh+2*H:-hh-2*H,fx=col===0?-hw-2*A:col===C-1?hw+2*A:to.x;
    m.position.set(fx+(to.x-fx)*n,fy+(to.y-fy)*n,0);
    const s=m===overTile?1.04:1;m.scale.x+=(s-m.scale.x)*kk;m.scale.y=m.scale.x;
    m.userData.waveT+=1.08*dt;m.userData.wave=r<1?Math.min(1,m.userData.wave+1.8*dt):Math.max(0,m.userData.wave-.72*dt);
    if(m.userData.wave>0){wave(m,m.userData.wave,m.userData.waveT,e);m.userData.flat=false}else if(!m.userData.flat){wave(m,0,0,e);m.userData.flat=true}});
  R.render(scene,cam)};
new IntersectionObserver(([en])=>{const was=live;live=en.isIntersecting;if(live&&!was){last=0;requestAnimationFrame(frame)}},{rootMargin:'100% 0px'}).observe(sec);
let rz=0;addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(build)});
})();

