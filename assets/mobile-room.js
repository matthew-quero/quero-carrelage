/* A single 2D perspective renderer avoids nested CSS-3D seams in portrait. */
(() => {
class PortraitRoom {
 constructor(host) {
  this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');this.canvas.dataset.renderer='canvas2d';
  Object.assign(this.canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',opacity:'0'});
  host.append(this.canvas);this.ctx=this.canvas.getContext('2d');this.image=new Image();
  this.image.onload=()=>{if(this.last)this.draw(...this.last)};this.image.src='./assets/photos/carreau-anthracite-hd.webp';
 }
 triangle(a,b,c,second){const ctx=this.ctx;ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.clip();
  if(!second)ctx.transform(b.x-a.x,b.y-a.y,c.x-a.x,c.y-a.y,a.x,a.y);
  else{const ax=b.x-c.x,ay=b.y-c.y,cx=b.x-a.x,cy=b.y-a.y;ctx.transform(ax,ay,cx,cy,a.x-ax,a.y-ay)}
  ctx.drawImage(this.image,0,0,1,1);ctx.restore();
 }
 draw(w,h,p,cam,grid,state){
  this.last=[w,h,p,cam,grid,state];
  const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  this.canvas.style.opacity=p>=.4?'1':'0';
  if(p<.4||!this.image.complete||!this.image.naturalWidth)return;
  const ratio=Math.min(devicePixelRatio||1,1.5);
  if(this.canvas.width!==Math.round(w*ratio)||this.canvas.height!==Math.round(h*ratio)){this.canvas.width=Math.round(w*ratio);this.canvas.height=Math.round(h*ratio)}
  const ctx=this.ctx;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
  const fold=state?.fold??smooth((p-.4)/.09),angle=fold*Math.PI/2;
  const size=grid.size,gap=grid.gap,pitch=size+gap;
  const xStart=grid.left-w/2,pivot=h*.5;
  const focal=Math.max(500,w*1.3),camera=cam*260,tiles=[];let group=0;
  const left=-w*.8,right=w*.8;
  const rh=h,sin=Math.sin(angle),cos=Math.cos(angle),depth=(h-grid.top)*sin;
  const front=Math.max(-focal*.8,camera-focal+80);
  const floorY=z=>pivot-z*cos/Math.max(.001,sin);
  const walls=state?.walls??smooth((p-.49)/.065),ceiling=state?.ceiling??smooth((p-.555)/.06);
  const project=v=>{const z=focal+v.z-camera;const scale=focal/Math.max(60,z);return{x:w/2+v.x*scale,y:h*.5+v.y*scale}};
  const add=(world,shade)=>{if(world.every(v=>focal+v.z-camera<=60))return;tiles.push({group,points:world.map(project),z:world.reduce((a,v)=>a+v.z,0)/4,shade})};
  // The first canvas frame is the same grid at the same coordinates. Each
  // square keeps its size, joint and texture while its plane folds backwards.
  const floorPoint=(x,y)=>{const dy=y-pivot;return{x,y:pivot+dy*Math.cos(angle),z:-dy*Math.sin(angle)}};
  for(let col=-3;col<grid.columns+4;col++)for(let row=0;row<12;row++){
   const x=Math.max(left,xStart+col*pitch),x2=Math.min(right,xStart+col*pitch+size),y=grid.top+row*pitch-h*.5;
   const maxY=sin>.001?pivot+(focal-camera-80)/sin:Infinity,y2=Math.min(y+size,maxY);
   if(x2>x&&y2>y)add([floorPoint(x,y),floorPoint(x2,y),floorPoint(x2,y2),floorPoint(x,y2)],.22-.14*fold);
  }
  const plane=(point,umin,umax,vmin,vmax,shade)=>{
   for(let u=umin;u<umax;u+=pitch)for(let v=vmin;v<vmax;v+=pitch){
    const a=u+gap/2,b=Math.min(u+pitch,umax)-gap/2,c=v+gap/2,d=Math.min(v+pitch,vmax)-gap/2;
    if(b>a&&d>c)add([point(a,c),point(b,c),point(b,d),point(a,d)],shade);
   }
  };
  group=1;
  if(walls>0){
   const height=rh*walls;
   plane((x,rise)=>({x,y:floorY(depth)-rise,z:depth}),left,right,0,height,.1);
   plane((z,rise)=>({x:left,y:floorY(z)-rise,z}),front,depth,0,height,.18);
   plane((z,rise)=>({x:right,y:floorY(z)-rise,z}),front,depth,0,height,.25);
  }
  group=2;
  if(ceiling>0)plane((x,z)=>({x,y:floorY(z)-rh*walls,z}),left,right,depth-(depth-front)*ceiling,depth,.3);
  tiles.sort((a,b)=>a.group-b.group||b.z-a.z);
  // Dark joints belong to the same rotating plane, rather than a replacement room.
  for(const t of tiles){const [a,b,c,d]=t.points;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle='#484848';ctx.fill();this.triangle(a,b,d,false);this.triangle(b,c,d,true);if(t.shade){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle=`rgba(0,0,0,${t.shade})`;ctx.fill()}}
 }
}

// Use a depth buffer for the folding plane. Perspective-correct texture sampling
// and near-plane clipping prevent seams from the former affine triangle renderer.
class DepthRoom {
 constructor(host){
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
  Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',opacity:'0'});
  host.append(canvas);
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:true})||canvas.getContext('webgl',{alpha:true,antialias:true});
  if(!gl){canvas.remove();return new PortraitRoom(host)}
  this.canvas=canvas;this.gl=gl;canvas.dataset.renderer='webgl';
  const modern=typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext;
  const prefix=modern?'#version 300 es\n':'';
  const vertex=prefix+`precision highp float;
   ${modern?'in':'attribute'} vec3 point;
   ${modern?'in':'attribute'} vec2 uv;
   ${modern?'in':'attribute'} float shade;
   ${modern?'in':'attribute'} float material;
   uniform vec2 viewport;uniform float focal;uniform float camera;
   ${modern?'out':'varying'} vec2 texcoord;${modern?'out':'varying'} float darkness;${modern?'out':'varying'} float useTexture;
   void main(){float depth=focal+point.z-camera;float near=40.0;float far=6000.0;
    gl_Position=vec4(point.x*focal*2.0/viewport.x,-point.y*focal*2.0/viewport.y,(far+near)/(far-near)*depth-2.0*far*near/(far-near),depth);
    texcoord=uv;darkness=shade;useTexture=material;}`;
  const fragment=prefix+`precision highp float;
   ${modern?'in':'varying'} vec2 texcoord;${modern?'in':'varying'} float darkness;${modern?'in':'varying'} float useTexture;
   uniform sampler2D surface;${modern?'out vec4 color;':''}
   void main(){vec4 ink=mix(vec4(.15,.15,.15,1.0),${modern?'texture':'texture2D'}(surface,texcoord),useTexture);${modern?'color':'gl_FragColor'}=vec4(ink.rgb*(1.0-darkness),1.0);}`;
  const shader=(type,source)=>{const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh};
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
  this.program=program;gl.useProgram(program);this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
  for(const [name,size,offset]of [['point',3,0],['uv',2,12],['shade',1,20],['material',1,24]]){const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,size,gl.FLOAT,false,28,offset)}
  this.uniforms=Object.fromEntries(['viewport','focal','camera'].map(name=>[name,gl.getUniformLocation(program,name)]));
  this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([50,50,50,255]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);
  this.image=new Image();this.image.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.image);if(modern){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR)}if(this.last)this.draw(...this.last)};
  this.image.src='./assets/photos/carreau-anthracite-hd.webp';
 }
 draw(w,h,p,cam,grid,state){
  this.last=[w,h,p,cam,grid,state];const gl=this.gl;
  const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
  const fold=state?.fold??smooth((p-.4)/.09),walls=state?.walls??smooth((p-.49)/.065),ceiling=state?.ceiling??smooth((p-.555)/.06);
  const angle=fold*Math.PI/2,sin=Math.sin(angle),cos=Math.cos(angle),focal=Math.max(500,w*1.3),pivot=h/2;
  const pitch=grid.size+grid.gap,xStart=grid.left-w/2,left=-w*.8,right=w*.8;
  const farSource=grid.top-h/2,depth=(pivot-farSource)*sin,front=-focal*.8;
  const floorY=z=>pivot-z*cos/Math.max(.001,sin);
  const dpr=Math.min(devicePixelRatio||1,1.5);
  if(this.canvas.width!==Math.round(w*dpr)||this.canvas.height!==Math.round(h*dpr)){this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr)}
  gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.useProgram(this.program);gl.uniform2f(this.uniforms.viewport,w,h);gl.uniform1f(this.uniforms.focal,focal);gl.uniform1f(this.uniforms.camera,cam*260);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const bases=[],tiles=[];
  const quad=(list,points,shade,material)=>{const uv=[[0,0],[1,0],[1,1],[0,1]];for(const i of [0,1,2,0,2,3]){const v=points[i];list.push(v.x,v.y,v.z,...uv[i],shade,material)}};
  const surface=(point,u0,u1,v0,v1,shade,originU=u0,originV=v0)=>{
   quad(bases,[point(u0,v0),point(u1,v0),point(u1,v1),point(u0,v1)],shade,0);
   const us=originU+Math.floor((u0-originU)/pitch)*pitch,vs=originV+Math.floor((v0-originV)/pitch)*pitch;
   for(let u=us;u<u1;u+=pitch)for(let v=vs;v<v1;v+=pitch){const a=Math.max(u0,u),b=Math.min(u1,u+grid.size),c=Math.max(v0,v),d=Math.min(v1,v+grid.size);if(b>a&&d>c)quad(tiles,[point(a,c),point(b,c),point(b,d),point(a,d)],shade,1)}
  };
  const floor=(x,y)=>{const dy=y-pivot;return{x,y:pivot+dy*cos,z:-dy*sin}};
  surface(floor,left,right,farSource,h*4,.12*fold,xStart,farSource);
  if(walls>0&&sin>.01){
   const wallHeight=h*walls;
   surface((x,rise)=>({x,y:floorY(depth)-rise,z:depth}),left,right,0,wallHeight,.12,xStart,0);
   surface((z,rise)=>({x:left,y:floorY(z)-rise,z}),front,depth,0,wallHeight,.22,depth%pitch,0);
   surface((z,rise)=>({x:right,y:floorY(z)-rise,z}),front,depth,0,wallHeight,.22,depth%pitch,0);
   if(ceiling>0)surface((x,z)=>({x,y:floorY(z)-wallHeight,z}),left,right,depth-(depth-front)*ceiling,depth,.28,xStart,depth%pitch);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(bases),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,bases.length/7);gl.disable(gl.POLYGON_OFFSET_FILL);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(tiles),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,tiles.length/7);
 }
}
window.QueroPortraitRoom=DepthRoom;
})();
