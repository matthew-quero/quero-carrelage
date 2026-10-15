(() => {
'use strict';
const $=s=>document.querySelector(s), clamp=x=>Math.max(0,Math.min(1,x)), ease=x=>{x=clamp(x);return x*x*(3-2*x)}, lerp=(a,b,t)=>a+(b-a)*t;
const track=$('.track'),view=$('.viewport'),tile=$('.tile'),world=$('.world'),floor=$('.floor'),intro=$('.intro'),caption=$('.caption'),slider=$('#position'),out=$('#percent'),play=$('#play'),words=[...document.querySelectorAll('.statement')],planes=[...document.querySelectorAll('.plane')];
let W=0,H=0,S=0,R=0,span=0,frame=0,playing=false,last=0;
planes.forEach((plane,i)=>{const cols=i===0||i===1||i===4?7:5,rows=i===0||i===4?5:4;plane.style.gridTemplateColumns=`repeat(${cols},1fr)`;plane.style.gridTemplateRows=`repeat(${rows},1fr)`;for(let j=0;j<cols*rows;j++){const cell=document.createElement('div');cell.className='cell';plane.append(cell)}});
function layout(){W=innerWidth;H=innerHeight;S=Math.min(W*.14,H*.2);R=S*7;span=track.offsetHeight-H;view.style.perspective=Math.max(W*.85,700)+'px';planes.forEach((p,i)=>{p.style.width=(i===2||i===3?S*5:R)+'px';p.style.height=(i===0||i===4?S*5:S*4)+'px';p.style.left=-(i===2||i===3?S*5:R)/2+'px';p.style.top=-(i===0||i===4?S*5:S*4)/2+'px'});request()}
function render(){frame=0;const p=clamp(scrollY/span),start=Math.min(H*.65,W*.65),move=ease(p/.25),assembly=ease((p-.24)/.16),fold=ease((p-.42)/.17),walls=ease((p-.58)/.12),zoom=ease((p-.71)/.29);
const size=lerp(start,S,move),x=lerp(-start*.54,W/2-size/2,move),y=lerp(H*.5-start/2,H/2-size/2,move);
tile.style.width=size+'px';tile.style.height=size+'px';tile.style.transform=`translate3d(${x}px,${y}px,0) rotate(${lerp(-45,0,move)}deg)`;tile.style.opacity=String(1-ease((p-.25)/.1));intro.style.opacity=String(1-ease(p/.16));intro.style.transform=`translateY(${-40*move}px)`;
world.style.opacity=String(ease((p-.25)/.08));world.style.transform=`translate3d(0,${lerp(0,H*.12,fold)}px,${zoom*Math.min(W*.35,420)}px) rotateX(${-fold*12}deg)`;
floor.style.transform=`rotateX(${fold*90}deg)`;
[...floor.children].forEach((cell,i)=>{const dx=i%7-3,dy=Math.floor(i/7)-2,d=Math.max(Math.abs(dx),Math.abs(dy)),t=ease((assembly-d*.13)/.5);cell.style.opacity=String(t);cell.style.transform=`translate(${dx*(1-t)*S*.5}px,${dy*(1-t)*S*.5}px) scale(${lerp(.8,1,t)})`});
// All planes share the floor's exact corners. Room growth is a geometric transform.
const depth=S*5,wallH=S*4;
$('.back').style.transform=`translate3d(0,${-wallH/2*walls}px,${-depth/2}px) scaleY(${walls})`;
$('.left').style.transform=`translate3d(${-R/2}px,${-wallH/2*walls}px,0) rotateY(90deg) scaleY(${walls})`;
$('.right').style.transform=`translate3d(${R/2}px,${-wallH/2*walls}px,0) rotateY(-90deg) scaleY(${walls})`;
$('.ceiling').style.transform=`translateY(${-wallH*walls}px) rotateX(-90deg)`;
planes.slice(1).forEach(el=>el.style.opacity=String(walls));
const dark=ease((p-.53)/.16);view.style.background=`rgb(${lerp(250,25,dark)},${lerp(250,25,dark)},${lerp(248,25,dark)})`;document.body.classList.toggle('dark',p>.64&&scrollY<span+H*.1);caption.style.opacity=String(ease((p-.28)/.04)*(1-ease((p-.42)/.04)));
words.forEach((el,i)=>{const t=(p-(.73+i*.075))/.15,scale=lerp(.55,2.8,clamp(t));const opacity=ease(t/.18)*(1-ease((t-.52)/.23));el.style.left=(i%2?33:61)+'%';el.style.top=(i%2?55:34)+'%';el.style.transform=`translate(-50%,-50%) scale(${scale})`;el.style.opacity=String(opacity);if(opacity>0){const r=el.getBoundingClientRect();if(r.left<20||r.right>W-20||r.top<75||r.bottom>H-130)el.style.opacity='0'}});
slider.value=String(Math.round(p*1000));out.value=Math.round(p*100)+' %';if(playing){const now=performance.now(),dt=Math.min(now-last,50);last=now;if(p>=1){stop()}else{scrollTo({top:scrollY+span*dt/18000,behavior:'instant'});request()}}}
function request(){if(!frame)frame=requestAnimationFrame(render)}function stop(){playing=false;play.textContent='Lire ▶'}
play.addEventListener('click',()=>{if(playing){stop();return}if(scrollY>=span-2)scrollTo({top:0,behavior:'instant'});playing=true;last=performance.now();play.textContent='Pause Ⅱ';request()});
slider.addEventListener('input',()=>{stop();scrollTo({top:Number(slider.value)/1000*span,behavior:'instant'});request()});
addEventListener('wheel',stop,{passive:true});addEventListener('touchstart',stop,{passive:true});addEventListener('scroll',request,{passive:true});addEventListener('resize',layout);addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))stop()});layout();
})();
