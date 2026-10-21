const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/mobile-sequence.js'),'utf8');
for(const [w,h]of [[320,568],[375,812],[390,844],[768,1024]]){
 let y=0,frames=[],listeners={},paint=[],roomMounts=0;const hh=71,ch=h-hh;
 class E{
  constructor(name=''){this.name=name;this.children=[];this.style={setProperty(k,v){this[k]=v}};this.dataset={};this.attrs={};this.innerHTML='';this.textContent='';this.classList={add(){},remove(){}}}
  append(...xs){for(const x of xs){x.remove();this.children.push(x);x.parent=this}}
  before(x){const i=this.parent.children.indexOf(this);x.remove();this.parent.children.splice(i,0,x);x.parent=this.parent}
  remove(){if(this.parent){const i=this.parent.children.indexOf(this);this.parent.children.splice(i,1);this.parent=null}}
  replaceChildren(...xs){for(const c of [...this.children])c.remove();this.append(...xs)}
  replaceWith(x){this.before(x);this.remove()}
  setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]||''}
  get childNodes(){return this.children}
  querySelector(s){if(this.name==='hero'&&s==='h1')return title;return this.children.find(c=>s==='a'&&c.name==='a')||null}
  get offsetHeight(){return this.name==='hero'?ch:this.name==='stage'?parseFloat(this.style.height)||ch:32}
  get offsetWidth(){return this.name.startsWith('info')?[260,310,330,200][Number(this.name.slice(4))]:w-48}
  getBoundingClientRect(){let top=0,height=ch,left=0,width=w;
   if(this.name==='header'){top=10;height=61}
   if(this.className==='hero-scroll'){top=hh-y;height=parseFloat(this.style.height)||ch}
   if(this.name==='hero')top=hh-Math.max(0,y-rotate-bridge);
   if(this.name==='gap'){top=hh-Math.max(0,y-rotate-bridge)+150;height=Math.max(125,ch-400);left=24;width=w-48}
   if(this.name==='stage'){top=stageStart-y;height=this.offsetHeight}
   if(this.name==='services')top=stageStart+total-y;
   if(this.name==='contact')top=stageStart+total+ch*2-y;
   if(this.name==='a'){left=9999;width=140}
   return{top,height,left,width,right:left+width,bottom:top+height}}
 }
 const root=new E('root'),host=new E('host'),main=new E('main'),hero=new E('hero'),gap=new E('gap'),title=new E('title'),intro=new E('intro'),layer=new E('layer'),tile=new E('tile'),grid=new E('grid'),flat=new E('flat'),stage=new E('stage'),sticky=new E('sticky'),scene=new E('scene'),copy=new E('copy'),oldRoom=new E('oldRoom');
 const services=new E('services'),contact=new E('contact'),header=new E('header'),bar=new E('bar'),call=new E('call');
 const infos=Array.from({length:4},(_,i)=>new E('info'+i));
 const original=new E('original');grid.append(original);host.append(layer,main);main.append(hero,stage,services,contact);hero.append(title,gap,intro);layer.append(tile);stage.append(sticky);sticky.append(scene,copy);scene.append(flat,oldRoom);flat.append(grid);copy.append(...infos);title.innerHTML='Original title';intro.innerHTML='Original intro';
 const rotate=Math.min(360,h*.44),bridge=h*.55,size=(ch-32)/5,travel=Math.max(0,7*size+48+(w/2-(size+8)-size/2)-w),carousel=Math.max(h*.8,travel*1.35),material=h*.28,build=h*.6,words=h*2.6,exit=h*.72,total=carousel+material+build+words+exit,stageStart=hh+rotate+bridge;
 root.scrollHeight=stageStart+total+ch*3;
 const nodes={'#haut':hero,'[data-hero-tile-space]':gap,'[data-stage]':stage,'[data-sticky]':sticky,'[data-grid]':grid,'[data-flat]':flat,'[data-scene]':scene,'[data-copy]':copy,'[data-tile]':tile,'[data-tilelayer]':layer,'.hero-intro':intro,'#savoir-faire':services,'#site-header':header,'[data-room]':oldRoom,'#mobile-call':call,'#contact':contact,'[data-progress]':bar};
 const doc={documentElement:root,querySelector:s=>nodes[s],querySelectorAll:s=>s==='[data-info]'?infos:[],createElement:s=>new E(s),createComment:()=>new E('comment'),fonts:{addEventListener(){},removeEventListener(){}}};
 class Room{constructor(){roomMounts++;this.canvas=new E('canvas');scene.append(this.canvas)}draw(...args){paint=args}}
 const context={document:doc,window:{innerWidth:w,innerHeight:h,get scrollY(){return y},addEventListener(n,f){listeners[n]=f},removeEventListener(){},QueroPortraitRoom:Room},requestAnimationFrame:f=>(frames.push(f),frames.length),cancelAnimationFrame(){frames=[]},ResizeObserver:class{observe(){}disconnect(){}},console};
 vm.runInNewContext(source,context);const sequence=new context.window.QueroMobileSequence;sequence.mount();
 const flush=()=>{const pending=frames;frames=[];pending.forEach(f=>f())};flush();
 assert.equal(roomMounts,0,'The room must not initialize during the hero paint');
 const snapshot=()=>JSON.stringify([tile.style,infos.map(x=>x.style),copy.children.at(-1).style,title.innerHTML,intro.innerHTML,grid.style]);
 const photoBlocks=grid.children.filter(x=>x.className==='mobile-photo-block');assert.equal(photoBlocks.length,6);
 const photoUrls=photoBlocks.map(x=>x.children[0].style.backgroundImage);assert.equal(new Set(photoUrls).size,6,'Every photo is unique');
 const occupied=new Set();
 for(const x of photoBlocks){assert(x.style.gridColumn.endsWith('/span 2')&&x.style.gridRow.endsWith('/span 2'),'Each photo spans four cells');
 const col=parseInt(x.style.gridColumn)-1,row=parseInt(x.style.gridRow)-1;assert(row>=0&&row+1<5);
 for(let dx=0;dx<2;dx++)for(let dy=0;dy<2;dy++){const key=`${col+dx},${row+dy}`;assert(!occupied.has(key),'Large photos must never overlap');occupied.add(key)}}
 assert(!occupied.has('1,2'),'The hero tile must have its own uncovered cell');
 const saved=new Map();let seen=infos.map(()=>0);
 for(let direction of [1,-1])for(let n=0;n<=240;n++){
  const t=direction===1?n:240-n;y=(stageStart+total)*t/240;listeners.scroll();flush();
  const g=gap.getBoundingClientRect(),side=parseFloat(tile.style.width),angle=Number(tile.style.transform.match(/rotate\(([-.\d]+)/)[1])*Math.PI/180,bbox=side*(Math.abs(Math.cos(angle))+Math.abs(Math.sin(angle)));
  assert(bbox<=g.height+.01,'Tile must stay in its reserved gap');assert.equal(layer.parent,y>=rotate+bridge?grid.children[7]:gap,'The same tile must dock in the middle material cell');
  if(saved.has(t))assert.equal(snapshot(),saved.get(t),'Reverse scroll must reproduce the same frame');else saved.set(t,snapshot());
  const elapsed=y-stageStart;
  if(elapsed>=carousel+material+build){assert(infos.some(x=>Number(x.style.opacity)>=.45),'Every room position must retain readable information');}
  infos.forEach((x,i)=>seen[i]=Math.max(seen[i],Number(x.style.opacity)));
  assert(!/NaN|Infinity/.test(JSON.stringify(paint)),'Room geometry must be finite');
 }
 assert(seen.every(x=>x>.99),'Every message must have a full-opacity hold');
 assert.equal(roomMounts,1,'The room initializes once, when needed, including reverse scroll');
 sequence.destroy();assert.equal(grid.children[0],original);assert.equal(hero.parent,main);assert.equal(layer.parent,host);assert.equal(title.innerHTML,'Original title');
 console.log(`PASS ${w}×${h}: 482 forward/back poses, bounded tile, continuous room copy, four readable holds and clean teardown`);
}
