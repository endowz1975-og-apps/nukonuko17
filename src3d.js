/* ================= 3D 表示 (Three.js) ================= */
const TW=1,TH=1.4,TD=0.74,BV=0.05,SP=1.08;
let R3=null;
const VIEWS={angle:{el:1.0,az:0,k:1},front:{el:.55,az:0,k:1.02},quarter:{el:.78,az:.72,k:1.45},top:{el:1.45,az:0,k:1}};
const VIEW_ORDER=["angle","front","quarter","top"],VIEW_NAME={angle:"標準",front:"正面",quarter:"クォーター",top:"真上"};
function init3d(){
  const cv=document.createElement('canvas');cv.id='cv';document.body.prepend(cv);
  const ren=new THREE.WebGLRenderer({canvas:cv,antialias:true});
  ren.setPixelRatio(Math.min(devicePixelRatio,2));
  ren.outputEncoding=THREE.sRGBEncoding;
  ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.05;
  ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a0807);
  const cam=new THREE.PerspectiveCamera(40,1,0.1,200);
  const target=new THREE.Vector3(0,0,1.2);
  scene.add(new THREE.HemisphereLight(0xfff1dd,0x1a2a22,0.7));
  const sun=new THREE.DirectionalLight(0xfff4e0,1.0);
  sun.position.set(6,18,10);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-20,right:20,top:16,bottom:-16,near:1,far:50});
  sun.shadow.bias=-0.0006;
  scene.add(sun);
  const lamp=new THREE.PointLight(0xffc880,0.8,60);lamp.position.set(0,12,0);scene.add(lamp);

  // 反射用の環境マップ（天井照明が牌の艶・ガラスに映り込む）
  {
    const es=new THREE.Scene();es.background=new THREE.Color(0x15110d);
    const panel=(w,h,x,y,z,rx,ry,c)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(c,c,c*.92),side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);es.add(m)};
    panel(30,14,0,16,0,Math.PI/2,0,9);panel(10,6,-20,8,4,0,Math.PI/2,5);panel(10,6,20,8,-4,0,Math.PI/2,3);panel(26,5,0,6,-22,0,0,2.5);
    const pm=new THREE.PMREMGenerator(ren);scene.environment=pm.fromScene(es,0.03).texture;pm.dispose();
  }
  // 卓（フェルト）
  const fc=document.createElement('canvas');fc.width=fc.height=256;
  const fx=fc.getContext('2d');fx.fillStyle='#1c5a3b';fx.fillRect(0,0,256,256);
  for(let i=0;i<9000;i++){const v=Math.random()*40-20;fx.fillStyle=`rgba(${v>0?255:0},${v>0?255:0},${v>0?255:0},${Math.abs(v)/260})`;fx.fillRect(Math.random()*256,Math.random()*256,2,2)}
  const ft=new THREE.CanvasTexture(fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(10,7);ft.encoding=THREE.sRGBEncoding;
  const felt=new THREE.Mesh(new THREE.PlaneGeometry(40,28),new THREE.MeshStandardMaterial({map:ft,roughness:.95,envMapIntensity:.12}));
  felt.rotation.x=-Math.PI/2;felt.receiveShadow=true;scene.add(felt);
  const wood=new THREE.MeshStandardMaterial({color:0x2b2e33,roughness:.38,metalness:.55}); // 全自動卓の黒い本体
  [[0,-14.6,41.6,1.4],[0,14.6,41.6,1.4]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.5,d),wood);m.position.set(x,.05,z);m.receiveShadow=true;scene.add(m)});
  [[-20.7,0],[20.7,0]].forEach(([x,z])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1.4,.5,28),wood);m.position.set(x,.05,z);m.receiveShadow=true;scene.add(m)});

  // 全自動卓の飾り: クロームの縁、四隅の点棒トレイ、サイコロ穴、LED
  {
    const chrome=new THREE.MeshStandardMaterial({color:0xd8dde2,roughness:.18,metalness:1});
    const dark=new THREE.MeshStandardMaterial({color:0x0e0f11,roughness:.25,metalness:.3});
    const add=(m,x,y,z)=>{m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=true;scene.add(m);return m};
    [[0,-13.95,40,.14],[0,13.95,40,.14]].forEach(([x,z,w,d])=>add(new THREE.Mesh(new THREE.BoxGeometry(w,.1,d),chrome),x,.33,z));
    [[-19.95,0],[19.95,0]].forEach(([x,z])=>add(new THREE.Mesh(new THREE.BoxGeometry(.14,.1,27.8),chrome),x,.33,z));
    const led=[0x39ff88,0xff9a2e,0x39a9ff,0xff4d4d].map(c=>new THREE.MeshBasicMaterial({color:c}));
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz],i)=>{
      const x=sx*17.6,z=sz*11.6;
      add(new THREE.Mesh(new THREE.BoxGeometry(3.6,.08,2.8),chrome),x,.04,z);
      add(new THREE.Mesh(new THREE.BoxGeometry(3.3,.14,2.5),dark),x,.06,z);
      add(new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),led[i]),x-sx*1.2,.18,z-sz*.95);
    });
    // サイコロ穴
    add(new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.1,40),chrome),10.2,.04,-4.6);
    add(new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.3,.14,40),dark),10.2,.06,-4.6);
    // 辺のLED
    for(let i=0;i<4;i++)add(new THREE.Mesh(new THREE.SphereGeometry(.1,10,8),led[i]),-1.5+i,.4,14.6);
  }
  R3={ren,scene,cam,target,meshes:new Map(),layout:new Map(),byId:new Map(),hover:null,mx:0,my:0,tex:new Map(),ray:new THREE.Raycaster(),mouse:new THREE.Vector2()};
  // 共通資材と形状
  const glass=(c,o)=>new THREE.MeshPhysicalMaterial({vertexColors:true,color:c,transparent:true,opacity:o,roughness:.06,metalness:0,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.4,ior:1.49,specularIntensity:1});
  R3.mat={gl:glass(0xffffff,.66),bk:new THREE.MeshPhysicalMaterial({color:0x000000,roughness:.3,clearcoat:.6,clearcoatRoughness:.15,envMapIntensity:.35}),wi:new THREE.MeshPhysicalMaterial({color:0xf5efdc,roughness:.3,clearcoat:.7,clearcoatRoughness:.12,envMapIntensity:.9}),cap:new THREE.MeshPhongMaterial({color:0x000000,specular:0xaaaaaa,shininess:45})};
  // 牌の本体は継ぎ目のない1つの塊。表（象牙色）から背（緑）へ頂点色でなだらかに変える
  {const g=slab(TD),p=g.attributes.position,cs=new Float32Array(p.count*3),a=new THREE.Color(0xf7f0d8),b=new THREE.Color(0xa6dcc0),c=new THREE.Color();
   for(let i=0;i<p.count;i++){const t=Math.max(0,Math.min(1,((p.getZ(i)+TD/2)/TD-.15)/.5));c.copy(b).lerp(a,t*t*(3-2*t));cs[i*3]=c.r;cs[i*3+1]=c.g;cs[i*3+2]=c.b}
   g.setAttribute('color',new THREE.BufferAttribute(cs,3));R3.geo={body:g}}
  const rc=(fn)=>{const c=document.createElement('canvas');c.width=c.height=256;fn(c.getContext('2d'));const t=new THREE.CanvasTexture(c);return t};
  const haloT=rc(x=>{const g=x.createRadialGradient(128,128,10,128,128,128);g.addColorStop(0,'rgba(255,240,200,.95)');g.addColorStop(.3,'rgba(255,90,60,.6)');g.addColorStop(1,'rgba(255,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256)});
  const rayT=rc(x=>{x.translate(128,128);for(let i=0;i<16;i++){x.rotate(Math.PI/8);const g=x.createLinearGradient(0,0,0,-128);g.addColorStop(0,'rgba(255,200,120,.8)');g.addColorStop(1,'rgba(255,60,40,0)');x.fillStyle=g;x.beginPath();x.moveTo(-5,0);x.lineTo(5,0);x.lineTo(0,-128);x.fill()}});
  const add={transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide};
  R3.ronLight=new THREE.PointLight(0xffa860,0,6);R3.beamG=new THREE.CylinderGeometry(.6,.85,6,28,1,true);
  const beamT=rc(x=>{const g=x.createLinearGradient(0,256,0,0);g.addColorStop(0,'rgba(255,230,170,.9)');g.addColorStop(.5,'rgba(255,110,60,.35)');g.addColorStop(1,'rgba(255,40,20,0)');x.fillStyle=g;x.fillRect(0,0,256,256)});
  R3.mark={beam:new THREE.MeshBasicMaterial({map:beamT,color:0xffc090,opacity:1,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),halo:new THREE.MeshBasicMaterial({map:haloT,...add}),rays:new THREE.MeshBasicMaterial({map:rayT,...add}),h:new THREE.MeshBasicMaterial({color:0xff9a40,transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),r:new THREE.MeshBasicMaterial({color:0xe53935}),g:new THREE.MeshBasicMaterial({color:0xffc83d})};
  R3.zoom=1;R3.el=1.0;R3.az=0;R3.dAz=0;R3.dEl=0;R3.rot=false;R3.pts=new Map();R3.pan=new THREE.Vector3();R3.moved=0;
  const setZ=z=>{R3.zoom=Math.min(1.5,Math.max(.35,z))};
  cv.addEventListener('wheel',e=>{e.preventDefault();setZ(R3.zoom*Math.exp(e.deltaY*.0012))},{passive:false});
  cv.addEventListener('pointerdown',e=>{R3.pts.set(e.pointerId,[e.clientX,e.clientY]);R3.pd=null;R3.pc=null;R3.t0=performance.now();if(R3.pts.size>1)R3.multi=true;R3.moved=0;R3.down=[e.clientX,e.clientY];R3.rot=e.button==1||e.shiftKey;if(e.button==1)e.preventDefault()});
  cv.addEventListener('pointermove',e=>{
    if(!R3.pts.has(e.pointerId))return;
    const prev=R3.pts.get(e.pointerId);R3.pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(R3.pts.size==1){
      R3.moved=Math.hypot(e.clientX-R3.down[0],e.clientY-R3.down[1]);
      // タッチ（スマホ）は、1本指のドラッグ＝平行移動。回転は ↺ ↻ ボタンだけ（PCのマウスは従来どおりドラッグで回転）
      // 触っている間に2本目の指が着いた後や、ピンチ直後（指が残っている間）は回転させない。タッチは着いてすぐ（ピンチの準備）も動かさない
      if(R3.multi||(e.pointerType=='touch'&&performance.now()-R3.t0<150)){}
      else if(e.pointerType!='touch'&&(SET.ctl=='std')==R3.rot&&R3.moved>5){R3.dAz-=(e.clientX-prev[0])*.006;R3.dEl=Math.max(-.7,Math.min(.6,R3.dEl+(e.clientY-prev[1])*.004));R3.moved=99}else if(R3.moved>5){const sc=R3.dist*R3.zoom*Math.tan(R3.cam.fov*Math.PI/360)*2/innerHeight;const dx=(e.clientX-prev[0])*sc,dy=(e.clientY-prev[1])*sc*1.5,ca=Math.cos(R3.az),sa=Math.sin(R3.az);R3.pan.x-=dx*ca+dy*sa;R3.pan.z-=-dx*sa+dy*ca;R3.pan.x=Math.max(-20,Math.min(20,R3.pan.x));R3.pan.z=Math.max(-14,Math.min(14,R3.pan.z))}
    }
    if(R3.pts.size==2){const [a,b]=[...R3.pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),cx=(a[0]+b[0])/2,cy=(a[1]+b[1])/2;R3.moved=99;if(R3.pd)setZ(R3.zoom*R3.pd/d);R3.pd=d;
      if(R3.pc){const sc=R3.dist*R3.zoom*Math.tan(R3.cam.fov*Math.PI/360)*2/innerHeight,dx=(cx-R3.pc[0])*sc,dy=(cy-R3.pc[1])*sc*1.5,ca=Math.cos(R3.az),sa=Math.sin(R3.az);R3.pan.x-=dx*ca+dy*sa;R3.pan.z-=-dx*sa+dy*ca;R3.pan.x=Math.max(-20,Math.min(20,R3.pan.x));R3.pan.z=Math.max(-14,Math.min(14,R3.pan.z))}
      R3.pc=[cx,cy]}
  });
  const up=e=>{R3.pts.delete(e.pointerId);R3.pd=null;R3.pc=null;if(!R3.pts.size)R3.multi=false};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  const zb=document.createElement('div');zb.id='zoomBtns';
  zb.innerHTML='<button id="zIn">＋</button><button id="zOut">－</button><button id="zL" title="左へ回す">↺</button><button id="zR" title="右へ回す">↻</button><button id="zRs">⟲</button><button id="zView" title="視点切替">👁</button>';
  document.body.appendChild(zb);
  $('zIn').onclick=()=>setZ(R3.zoom/1.2);$('zOut').onclick=()=>setZ(R3.zoom*1.2);$('zRs').onclick=()=>{setZ(1);R3.pan.set(0,0,0);R3.dAz=0;R3.dEl=0};
  $('zL').onclick=()=>{R3.dAz-=.4};$('zR').onclick=()=>{R3.dAz+=.4};
  $('zView').onclick=()=>{const n=VIEW_ORDER[(VIEW_ORDER.indexOf(SET.view)+1)%VIEW_ORDER.length];$('sView').value=n;saveSet();R3.pan.set(0,0,0);setZ(1)};
  addEventListener('resize',fit3d);fit3d();
  cv.addEventListener('pointermove',e=>{pickRay(e);R3.hover=pickTile()?.id??null;cv.style.cursor=R3.hover!=null?'pointer':'default';R3.mx=e.clientX/innerWidth-.5;R3.my=e.clientY/innerHeight-.5});
  cv.addEventListener('pointerup',e=>{if(R3.moved>5)return;pickRay(e);const t=pickTile();if(t)onPick(t)});
  loop3d();
}
function slab(depth){
  const w=TW-2*BV,h=TH-2*BV,r=.11,s=new THREE.Shape();
  s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
  s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
  s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
  s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const g=new THREE.ExtrudeGeometry(s,{depth:depth-2*BV,bevelEnabled:true,bevelThickness:BV,bevelSize:BV,bevelSegments:6,curveSegments:10});
  g.translate(0,0,-(depth-2*BV)/2);return g;
}
// 縦長のスマホ：上の情報（相手カード・局の情報）と下の自分用パネルの間に、卓が収まるように位置と大きさを決める
function hudBand(){
  const w=innerWidth,h=innerHeight;
  if(w>=760||h<w)return null;
  const vis=e=>e&&getComputedStyle(e).display!=='none';
  let top=0,bot=h;
  for(const e of [document.getElementById('cpuBox')])if(vis(e))top=Math.max(top,e.getBoundingClientRect().bottom);
  for(const id of ['playBox','buildBox']){const e=document.getElementById(id);if(vis(e))bot=Math.min(bot,e.getBoundingClientRect().top)}
  return {top:Math.round(top),bot:Math.round(bot)};
}
function applyView(){const {cam}=R3,w=innerWidth,h=innerHeight;cam.setViewOffset(w,h,0,R3.y,w,h);cam.updateProjectionMatrix();placeMid()}
// 賭けカリカリの枠の縦位置：卓の中央。PCの作牌中は、中央にある作牌パネルの下へ下げる
function placeMid(){
  const m=document.querySelector('.mid'),bb=document.getElementById('buildBox'),h=innerHeight;let y=h/2-R3.y;
  if(m&&bb&&innerWidth>=760&&h>480&&getComputedStyle(bb).display!=='none'){const r=bb.getBoundingClientRect();y=Math.max(y,r.bottom+m.getBoundingClientRect().height/2+8)}
  document.documentElement.style.setProperty('--midY',y+'px');
}
function fit3d(){
  const {ren,cam,target}=R3,w=innerWidth,h=innerHeight,a=w/h;
  ren.setSize(w,h,false);cam.aspect=a;
  R3.base=Math.max(34,17/(Math.tan(cam.fov*Math.PI/360)*a));
  const b=hudBand();
  R3.bk=b?b.top+','+b.bot+','+w+','+h:w+','+h;
  R3.tS=1;R3.tY=Math.min(20,h*.03);
  if(b){R3.tS=Math.max(.55,Math.min(1,(b.bot-b.top-6)/(.78*w)));R3.tY=h/2-(b.top+b.bot)/2}
  if(R3.s==null){R3.s=R3.tS;R3.y=R3.tY}
  R3.dist=R3.base/R3.s;applyView();
}
/* ---- 牌の絵柄 ---- */
const INK={
  i:{man:'#161616',red:'#b3261e',blue:'#1f4fa3',green:'#1f7a3a',blk:'#161616',white:'#fffdf4'},
  b:{man:'#eeeeee',red:'#ff7b72',blue:'#7aa7ff',green:'#6fd68a',blk:'#eeeeee',white:'#2a2a2a'}
};
const PIN={
  1:[[.5,.5]],2:[[.5,.27],[.5,.73]],3:[[.27,.2],[.5,.5],[.73,.8]],
  4:[[.28,.27],[.72,.27],[.28,.73],[.72,.73]],5:[[.28,.27],[.72,.27],[.5,.5],[.28,.73],[.72,.73]],
  6:[[.28,.2],[.72,.2],[.28,.5],[.72,.5],[.28,.8],[.72,.8]],
  7:[[.2,.12],[.5,.22],[.8,.32],[.28,.6],[.72,.6],[.28,.85],[.72,.85]],
  8:[[.28,.15],[.72,.15],[.28,.38],[.72,.38],[.28,.62],[.72,.62],[.28,.85],[.72,.85]],
  9:[[.22,.2],[.5,.2],[.78,.2],[.22,.5],[.5,.5],[.78,.5],[.22,.8],[.5,.8],[.78,.8]]
};
const SOU={
  2:[[.5,.27],[.5,.73]],3:[[.5,.27],[.3,.73],[.7,.73]],4:[[.3,.27],[.7,.27],[.3,.73],[.7,.73]],
  5:[[.3,.27],[.7,.27],[.5,.5],[.3,.73],[.7,.73]],6:[[.22,.27],[.5,.27],[.78,.27],[.22,.73],[.5,.73],[.78,.73]],
  7:[[.5,.17],[.22,.5],[.5,.5],[.78,.5],[.22,.83],[.5,.83],[.78,.83]],
  8:[[.15,.27],[.38,.27],[.62,.27],[.85,.27],[.15,.73],[.38,.73],[.62,.73],[.85,.73]],
  9:[[.22,.2],[.5,.2],[.78,.2],[.22,.5],[.5,.5],[.78,.5],[.22,.8],[.5,.8],[.78,.8]]
};
function faceTex(k,v,rd){
  const key=k+v+(rd?'r':'');if(R3.tex.has(key))return R3.tex.get(key);
  const W=256,H=380,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),P=INK[v];
  x.textAlign='center';x.textBaseline='middle';
  if(k<27){
    const s=k/9|0,n=k%9+1;
    if(s==0){
      x.fillStyle=rd?P.red:P.man;x.font='bold 150px "Yu Mincho","Hiragino Mincho ProN",serif';x.fillText('一二三四五六七八九'[n-1],W/2,120);
      x.fillStyle=P.red;x.font='bold 120px "Yu Mincho","Hiragino Mincho ProN",serif';x.fillText('萬',W/2,270);
    }else if(s==1){
      const r=n==1?88:n<=3?50:n<=6?44:n==9?33:36;
      PIN[n].forEach(([u,w],i)=>{
        const px=W*(.12+u*.76),py=H*(.07+w*.86);
        const col=rd||n==1?P.red:(n==5&&i==2)?P.red:n==7&&i<3?P.green:(n==9?(i%3==1?P.red:i%3==0?P.green:P.blue):(n>=6?(i%2?P.green:P.blue):P.blue));
        x.fillStyle=col;x.beginPath();x.arc(px,py,r,0,7);x.fill();
        x.fillStyle=P.white;x.beginPath();x.arc(px,py,r*.72,0,7);x.fill();
        x.fillStyle=col;x.beginPath();x.arc(px,py,r*.5,0,7);x.fill();
        x.fillStyle=P.white;x.beginPath();x.arc(px,py,r*.2,0,7);x.fill();
        if(n==1){x.strokeStyle=P.red;x.lineWidth=5;for(let a=0;a<12;a++){x.beginPath();x.arc(px,py,r*.88,a*.52,a*.52+.3);x.stroke()}}
      });
    }else{
      if(n==1){
        const E=(cx,cy,rx,ry,rot,col)=>{x.fillStyle=col;x.beginPath();x.ellipse(cx,cy,rx,ry,rot,0,7);x.fill()};
        // 止まり木（竹）
        x.save();x.translate(128,296);
        x.fillStyle=P.green;x.beginPath();if(x.roundRect)x.roundRect(-100,-12,200,24,10);else x.rect(-100,-12,200,24);x.fill();
        x.strokeStyle=P.white;x.lineWidth=3;[-60,0,60].forEach(px=>{x.beginPath();x.moveTo(px,-11);x.lineTo(px,11);x.stroke()});
        x.restore();
        // 尾羽（扇）
        [[-.75,P.green],[-.38,P.red],[0,P.green],[.38,P.red],[.75,P.green]].forEach(([ang,col])=>{
          x.save();x.translate(128,238);x.rotate(ang);
          E(0,62,17,62,0,col);
          E(0,108,9,9,0,P.white);E(0,108,5,5,0,P.blue);
          x.restore();
        });
        // 脚
        x.strokeStyle=P.red;x.lineWidth=7;
        x.beginPath();x.moveTo(110,250);x.lineTo(104,290);x.moveTo(146,250);x.lineTo(152,290);x.stroke();
        // 胴・翼・胸
        E(128,190,54,76,0,P.green);
        E(128,205,30,50,0,P.red);
        E(98,190,22,52,.25,P.blue);E(158,190,22,52,-.25,P.blue);
        x.strokeStyle=P.white;x.lineWidth=3;
        for(let i=0;i<4;i++){x.beginPath();x.arc(128,170+i*22,22,.2,Math.PI-.2);x.stroke()}
        // 頭・冠
        E(128,100,34,34,0,P.green);
        x.strokeStyle=P.red;x.lineWidth=6;
        [[-18,-.5],[0,0],[18,.5]].forEach(([dx,an])=>{x.save();x.translate(128+dx*.6,70);x.rotate(an);x.beginPath();x.moveTo(0,0);x.lineTo(0,-26);x.stroke();E(0,-30,6,6,0,P.red);x.restore()});
        // くちばし・目
        x.fillStyle=P.red;x.beginPath();x.moveTo(156,92);x.lineTo(196,106);x.lineTo(156,116);x.closePath();x.fill();
        E(138,94,9,9,0,P.white);E(140,94,5,5,0,P.blk);
      }else{
        const stick=(px,py,w,h,ang,col)=>{
          x.save();x.translate(px,py);x.rotate(ang);
          x.fillStyle=col;x.beginPath();
          if(x.roundRect)x.roundRect(-w/2,-h/2,w,h,w*.38);else x.rect(-w/2,-h/2,w,h);
          x.fill();
          x.fillStyle="rgba(255,255,255,.28)";x.fillRect(-w/2+w*.14,-h/2+h*.1,w*.18,h*.8);
          x.fillStyle="rgba(0,0,0,.28)";x.fillRect(w/2-w*.3,-h/2+h*.1,w*.16,h*.8);
          x.strokeStyle=P.white;x.lineWidth=3.5;
          x.beginPath();x.moveTo(-w/2+2,0);x.lineTo(w/2-2,0);x.stroke();
          x.beginPath();x.moveTo(-w/2+3,-h/2+h*.16);x.lineTo(w/2-3,-h/2+h*.16);x.moveTo(-w/2+3,h/2-h*.16);x.lineTo(w/2-3,h/2-h*.16);x.lineWidth=2.5;x.stroke();
          x.restore();
        };
        if(n==8){
          [[42,100,0],[214,100,0],[90,100,-.28],[166,100,.28],[42,282,0],[214,282,0],[90,282,.28],[166,282,-.28]]
            .forEach(([px,py,an])=>stick(px,py,34,140,an,P.green));
        }else{
          const sh=n<=3?138:n<=6?132:n==7?104:92,sw=n==9||n==7||n==6?40:44;
          SOU[n].forEach(([u,v2],i)=>{
            const col=rd||(n==5&&i==2)||(n==7&&i==0)||(n==9&&i%3==1)||(n==3&&i==0)?P.red:P.green;
            stick(W*(.12+u*.76),H*(.06+v2*.88),sw,sh,0,col);
          });
        }
      }
    }
  }else{
    const h=k-27;
    x.font='bold 210px "Yu Mincho","Hiragino Mincho ProN",serif';
    if(h<4){x.fillStyle=P.blk;x.fillText(HON[h],W/2,H*.5)}
    else if(h==4){x.strokeStyle=P.blue;x.lineWidth=14;x.strokeRect(46,60,W-92,H-120)}
    else if(h==5){x.fillStyle=P.green;x.fillText('發',W/2,H*.5)}
    else{x.fillStyle=P.red;x.fillText('中',W/2,H*.5)}
  }
  const tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;tx.anisotropy=4;
  R3.tex.set(key,tx);return tx;
}
function makeTile(t){
  const g=new THREE.Group();g.rotation.order='YXZ';g.userData.id=t.id;
  const M=R3.mat,v=t.black?'b':'i';
  const body=new THREE.Mesh(R3.geo.body,t.black?M.bk:M.gl);
  body.castShadow=true;body.receiveShadow=true;g.add(body);
  const dm=(tx)=>new THREE.MeshStandardMaterial({map:tx,bumpMap:tx,bumpScale:1.6,transparent:true,roughness:.38,envMapIntensity:.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const pg=new THREE.PlaneGeometry(.72,1.08);
  const fd=new THREE.Mesh(pg,dm(faceTex(t.k,v,t.red)));fd.position.z=TD/2+.002;
  const bd=new THREE.Mesh(pg,dm(faceTex(t.k,v,t.red)));bd.position.z=-TD/2-.002;bd.rotation.y=Math.PI;
  g.add(fd,bd);g.userData.bd=bd;g.userData.fd=fd;
  const cp=new THREE.Mesh(new THREE.PlaneGeometry(TW-2*BV-.06,TH-2*BV-.06),R3.mat.cap);cp.position.z=-TD/2-.004;cp.rotation.y=Math.PI;cp.visible=false;g.add(cp);g.userData.cp=cp;
  const wm=new THREE.Mesh(new THREE.BoxGeometry(.6,.07,.14),R3.mark.r);wm.position.set(0,TH/2+.09,0);wm.visible=false;g.add(wm);g.userData.wm=wm;
  const gm=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),R3.mark.g);gm.position.set(0,TH/2+.1,.25);gm.visible=false;g.add(gm);g.userData.gm=gm;
  const hl=new THREE.Mesh(new THREE.PlaneGeometry(TW+.5,TH+.5),R3.mark.h);hl.position.z=TD/2+.02;hl.visible=false;g.add(hl);g.userData.hl=hl;
  {const ha=new THREE.Mesh(new THREE.PlaneGeometry(TW*5,TW*5),R3.mark.halo);ha.position.z=0;ha.visible=false;g.add(ha);g.userData.halo=ha;
   const bm=new THREE.Mesh(R3.beamG,R3.mark.beam);bm.rotation.x=Math.PI/2;bm.position.z=TD/2+2.6;bm.visible=false;g.add(bm);g.userData.beam=bm;
   const ry=new THREE.Mesh(new THREE.PlaneGeometry(TW*9,TW*9),R3.mark.rays);ry.position.z=.01;ry.visible=false;g.add(ry);g.userData.rays=ry}
  return g;
}
/* ---- 配置 ---- */
function layout3d(){
  const L=new Map(),by=new Map(),P=G.p,C=G.c,over=G.phase=='over';
  const FACE=-.2;
  const stand=(t,x,z,who,face)=>{by.set(t.id,t);L.set(t.id,{x,y:.72,z,rx:FACE,ry:(who=='p'||face)?0:Math.PI})};
  const flat=(t,x,z,who,up=true,yaw=0)=>{by.set(t.id,t);L.set(t.id,{x,y:TD/2,z,rx:up?-Math.PI/2:Math.PI/2,ry:(who=='p'?0:Math.PI)+yaw})};
  // 河の位置。第一打牌はリーチで横向きなので、1段目はその分ずらす
  const rx=(i,s)=>{const col=i%6,row=(i/6)|0,e=RII&&row==0?(TH-TW):0,b=(col-2.5)*1.06*s;return b+(i==0?e/2:col>0?e:0)*s};
  if(!P||!C)return {L,by};
  if(G.phase=='build'||G.phase=='dora'){
    const sel=new Set(P.sel.map(x=>x.id));
    P.pool.filter(x=>!sel.has(x.id)).forEach((t,i)=>stand(t,(i%17-8)*SP,i<17?9.9:7.9,'p'));
    P.sel.forEach((t,i)=>stand(t,(i-6)*SP,5.2,'p'));
    C.pool.forEach((t,i)=>stand(t,(i%17-8)*SP,i<17?-9.9:-7.9,'c'));
  }else{
    P.tenpai.forEach((t,i)=>G.tip?flat(t,(i-6)*SP,7.4,'p'):stand(t,(i-6)*SP,7.4,'p'));
    P.hand.forEach((t,i)=>stand(t,(i-10)*SP,9.7,'p'));
    C.tenpai.forEach((t,i)=>G.tip?flat(t,(i-6)*SP,-7.4,'c'):stand(t,(i-6)*SP,-7.4,'c',over));
    C.hand.forEach((t,i)=>stand(t,(i-10)*SP,-9.7,'c',over));
    P.disc.forEach((t,i)=>flat(t,rx(i,1),1.7+((i/6)|0)*1.75,'p',true,RII&&i==0?Math.PI/2:0));
    C.disc.forEach((t,i)=>flat(t,rx(i,-1),-(1.7+((i/6)|0)*1.75),'c',true,RII&&i==0?Math.PI/2:0));
  }
  // 両サイドの山（対局中も残す）。ドラ表示牌は表向き、裏ドラ表示牌は和了で開く
  const wl=G.dora&&G.dora.wall;
  if(wl){
    const D=G.dora,wall=(t,i,x,yw)=>{
      const up=t===D.ind||(t===D.ura&&D.uraOpen);
      by.set(t.id,t);L.set(t.id,{x,y:TD/2+(i&1)*(TD+.01),z:((i>>1)-8)*(TW+.015),rx:up?-Math.PI/2:Math.PI/2,ry:yw});
    };
    wl.l.forEach((t,i)=>wall(t,i,-14.2,Math.PI/2));
    wl.r.forEach((t,i)=>wall(t,i,14.2,-Math.PI/2));
  }
  return {L,by};
}
function makeStick(){
  const c=document.createElement('canvas');c.width=256;c.height=40;const x=c.getContext('2d');
  x.fillStyle='#f4f1e6';x.fillRect(0,0,256,40);
  x.fillStyle='#222';for(let i=0;i<10;i++)x.fillRect(22+i*9,12,4,4),x.fillRect(22+i*9,24,4,4);
  x.fillStyle='#fff';x.fillRect(150,6,0,0);
  x.fillStyle='#d22';x.beginPath();x.arc(128,20,7,0,7);x.fill();
  const tx=new THREE.CanvasTexture(c),w=new THREE.MeshStandardMaterial({color:0xf4f1e6,roughness:.4});
  const m=new THREE.Mesh(new THREE.BoxGeometry(2.8,.16,.4),[w,w,new THREE.MeshStandardMaterial({map:tx,roughness:.4}),w,w,w]);
  m.castShadow=true;m.visible=false;m.userData.on=false;return m;
}
function syncSticks(){
  if(!R3.stk){R3.stk={p:makeStick(),c:makeStick()};R3.stk.p.position.z=.6;R3.stk.c.position.z=-.6;R3.stk.c.rotation.y=Math.PI;
    R3.scene.add(R3.stk.p,R3.stk.c)}
  [['p',G.p],['c',G.c]].forEach(([k,X])=>{
    const m=R3.stk[k],on=!!(RII&&X&&X.disc.length>0&&G.phase!='build'&&G.phase!='dora');
    if(on&&!m.userData.on){setTimeout(()=>sfx.stick(),550);m.position.y=9;m.position.x=0;m.rotation.y=(k=='p'?0:Math.PI)+1.2;m.rotation.x=.6}
    m.userData.on=on;m.visible=on;
  });
}
function tickSticks(){
  if(!R3.stk)return;
  for(const k of ['p','c']){
    const m=R3.stk[k];if(!m.visible)continue;
    m.position.y+=(.12-m.position.y)*.14;
    m.rotation.x+=(0-m.rotation.x)*.14;
    const base=k=='p'?0:Math.PI;m.rotation.y+=(base-m.rotation.y)*.14;
  }
}
/* ---- 卓上のサイコロ ---- */
const DIE_FACE={1:[0,0,0],6:[Math.PI,0,0],2:[0,0,Math.PI/2],5:[0,0,-Math.PI/2],3:[-Math.PI/2,0,0],4:[Math.PI/2,0,0]};
function dieTex(n){
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  x.fillStyle='#f6f1e2';x.fillRect(0,0,128,128);
  const P={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],5:[[.27,.27],[.73,.27],[.5,.5],[.27,.73],[.73,.73]],6:[[.3,.25],[.7,.25],[.3,.5],[.7,.5],[.3,.75],[.7,.75]]}[n];
  P.forEach(([u,v])=>{x.fillStyle=n==1?'#d22':'#1a1a1a';x.beginPath();x.arc(u*128,v*128,n==1?20:11,0,7);x.fill()});
  return new THREE.CanvasTexture(c);
}
// 角を丸めた立方体: 分割した箱の頂点を、内側の箱から半径rだけの距離に押し出す
function roundedDie(s,r){
  const g=new THREE.BoxGeometry(s,s,s,8,8,8),p=g.attributes.position,n=g.attributes.normal,h=s/2-r,v=new THREE.Vector3(),q=new THREE.Vector3();
  for(let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i);q.set(Math.max(-h,Math.min(h,v.x)),Math.max(-h,Math.min(h,v.y)),Math.max(-h,Math.min(h,v.z)));
    v.sub(q);const d=v.length()||1;v.multiplyScalar(1/d);
    n.setXYZ(i,v.x,v.y,v.z);p.setXYZ(i,q.x+v.x*r,q.y+v.y*r,q.z+v.z*r);
  }
  return g;
}
// 全自動卓のサイコロ: 卓の中央のガラスのドームの中で、サイコロ2個が跳ねて転がる。一人ずつ振る
function dice3d(vals,done){
  if(!R3){if(typeof THREE=='undefined')return done();init3d()}
  diceHide3d();
  const faces=[2,5,1,6,3,4],mats=faces.map(n=>new THREE.MeshStandardMaterial({map:dieTex(n),roughness:.3,envMapIntensity:.8}));
  const grp=new THREE.Group(),list=[],FY=.12+.62;
  const well=new THREE.Mesh(new THREE.CylinderGeometry(2.9,2.9,.12,48),new THREE.MeshBasicMaterial({color:0x17181c}));well.position.y=.06;well.receiveShadow=true;
  const rim=new THREE.Mesh(new THREE.TorusGeometry(2.9,.12,10,48),new THREE.MeshStandardMaterial({color:0xd0d4da,metalness:.9,roughness:.25}));rim.rotation.x=Math.PI/2;rim.position.y=.12;
  const dome=new THREE.Mesh(new THREE.SphereGeometry(2.9,36,18,0,Math.PI*2,0,Math.PI/2),new THREE.MeshPhysicalMaterial({color:0xd6ecff,transparent:true,opacity:.14,roughness:.05,metalness:0,side:THREE.DoubleSide,depthWrite:false}));dome.position.y=.12;
  grp.add(well,rim,dome);grp.scale.setScalar(.8);R3.scene.add(grp);
  vals.forEach((v,i)=>{
    const m=new THREE.Mesh(roundedDie(1.25,.18),mats);m.castShadow=true;
    const fq=new THREE.Quaternion().setFromEuler(new THREE.Euler(...DIE_FACE[v])),yq=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.random()*6.28);
    const ang=Math.random()*6.28,sp=7+Math.random()*3;
    m.userData={vel:new THREE.Vector3(Math.cos(ang)*sp,3+Math.random()*3,Math.sin(ang)*sp),
      av:new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(14+Math.random()*8),
      tq:yq.multiply(fq),tp:new THREE.Vector3((i?.8:-.8)+(Math.random()-.5)*.2,FY,(Math.random()-.5)*.5),sq:null,sp:null};
    m.position.set(i?1.1:-1.1,2.2,(Math.random()-.5)*1.2);list.push(m);grp.add(m);
  });
  R3.dice={list,done,fired:false,grp,dome,t:0,last:performance.now(),snd:0,FY};
}
function diceHide3d(){if(R3&&R3.dice){R3.scene.remove(R3.dice.grp);R3.dice=null}}
function tickDice(){
  const D=R3&&R3.dice;if(!D)return;
  const now=performance.now(),dt=Math.min(.04,(now-D.last)/1000);D.last=now;D.t+=dt;
  const T1=1.5,T2=2.1,R=1.95,Q=new THREE.Quaternion(),ax=new THREE.Vector3();
  D.dome.position.x=D.t<T1?Math.sin(D.t*70)*.03:0;
  D.list.forEach(m=>{
    const u=m.userData;
    if(D.t<T1){
      u.vel.y-=28*dt;m.position.addScaledVector(u.vel,dt);
      if(m.position.y<D.FY){m.position.y=D.FY;if(u.vel.y<-2){u.vel.y=-u.vel.y*.55;u.vel.x*=.9;u.vel.z*=.9;u.av.x+=(Math.random()-.5)*10;u.av.z+=(Math.random()-.5)*10;if(now-D.snd>70){D.snd=now;try{sfx.tile()}catch(e){}}}else u.vel.y=0}
      const r=Math.hypot(m.position.x,m.position.z);
      if(r>R){const nx=m.position.x/r,nz=m.position.z/r;m.position.x=nx*R;m.position.z=nz*R;const dn=u.vel.x*nx+u.vel.z*nz;if(dn>0){u.vel.x-=1.7*dn*nx;u.vel.z-=1.7*dn*nz;if(now-D.snd>70){D.snd=now;try{sfx.tile()}catch(e){}}}}
      const k=Math.max(0,1-1.1*dt);u.vel.x*=k;u.vel.z*=k;u.av.multiplyScalar(Math.max(0,1-.8*dt));
      const w=u.av.length();if(w>1e-3){ax.copy(u.av).divideScalar(w);Q.setFromAxisAngle(ax,w*dt);m.quaternion.premultiply(Q)}
    }else{
      if(!u.sq){u.sq=m.quaternion.clone();u.sp=m.position.clone()}
      const e=Math.min(1,(D.t-T1)/(T2-T1)),ee=1-Math.pow(1-e,3);
      m.position.lerpVectors(u.sp,u.tp,ee);m.position.y=D.FY+Math.sin(ee*Math.PI)*.35*(1-ee);
      m.quaternion.slerpQuaternions(u.sq,u.tq,ee);
    }
  });
  if(D.t<T1){const [a,b]=D.list;const dx=b.position.x-a.position.x,dz=b.position.z-a.position.z,d=Math.hypot(dx,dz);if(d<1.3&&d>1e-3){const nx=dx/d,nz=dz/d,o=(1.3-d)/2;a.position.x-=nx*o;a.position.z-=nz*o;b.position.x+=nx*o;b.position.z+=nz*o;const va=a.userData.vel,vb=b.userData.vel,rel=(va.x-vb.x)*nx+(va.z-vb.z)*nz;if(rel>0){va.x-=rel*nx;va.z-=rel*nz;vb.x+=rel*nx;vb.z+=rel*nz}}}
  if(D.t>=T2&&!D.fired){D.fired=true;setTimeout(()=>{if(R3.dice===D)D.done()},350)}
}
function sync3d(){
  if(!R3){if(typeof THREE=='undefined')return;init3d()}
  syncSticks();
  const {L,by}=layout3d();
  R3.layout=L;R3.byId=by;
  const wl=G.dora&&G.dora.wall,wUp=t=>t===G.dora.ind||(t===G.dora.ura&&G.dora.uraOpen),hid=new Set(((G.phase=='build'||G.phase=='dora')?G.c.pool:[...G.c.tenpai,...G.c.hand]).concat(wl?[...wl.l,...wl.r].filter(t=>!wUp(t)):[]).map(x=>x.id));
  // 追加・削除
  for(const [id,m] of R3.meshes)if(!L.has(id)){R3.scene.remove(m);R3.meshes.delete(id)}
  for(const [id,tg] of L){
    let m=R3.meshes.get(id);const t=by.get(id);
    if(!m){
      m=makeTile(t);m.position.set(tg.x,tg.y+6,tg.z-3);m.rotation.set(tg.rx,tg.ry,0);
      R3.scene.add(m);R3.meshes.set(id,m);
    }
    const mine=G.p&&G.p.hand.includes(t);
    const inWall=!!(wl&&(wl.l.includes(t)||wl.r.includes(t)))&&!wUp(t);
    // 山の牌は透明牌も黒牌も同じ見た目（中身が分からない）
    m.children[0].material=inWall?R3.mat.bk:t.black?R3.mat.bk:R3.mat.gl;
    m.userData.cp.visible=inWall; // 山は背面が黒、側面が白
    m.userData.bd.visible=(!t.black||t.glass)&&!inWall;
    // 老人の伏せ牌（黒牌）は、後ろへ回り込んでも表が見えないよう絵柄を消す（決着後は公開）
    m.userData.fd.visible=!inWall&&!(t.black&&!t.glass&&hid.has(t.id)&&G.phase!='over');
    m.userData.gm.visible=!!(t.black&&t.glass)&&!inWall;
    {const on=(t===ronHL());m.userData.hl.visible=on;m.userData.halo.visible=false;m.userData.rays.visible=on;m.userData.beam.visible=false;m.userData.rays.children&&0}
    m.userData.wm.visible=!!(mine&&G.p.waits.includes(t.k));
  }
}
function pickRay(e){
  const r=R3.ren.domElement.getBoundingClientRect();
  R3.mouse.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));
  R3.ray.setFromCamera(R3.mouse,R3.cam);
}
function pickable(t){
  if(!t||!G.p)return false;
  if(G.phase=='dora')return G.rf=='p'&&!!G.dora.walls&&[...G.dora.walls.l,...G.dora.walls.r].includes(t);
  if(G.phase=='build')return G.p.pool.includes(t);
  if(G.phase=='discard')return G.p.hand.includes(t);
  return false;
}
function pickTile(){
  const hits=R3.ray.intersectObjects([...R3.meshes.values()],true);
  for(const h of hits){if(!h.object.visible)continue;let o=h.object;while(o&&o.userData.id==null)o=o.parent;if(o){const u=o.userData;if(h.object===u.hl||h.object===u.halo||h.object===u.rays||h.object===u.beam)continue;const t=R3.byId.get(o.userData.id);if(pickable(t))return t;break}}
  return null;
}
function onPick(t){
  const P=G.p;
  if(G.phase=='dora'){chooseDora(t);return}
  if(G.phase=='build'){
    sfx.select();
    if(P.sel.includes(t))P.sel=P.sel.filter(y=>y.id!=t.id);
    else if(P.sel.length<13)P.sel.push(t);
    P.sel.sort((a,b)=>a.k-b.k);render();
  }else if(G.phase=='discard'){
    const i=P.hand.indexOf(t);if(i>=0)discard(i);
  }
}
function tickFire(m){
  if(!R3.fire){
    const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
    const g=x.createRadialGradient(32,40,2,32,36,30);g.addColorStop(0,'rgba(255,255,230,1)');g.addColorStop(.3,'rgba(255,180,50,.85)');g.addColorStop(.7,'rgba(230,50,10,.35)');g.addColorStop(1,'rgba(120,10,0,0)');
    x.fillStyle=g;x.beginPath();x.moveTo(32,0);x.bezierCurveTo(60,22,64,42,32,64);x.bezierCurveTo(0,42,4,22,32,0);x.fill();
    R3.fireTex=new THREE.CanvasTexture(c);R3.fire=[];
    for(let i=0;i<70;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:R3.fireTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));sp.visible=false;sp.userData={life:0,max:1};R3.scene.add(sp);R3.fire.push(sp)}
  }
  let spawn=m?3:0;
  for(const sp of R3.fire){const d=sp.userData;
    if(d.life<=0&&spawn>0){spawn--;d.life=d.max=28+Math.random()*30;d.vx=(Math.random()-.5)*.012;d.vz=(Math.random()-.5)*.012;d.s=.4+Math.random()*.5;
      sp.position.set(m.position.x+(Math.random()-.5)*1.3,m.position.y+.1+Math.random()*.5,m.position.z+(Math.random()-.5)*1.4);sp.visible=true}
    if(d.life>0){d.life--;const k=d.life/d.max;sp.position.x+=d.vx+Math.sin(d.life*.4)*.006;sp.position.z+=d.vz;sp.position.y+=.03+.03*(1-k);
      sp.scale.setScalar(d.s*(.3+k*.9));sp.material.opacity=Math.min(1,k*1.6)*.5;sp.material.color.setRGB(1,.08+k*.3,.02);if(d.life<=0)sp.visible=false}
  }
}
function loop3d(){
  requestAnimationFrame(loop3d);tickSticks();tickDice();R3.mark.h.opacity=.05;
  {const T=performance.now()/1000,pu=1+.18*Math.sin(T*7);R3.mark.halo.opacity=.7+.3*Math.sin(T*7);
   let lit=0;R3.fireT=null;for(const [,m] of R3.meshes){const u=m.userData;if(u.rays&&u.rays.visible){{const q=m.quaternion.clone().invert();u.beam.quaternion.copy(q);u.beam.position.set(0,2.5,0).applyQuaternion(q)}u.beam.scale.set(1+.08*Math.sin(T*9),1,1+.08*Math.sin(T*9));u.rays.material.visible=false;u.halo.scale.set(pu,pu,1);m.scale.setScalar(1.25+.02*Math.sin(T*9));if(R3.ronLight.parent!==m){m.add(R3.ronLight);R3.ronLight.position.set(0,0,1.6)}R3.ronLight.intensity=2+1.2*Math.random();lit=1;R3.fireT=m}else if(u.rays&&m.scale.x!==1&&!u.rays.visible&&m.scale.x>1.01)m.scale.setScalar(1)}if(!lit)R3.ronLight.intensity=0;tickFire(R3.fireT)}
  const {ren,scene,cam,target}=R3;
  for(const [id,m] of R3.meshes){
    const tg=R3.layout.get(id);if(!tg)continue;
    let hv=0;
    if(R3.hover===id){const t=R3.byId.get(id);if(pickable(t))hv=.45}
    if(R3.meshes.get(id).userData.rays.visible)hv+=.25;
    const dx=tg.x-m.position.x,dz=tg.z-m.position.z,d=Math.hypot(dx,dz);
    const k=.17;
    m.position.x+=dx*k;m.position.z+=dz*k;
    m.position.y+=(tg.y+hv+Math.min(2.2,d*.28)-m.position.y)*k;
    m.rotation.x+=(tg.rx-m.rotation.x)*k;m.rotation.y+=(tg.ry-m.rotation.y)*k;
  }
  // 画面上の情報の高さが変わったら、卓の位置・大きさを合わせ直す（なめらかに動かす）
  if((R3.fc=(R3.fc||0)+1)%12==0){placeMid();const b=hudBand(),k=b?b.top+','+b.bot+','+innerWidth+','+innerHeight:innerWidth+','+innerHeight;if(k!==R3.bk)fit3d()}
  if(Math.abs(R3.s-R3.tS)>.002||Math.abs(R3.y-R3.tY)>.3){R3.s+=(R3.tS-R3.s)*.15;R3.y+=(R3.tY-R3.y)*.15;R3.dist=R3.base/R3.s;applyView()}
  const V=VIEWS[SET.view]||VIEWS.angle;
  if(R3.lastView!==SET.view){R3.lastView=SET.view;R3.dAz=0;R3.dEl=0}
  R3.el+=(Math.max(.2,Math.min(1.5,V.el+R3.dEl))-R3.el)*.2;R3.az+=(V.az+R3.dAz-R3.az)*.2;
  const dd=R3.dist*V.k*R3.zoom,sw=SET.sway?1:0;
  cam.position.set(target.x+R3.pan.x+dd*Math.sin(R3.az)*Math.cos(R3.el)+R3.mx*3*sw,target.y+dd*Math.sin(R3.el)+R3.my*-1.5*sw,target.z+R3.pan.z+dd*Math.cos(R3.az)*Math.cos(R3.el));
  cam.lookAt(target.x+R3.pan.x,target.y,target.z+R3.pan.z);
  ren.render(scene,cam);
}
