/* A single 2D perspective renderer avoids nested CSS-3D seams in portrait. */
(() => {
class PortraitRoom {
 constructor(host) {
  this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');
  Object.assign(this.canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',opacity:'0'});
  host.append(this.canvas);this.ctx=this.canvas.getContext('2d');this.image=new Image();
  this.image.onload=()=>{if(this.last)this.draw(...this.last)};this.image.src='./assets/photos/carreau-anthracite-hd.webp';
 }
 triangle(a,b,c,second){const ctx=this.ctx;ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.clip();
  if(!second)ctx.transform(b.x-a.x,b.y-a.y,c.x-a.x,c.y-a.y,a.x,a.y);
  else{const ax=b.x-c.x,ay=b.y-c.y,cx=b.x-a.x,cy=b.y-a.y;ctx.transform(ax,ay,cx,cy,a.x-ax,a.y-ay)}
  ctx.drawImage(this.image,0,0,1,1);ctx.restore();
 }
 draw(w,h,p,cam){
  this.last=[w,h,p,cam];const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  this.canvas.style.opacity=String(smooth((p-.4)/.055));if(p<.4||!this.image.complete||!this.image.naturalWidth)return;
  const ratio=Math.min(devicePixelRatio||1,1.5);if(this.canvas.width!==Math.round(w*ratio)||this.canvas.height!==Math.round(h*ratio)){this.canvas.width=Math.round(w*ratio);this.canvas.height=Math.round(h*ratio)}
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#272727';ctx.fillRect(0,0,w,h);
  const rw=w*1.8,rh=h*.68,depth=900,front=-170,focal=Math.max(500,w*1.3),camera=cam*260,tiles=[];
  const walls=smooth((p-.425)/.06),ceiling=smooth((p-.485)/.06),size=Math.max(95,w*.3),gap=3;
  const project=v=>{const s=focal/Math.max(80,focal+v.z-camera);return{x:w/2+v.x*s,y:h*.48+v.y*s}};
  const add=(point,u0,u1,v0,v1,shade)=>{const world=[point(u0,v0),point(u1,v0),point(u1,v1),point(u0,v1)];tiles.push({points:world.map(project),z:world.reduce((s,v)=>s+v.z,0)/4,shade})};
  const plane=(point,umin,umax,vmin,vmax,shade)=>{for(let u=umin;u<umax;u+=size)for(let v=vmin;v<vmax;v+=size){const a=u+gap/2,b=Math.min(u+size,umax)-gap/2,c=v+gap/2,d=Math.min(v+size,vmax)-gap/2;if(b>a&&d>c)add(point,a,b,c,d,shade)}};
  plane((x,z)=>({x,y:rh/2,z}),-rw/2,rw/2,front,depth,.08);
  if(walls>0){const top=rh/2-rh*walls;
   plane((x,y)=>({x,y,z:depth}),-rw/2,rw/2,top,rh/2,.1);
   plane((z,y)=>({x:-rw/2,y,z}),front,depth,top,rh/2,.18);
   plane((z,y)=>({x:rw/2,y,z}),front,depth,top,rh/2,.25);
  }
  if(ceiling>0)plane((x,z)=>({x,y:-rh/2,z}),-rw/2,rw/2,depth-(depth-front)*ceiling,depth,.3);
  tiles.sort((a,b)=>b.z-a.z);for(const t of tiles){const [a,b,c,d]=t.points;this.triangle(a,b,d,false);this.triangle(b,c,d,true);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle=`rgba(0,0,0,${t.shade})`;ctx.fill()}
 }
}
window.QueroPortraitRoom=PortraitRoom;
})();
