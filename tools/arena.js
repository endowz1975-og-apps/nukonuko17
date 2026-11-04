// 強さの測定。プロジェクトのフォルダで: node tools/arena.js 80 smart  (回数 bot種別[random|smart|honor] 段階[カンマ区切り] learn)
// 強さの測定: 固定のプレイヤーbot（作牌は最適、河はランダム、ロンは必ず）に対する各段階の成績
global.Option=function(l,v){};global.window=global;
const fs=require("fs");
const s=fs.readFileSync("index.html","utf8");
const js=s.split("<script>")[1].split("</script>")[0];
const els={};
global.document={body:{appendChild(){}},addEventListener(){},querySelectorAll:()=>[],getElementById:id=>els[id]||(els[id]={add(){},style:{},classList:{add(){}},dataset:{},appendChild(){},set innerHTML(v){},set textContent(v){},onclick:null}),createElement:()=>({style:{},classList:{add(){}},appendChild(){},set innerHTML(v){},className:'',setProperty(){},remove(){}})};
global.setTimeout=(f)=>{q.push(f)};global.setInterval=()=>0;global.clearInterval=()=>{};
global.localStorage={getItem:()=>null,setItem(){}};
const q=[];
const N=+process.argv[2]||150;global.BOTARG=process.argv[3]||'random';
eval(js.slice(0,js.lastIndexOf("showTitle();"))+`
SET.firstBy='random';SET.doraBy='random';SET.time=0;SET.red=!!process.env.RED;
const out={};let HAB=null;const BOT=BOTARG;
for(const L of (process.argv[4]||'baka,weak,normal,strong,max').split(',')){
  {const cc=CHARS.find(c=>c.id==L);SET.opp=cc?cc.lv:L;SET.char=cc?cc.id:"";}
  const st={ryu:0,n:0,cpuWin:0,pWin:0,draw:0,cChombo:0,pChombo:0,cBuildFail:0,net:0,t:0};
  const t0=Date.now();
  for(let r=0;r<N;r++){
    G={pb:1000,cb:1000,base:100,stake:100,first:r%2?'p':'c',roundNo:0};
    if(process.argv[5]=='learn'&&HAB)G.habit=HAB;q.length=0;newRound();while(q.length)q.shift()();
    if(G.phase=='dora'){const w=G.dora.walls;const all=[...w.l,...w.r];chooseDora(all[Math.random()*all.length|0])}
    if(!G.p||G.p.pool.length!=34){continue}
    const b=cpuBuild(G.p.pool,{own:G.p.own,doras:G.dora.dk,reds:!!SET.red});
    if(!b){continue}
    G.p.sel=b;confirmBuild(false);
    let guard=0;
    while(G.phase!='over'&&guard++<400){
      while(q.length)q.shift()();
      if(G.phase=='discard'){
        if(BOT=='smart'){
          const inf=inferDanger(true,'c'),cd=new Set(G.c.disc.map(t=>t.k));let bi=0,bs=1e9;
          G.p.hand.forEach((t,i)=>{let d=cd.has(t.k)?0:(inf.prob?inf.prob[t.k]*100:(inf.D&&inf.D.has(t.k)?100:1));d+=Math.random()*.05;if(G.p.waits.includes(t.k))d+=1000;if(d<bs){bs=d;bi=i}});
          discard(bi);
        }else if(BOT=='honor'){
          let bi=0,bs=1e9;G.p.hand.forEach((t,i)=>{let d=(t.k>=27?0:(t.k%9==0||t.k%9==8)?1:(t.k%9==1||t.k%9==7)?2:3)+Math.random()*.4;if(G.p.waits.includes(t.k))d+=100;if(d<bs){bs=d;bi=i}});discard(bi);
        }else discard(Math.random()*G.p.hand.length|0);
      }
      else if(G.phase=='ron'){if(G.p.waits.includes(G.last.k)&&!furiten(G.p)&&!G.p.passed)document.getElementById('bRon').onclick();if(G.phase=='ron')document.getElementById('bPass').onclick()}
      else if(G.phase=='build')break;
    }
    while(q.length)q.shift()();
    if(process.argv[5]=='learn')HAB=G.habit;const d=G.cb-1000;
    st.n++;st.net+=d;
    if(d>0)st.cpuWin++;else if(d<0)st.pWin++;else st.draw++;
  }
  st.t=Date.now()-t0;out[L]=st;
}
console.log(JSON.stringify(out,null,1));
`);
