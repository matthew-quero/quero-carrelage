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
 draw(w,h,p,cam,grid){
  this.last=[w,h,p,cam,grid];
  const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  this.canvas.style.opacity=p>=.4?'1':'0';
  if(p<.4||!this.image.complete||!this.image.naturalWidth)return;
  const ratio=Math.min(devicePixelRatio||1,1.5);
  if(this.canvas.width!==Math.round(w*ratio)||this.canvas.height!==Math.round(h*ratio)){this.canvas.width=Math.round(w*ratio);this.canvas.height=Math.round(h*ratio)}
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
  const fold=smooth((p-.4)/.09),angle=fold*Math.PI/2;
  const size=grid.size,gap=grid.gap,pitch=size+gap;
  const xStart=grid.left-w/2,pivot=h*.52,depth=h-grid.top;
  const focal=Math.max(500,w*1.3),camera=cam*260,tiles=[];
  const left=xStart+Math.floor((-w*.8-xStart)/pitch)*pitch-gap/2;
  const right=left+Math.ceil(w*1.6/pitch)*pitch;
  const rh=h*1.4,front=-focal*.8;
  const walls=smooth((p-.49)/.065),ceiling=smooth((p-.555)/.06);
  const project=v=>{const z=focal+v.z-camera;const scale=focal/Math.max(60,z);return{x:w/2+v.x*scale,y:h*.48+v.y*scale}};
  const add=(world,shade)=>{if(world.every(v=>focal+v.z-camera<=60))return;tiles.push({points:world.map(project),z:world.reduce((a,v)=>a+v.z,0)/4,shade})};
  // The first canvas frame is the same grid at the same coordinates. Each
  // square keeps its size, joint and texture while its plane folds backwards.
  const floorPoint=(x,y)=>{const dy=y-pivot;return{x,y:pivot+dy*Math.cos(angle),z:-dy*Math.sin(angle)}};
  for(let col=-3;col<grid.columns+4;col++)for(let row=0;row<12;row++){
   const x=Math.max(left,xStart+col*pitch),x2=Math.min(right,xStart+col*pitch+size),y=grid.top+row*pitch-h*.48;
   if(x2>x)add([floorPoint(x,y),floorPoint(x2,y),floorPoint(x2,y+size),floorPoint(x,y+size)],.22-.14*fold);
  }
  const plane=(point,umin,umax,vmin,vmax,shade)=>{
   for(let u=umin;u<umax;u+=pitch)for(let v=vmin;v<vmax;v+=pitch){
    const a=u+gap/2,b=Math.min(u+pitch,umax)-gap/2,c=v+gap/2,d=Math.min(v+pitch,vmax)-gap/2;
    if(b>a&&d>c)add([point(a,c),point(b,c),point(b,d),point(a,d)],shade);
   }
  };
  if(walls>0){
   const top=pivot-rh*walls;
   plane((x,y)=>({x,y,z:depth}),left,right,top,pivot,.1);
   plane((z,y)=>({x:left,y,z}),front,depth,top,pivot,.18);
   plane((z,y)=>({x:right,y,z}),front,depth,top,pivot,.25);
  }
  if(ceiling>0)plane((x,z)=>({x,y:pivot-rh,z}),left,right,depth-(depth-front)*ceiling,depth,.3);
  tiles.sort((a,b)=>b.z-a.z);
  // Dark joints belong to the same rotating plane, rather than a replacement room.
  for(const t of tiles){const [a,b,c,d]=t.points;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle='#484848';ctx.fill();this.triangle(a,b,d,false);this.triangle(b,c,d,true);if(t.shade){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle=`rgba(0,0,0,${t.shade})`;ctx.fill()}}
 }
}
window.QueroPortraitRoom=PortraitRoom;
})();
