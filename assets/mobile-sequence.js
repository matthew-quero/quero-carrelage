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
  const items=[
   ['Carrelage intérieur','carrelage-interieur.html','service-interieur.jpg'],
   ['Faïence murale','faience-douche.html','service-faience.jpg'],
   ['Douche à l’italienne','faience-douche.html#douche','service-faience.jpg'],
   ['Terrasse et dallage','terrasse-carrelage.html','service-terrasse.jpg'],
   ['Rénovation et neuf','carrelage-interieur.html#renovation','service-interieur.jpg']
  ];
  // Five rows; the five main links are visible within the first three columns.
  const cards=new Map([[0,0],[4,1],[6,2],[8,3],[12,4],[17,0],[19,1],[21,3],[24,2],[28,4],[31,0],[34,1]]);
  const cells=[];grid.replaceChildren();
  for(let i=0;i<35;i++){
   const cell=document.createElement('div');cell.dataset.cell='1';
   if(cards.has(i)){
    const [label,url,photo]=items[cards.get(i)],a=document.createElement('a');
    a.className='tile-link tile-photo mobile-service-tile';a.href='./'+url;
    a.style.backgroundImage=`url('./assets/photos/${photo}')`;
    const arrow=document.createElement('span');arrow.className='mobile-tile-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    const caption=document.createElement('span');caption.className='mobile-tile-label';
    const title=document.createElement('strong');title.textContent=label;
    const action=document.createElement('span');action.textContent='Voir la prestation';
    caption.append(title,action);a.append(arrow,caption);cell.append(a);
   }
   cells.push(cell);grid.append(cell);
  }
  const status=document.createElement('p');status.className='room-build-copy';status.textContent='Carrelage et faïence.';copy.append(status);
  const room=new window.QueroPortraitRoom(scene);
  const oldRoom=q('[data-room]');oldRoom.style.display='none';
  let dims,frame=0,titleState=false,destroyed=false;
  const measure=()=>{
   const w=window.innerWidth,h=window.innerHeight,hh=Math.ceil(header.getBoundingClientRect().height+10),ch=h-hh;
   root.style.setProperty('--header-height',hh+'px');root.style.setProperty('--sequence-overlap',ch+'px');
   root.style.setProperty('--mobile-cell',(ch-32)/5+'px');
   sticky.style.top=hh+'px';sticky.style.height=ch+'px';
   hero.style.position='sticky';hero.style.top=hh+'px';
   const heroHeight=hero.offsetHeight,rotate=Math.min(360,h*.44);
   wrap.style.height=heroHeight+rotate+'px';
   const size=(ch-32)/5,width=7*size+48,travel=Math.max(0,width-w);
   const carousel=Math.max(h*.8,travel*1.35),material=h*.28,build=h*.6,words=h*2.6,exit=h*.72;
   dims={w,h,hh,ch,size,width,travel,rotate,carousel,material,build,words,exit,total:carousel+material+build+words+exit};
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
   const swap=1-Math.max(0,1-Math.abs(turn-.64)/.075);
   h1.style.opacity=String(swap);intro.style.opacity=String(swap);
   // The tile is a child of its reserved gap, so it cannot cross the CTA.
   const g=gap.getBoundingClientRect(),side=Math.min(d.w*.42,(g.height-20)/Math.SQRT2);
   tile.style.width=side+'px';tile.style.height=side+'px';tile.style.opacity='1';
   tile.style.transform=`translate(${(g.width-side)/2}px,${(g.height-side)/2}px) rotate(${45*(1-smooth(turn/.64))}deg)`;
   const start=stage.getBoundingClientRect().top+y,elapsed=y-start;
   const pan=smooth(clamp(elapsed/d.carousel));
   grid.style.transform=`translateX(${-d.travel*pan}px)`;
   const material=smooth((elapsed-d.carousel)/d.material);
   grid.style.setProperty('--floor-material',material);
   const build=clamp((elapsed-d.carousel-d.material)/d.build);
   const wordsStart=d.carousel+d.material+d.build;
   const words=clamp((elapsed-wordsStart)/d.words);
   const exit=clamp((elapsed-wordsStart-d.words)/d.exit);
   const shade=Math.round(255*(1-material));sticky.style.backgroundColor=`rgb(${shade},${shade},${shade})`;stage.style.backgroundColor=sticky.style.backgroundColor;
   flat.style.transform='none';flat.style.opacity=build>0?'0':'1';
   room.draw(d.w,d.ch,.4,words*.7,{left:-d.travel*pan,top:0,size:d.size,gap:8,columns:7},{fold:smooth(build),walls:smooth((build-.12)/.65),ceiling:smooth((build-.42)/.58)});
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
   cells.forEach(cell=>{const a=cell.querySelector('a');if(!a)return;const active=elapsed>=-d.ch*.5&&material<.1;a.tabIndex=active?0:-1;a.style.pointerEvents=active?'auto':'none';a.setAttribute('aria-hidden',String(!active));});
   const mobileBar=q('#mobile-call');if(mobileBar)mobileBar.hidden=services.getBoundingClientRect().top>d.hh+d.ch*.3||q('#contact').getBoundingClientRect().top<d.h;
   const bar=q('[data-progress]');if(bar)bar.style.width=100*clamp(y/(root.scrollHeight-d.h||1))+'%';
  };
  const schedule=()=>{if(!frame&&!destroyed)frame=requestAnimationFrame(render)};
  const observer=new ResizeObserver(measure);observer.observe(header);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure,{passive:true});window.addEventListener('load',measure);document.fonts?.addEventListener('loadingdone',measure);
  measure();render();
  this.destroy=()=>{
   destroyed=true;cancelAnimationFrame(frame);observer.disconnect();
   window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);window.removeEventListener('load',measure);document.fonts?.removeEventListener('loadingdone',measure);
   marker.replaceWith(layer);layer.setAttribute('style',original.layerStyle);hero.setAttribute('style',original.heroStyle);wrap.replaceWith(hero);
   h1.innerHTML=original.title;intro.innerHTML=original.intro;h1.style.opacity='';intro.style.opacity='';
   grid.replaceChildren(...original.grid);grid.style.transform='';stage.setAttribute('style',original.stageStyle);flat.style.opacity='';status.remove();room.canvas.remove();oldRoom.style.display='';root.classList.remove('mobile-sequence');
  };
 }
}
window.QueroMobileSequence=MobileSequence;
})();
