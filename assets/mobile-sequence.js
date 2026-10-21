/* Portrait storyboard. Each part has its own scroll distance and readable hold. */
(() => {
'use strict';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
class MobileSequence {
 mount(){
  const q=s=>document.querySelector(s), root=document.documentElement;
  const hero=q('#haut'),gap=q('[data-hero-tile-space]'),stage=q('[data-stage]'),sticky=q('[data-sticky]');
  const grid=q('[data-grid]'),flat=q('[data-flat]'),scene=q('[data-scene]'),copy=q('[data-copy]');
  const tile=q('[data-tile]'),layer=q('[data-tilelayer]'),h1=hero.querySelector('h1'),intro=q('.hero-intro');
  const infos=[...document.querySelectorAll('[data-info]')],services=q('#savoir-faire'),header=q('#site-header');
  const original={grid:[...grid.childNodes],title:h1.innerHTML,intro:intro.innerHTML,heroStyle:hero.getAttribute('style'),layerStyle:layer.getAttribute('style'),stageStyle:stage.getAttribute('style')};
  const marker=document.createComment('hero tile layer');layer.before(marker);
  const wrap=document.createElement('div');wrap.className='hero-scroll';hero.before(wrap);wrap.append(hero);
  gap.append(layer);Object.assign(layer.style,{position:'absolute',inset:'0',width:'100%',height:'100%',overflow:'visible'});
  root.classList.add('mobile-sequence');
  const rows=5,columns=13,anchorColumn=1,anchorRow=2;
  const items=[
   ['Carrelage intérieur','carrelage-interieur.html','service-interieur.jpg',0,0],
   ['Faïence murale','faience-douche.html','reference-01.jpg',2,3],
   ['Douche à l’italienne','faience-douche.html#douche','service-faience.jpg',4,1],
   ['Terrasse et dallage','terrasse-carrelage.html','service-terrasse.jpg',6,3],
   ['Rénovation et neuf','carrelage-interieur.html#renovation','reference-02.jpg',8,0],
   ['Mosaïque','faience-douche.html#mosaique','reference-03.jpg',10,2]
  ];
  const cells=[],photos=[];grid.replaceChildren();
  for(let col=0;col<columns;col++)for(let row=0;row<rows;row++){
   const cell=document.createElement('div');cell.dataset.cell='1';
   cell.style.gridColumn=String(col+1);cell.style.gridRow=String(row+1);
   cells.push(cell);grid.append(cell);
  }
  const anchor=cells[anchorColumn*rows+anchorRow];anchor.dataset.heroContinuation='1';
  items.forEach(([label,url,photo,col,row])=>{
   const block=document.createElement('div');block.className='mobile-photo-block';
   block.style.gridColumn=(col+1)+'/span 2';block.style.gridRow=(row+1)+'/span 2';
   const a=document.createElement('a');a.className='tile-link tile-photo mobile-service-tile';a.href='./'+url;
   a.style.backgroundImage=`url('./assets/photos/${photo}')`;
   const arrow=document.createElement('span');arrow.className='mobile-tile-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
   const caption=document.createElement('span');caption.className='mobile-tile-label';
   const title=document.createElement('strong');title.textContent=label;
   const action=document.createElement('span');action.textContent='Voir la prestation';
   caption.append(title,action);a.append(arrow,caption);block.append(a);grid.append(block);
   photos.push({block,a,caption,arrow});
  });
  const status=document.createElement('p');status.className='room-build-copy';status.textContent='Carrelage et faïence.';copy.append(status);
  const room=new window.QueroPortraitRoom(scene);
  const oldRoom=q('[data-room]');oldRoom.style.display='none';
  let dims,frame=0,titleState=false,destroyed=false,docked=false;
  const location=hero.querySelector('.hero-location'),cta=hero.querySelector('.button-primary')?.parentElement;
  const measure=()=>{
   const w=window.innerWidth,h=window.innerHeight,hh=Math.ceil(header.getBoundingClientRect().height+10),ch=h-hh;
   root.style.setProperty('--header-height',hh+'px');root.style.setProperty('--sequence-overlap',ch+'px');
   root.style.setProperty('--mobile-cell',(ch-32)/5+'px');
   sticky.style.top=hh+'px';sticky.style.height=ch+'px';
   hero.style.position='sticky';hero.style.top=hh+'px';
   const heroHeight=hero.offsetHeight,rotate=Math.min(360,h*.44),bridge=h*.55;
   wrap.style.height=heroHeight+rotate+bridge+'px';
   stage.style.marginTop=-heroHeight+'px';
   const size=(ch-32)/5,width=columns*size+(columns-1)*8;
   const baseX=w/2-(anchorColumn*(size+8)+size/2),travel=Math.max(0,width+baseX-w);
   const carousel=Math.max(h*.8,travel*1.35),material=h*.28,build=h*.6,words=h*2.6,exit=h*.72;
   dims={w,h,hh,ch,size,width,travel,baseX,rotate,bridge,carousel,material,build,words,exit,total:carousel+material+build+words+exit};
   stage.style.height=ch+dims.total+'px';
   schedule();
  };
  const render=()=>{
   frame=0;if(destroyed||!dims)return;
   const d=dims,y=Math.max(0,window.scrollY),heroY=wrap.getBoundingClientRect().top+y-d.hh;
   const turn=clamp((y-heroY)/d.rotate),next=turn>.64;
   if(next!==titleState){
    titleState=next;
    h1.innerHTML=next?'<span class="hero-title-line">Carrelage</span><span class="hero-title-line">et faïence.</span>':original.title;
    intro.innerHTML=next?'Sols intérieurs, murs, douches et terrasses. Pascal Quéro vous accompagne, en rénovation et dans le neuf.':original.intro;
   }
   const bridge=clamp((y-heroY-d.rotate)/d.bridge),blend=smooth(bridge),copyBlend=smooth(bridge/.45);
   const swap=1-Math.max(0,1-Math.abs(turn-.64)/.075);
   h1.style.opacity=String(swap*(1-copyBlend));intro.style.opacity=String(swap*(1-copyBlend));
   if(location)location.style.opacity=String(1-copyBlend);
   if(cta){cta.style.opacity=String(1-copyBlend);cta.style.pointerEvents=bridge>.7?'none':'';}
   hero.style.backgroundColor=`rgba(255,255,255,${1-blend})`;hero.style.pointerEvents=bridge>.7?'none':'';
   const start=stage.getBoundingClientRect().top+y,elapsed=y-start;
   const bridgeActive=bridge>0&&elapsed<0;
   sticky.style.overflow=bridgeActive?'visible':'hidden';
   const offset=bridgeActive?Math.max(0,start-y-d.hh):0;
   scene.style.transform=offset?`translateY(${-offset}px)`:'none';
   const pan=smooth(clamp(elapsed/d.carousel));
   grid.style.transform=`translateX(${d.baseX-d.travel*pan}px)`;
   // Reparent the same tile only when the two poses coincide. Reversible at
   // the same scroll coordinate; its motion stays above the hero CTA.
   if(bridge>=1&&!docked){anchor.append(layer);docked=true;}
   else if(bridge<1&&docked){gap.append(layer);docked=false;}
   const g=gap.getBoundingClientRect(),side=Math.min(d.w*.42,(g.height-20)/Math.SQRT2);
   const target={left:d.baseX+anchorColumn*(d.size+8),top:d.hh+anchorRow*(d.size+8),width:d.size};
   const targetSize=d.size;
   tile.style.width=(docked?targetSize:side+(targetSize-side)*blend)+'px';
   tile.style.height=tile.style.width;tile.style.opacity='1';
   if(docked)tile.style.transform='translate(0px,0px) rotate(0deg)';
   else{
    const x0=(g.width-side)/2,y0=(g.height-side)/2;
    const x=x0+(target.left-g.left-x0)*blend,y1=y0+(target.top-g.top-y0)*blend;
    tile.style.transform=`translate(${x}px,${y1}px) rotate(${45*(1-smooth(turn/.64))}deg)`;
   }
   const material=smooth((elapsed-d.carousel)/d.material);
   grid.style.setProperty('--floor-material',material);
   const build=clamp((elapsed-d.carousel-d.material)/d.build);
   const wordsStart=d.carousel+d.material+d.build;
   const words=clamp((elapsed-wordsStart)/d.words);
   const exit=clamp((elapsed-wordsStart-d.words)/d.exit);
   const shade=Math.round(255*(1-material));sticky.style.backgroundColor=`rgb(${shade},${shade},${shade})`;stage.style.backgroundColor=sticky.style.backgroundColor;
   flat.style.transform='none';flat.style.opacity=build>0?'0':'1';
   if(build>0)room.draw(d.w,d.ch,.4,words*.7,{left:d.baseX-d.travel*pan,top:0,size:d.size,gap:8,columns},{fold:smooth(build),walls:smooth((build-.12)/.65),ceiling:smooth((build-.42)/.58)});
   room.canvas.style.opacity=build>0?'1':'0';
   scene.style.opacity=String(1-.22*exit);
   copy.style.opacity='1';copy.style.visibility=elapsed>=0?'visible':'hidden';
   status.style.opacity=String(elapsed>=d.carousel&&elapsed<wordsStart?material:0);
   const u=Math.min(3.62,words*4);
   infos.forEach((el,i)=>{
    const t=u-i,visible=elapsed>=wordsStart&&t>=-.32&&t<=1;
    const enter=smooth((t+.32)/.32),leave=i===3?1:1-smooth((t-.65)/.35);
    const natural=el.offsetWidth||300;
    const base=Math.min(1,(d.w-56)/(natural*1.14));
    const scale=base*(t<0?.86+.14*enter:1+.14*smooth(t));
    const opacity=visible?enter*leave:0;
    el.style.left='50%';el.style.top=(i%2?'63%':'38%');
    el.style.transform=`translate(-50%,-50%) scale(${scale})`;
    el.style.opacity=String(opacity);el.style.visibility=opacity>.001?'visible':'hidden';
   });
   // Leave the final message in the room until the next section covers it.
   photos.forEach(({block,a,caption,arrow})=>{
    block.style.opacity=String(1-material);
    const active=(bridge>.6||elapsed>=-d.ch*.5)&&material<.1;
    const r=a.getBoundingClientRect();
    a.tabIndex=active&&r.left>=0&&r.right<=d.w&&r.top>=d.hh&&r.bottom<=d.h?0:-1;
    a.style.pointerEvents=active?'auto':'none';a.setAttribute('aria-hidden',String(!active));
    // Keep complete labels inside the visible part of a large photo.
    const visibleLeft=Math.max(0,r.left),visibleRight=Math.min(d.w,r.right),space=visibleRight-visibleLeft;
    caption.style.left=(16+visibleLeft-r.left)+'px';caption.style.right='auto';caption.style.width=Math.max(0,space-32)+'px';
    caption.style.opacity=space>=180?'1':'0';
    arrow.style.right=Math.max(16,r.right-d.w+16)+'px';arrow.style.opacity=space>=70?'1':'0';
   });
   const mobileBar=q('#mobile-call');if(mobileBar)mobileBar.hidden=services.getBoundingClientRect().top>d.hh+d.ch*.3||q('#contact').getBoundingClientRect().top<d.h;
   const bar=q('[data-progress]');if(bar)bar.style.width=100*clamp(y/(root.scrollHeight-d.h||1))+'%';
  };
  const schedule=()=>{if(!frame&&!destroyed)frame=requestAnimationFrame(render)};
  const observer=new ResizeObserver(measure);observer.observe(header);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure,{passive:true});window.addEventListener('load',measure);document.fonts?.addEventListener('loadingdone',measure);
  measure();
  this.destroy=()=>{
   destroyed=true;cancelAnimationFrame(frame);observer.disconnect();
   window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);window.removeEventListener('load',measure);document.fonts?.removeEventListener('loadingdone',measure);
   marker.replaceWith(layer);layer.setAttribute('style',original.layerStyle);hero.setAttribute('style',original.heroStyle);wrap.replaceWith(hero);
   h1.innerHTML=original.title;intro.innerHTML=original.intro;h1.style.opacity='';intro.style.opacity='';if(location)location.style.opacity='';if(cta){cta.style.opacity='';cta.style.pointerEvents='';}
   grid.replaceChildren(...original.grid);grid.style.transform='';grid.style.setProperty('--floor-material','0');scene.style.opacity='';scene.style.transform='';sticky.style.overflow='hidden';copy.style.visibility='';infos.forEach(el=>{el.style.opacity='0';el.style.visibility='hidden'});stage.setAttribute('style',original.stageStyle);flat.style.opacity='';status.remove();room.canvas.remove();oldRoom.style.display='';root.classList.remove('mobile-sequence');
  };
 }
}
window.QueroMobileSequence=MobileSequence;
})();
