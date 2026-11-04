// ルール判定のテスト: node test.js
const fs=require('fs');
const s=fs.readFileSync('index.html','utf8');
const js=s.split('<script>')[1].split('</script>')[0];
const logic=js.slice(0,js.indexOf('let G,timerId'));
const api=new Function(logic+';return {isWin34,scoreHand,evalTenpai,cpuBuild,cnt,shuffle,decomps,tier,payMult,meets,setBind:v=>{BINDA=v},setRii:v=>{RII=v},mjPoints,setRound:v=>{ROUNDW=v},YAO};')();
const {mjPoints}=api;
const {isWin34,scoreHand,evalTenpai,cnt,shuffle,tier,payMult,meets}=api;
// 表記 "123m456p77z" -> 牌種の配列 (z: 1東2南3西4北5白6發7中)
const P=str=>{const out=[];let nums=[];for(const ch of str){if(/[0-9]/.test(ch))nums.push(+ch);else{for(const n of nums)out.push(ch=='m'?n-1:ch=='p'?9+n-1:ch=='s'?18+n-1:27+n-1);nums=[]}}return out};
const C=a=>{const c=Array(34).fill(0);a.forEach(k=>c[k]++);return c};
api.setRii(false);
let fail=0,pass=0;
const ok=(name,cond,info='')=>{if(cond)pass++;else{fail++;console.log('FAIL',name,info)}};
const sc=(hand,w,own=27,doras=[])=>scoreHand(C(P(hand)),{own,doras},P(w)[0]);

// 0. 赤牌: opt.rd の分だけ翻が増える
let rr0=scoreHand(C(P("234m456m678p345s55p")),{own:27,doras:[],rd:2},P('4m')[0]);
ok("red dora adds han",rr0.dc==2&&rr0.han==rr0.yh+2,JSON.stringify(rr0));
// 1. 平和＋断幺九（両面）: 234m 456m 678p 345s 55p, 待ち 2m3m の 4m
let r=sc('234m456m678p345s55p','4m');
ok('pinfu+tanyao han',r.yh==2&&r.fu==30,JSON.stringify(r));
// 2. 七対子＋断幺九
r=sc('22m44m66m33p55p77s88s','8s');
ok('chiitoi+tanyao',r.yh==3&&r.fu==25,JSON.stringify(r));
// 3. 四暗刻 単騎
r=sc('111m222p333s777m55p','5p');
ok('suuankou tanki',r.ym==1&&r.names.includes('四暗刻'),JSON.stringify(r));
// 4. 四暗刻 シャンポン ロン → 四暗刻にならない
r=sc('111m222p333s777m55p','7m'.replace('7m','5p'));
r=scoreHand(C(P('111m222p333s77m55p').concat(P('7m'))),{own:27,doras:[]},P('7m')[0]);
ok('shanpon ron is not suuankou',!(r.ym>0)&&r.names.some(n=>n.startsWith('三暗刻')),JSON.stringify(r));
// 5. 大三元
r=sc('555z666z777z234m11p','1p'.replace('1p','1p'));
r=scoreHand(C(P('555z666z777z234m11p')),{own:27,doras:[]},P('2m')[0]);
ok('daisangen',r.ym>=1&&r.names.includes('大三元'),JSON.stringify(r));
// 6. 国士無双
r=scoreHand(C(P('19m19p19s1234567z').concat(P('1m'))),{own:27,doras:[]},0);
ok('kokushi',r.ym==1,JSON.stringify(r));
// 7. 九蓮宝燈
r=scoreHand(C(P('1112345678999m').concat(P('5m'))),{own:27,doras:[]},4);
ok('chuuren',r.ym>=1,JSON.stringify(r));
// 8. 清一色
r=scoreHand(C(P('123m456m789m234m55m')),{own:27,doras:[]},P('4m')[0]);
ok('chinitsu',r.names.some(n=>n.startsWith('清一色')),JSON.stringify(r));
// 9. 場風・自風（親は東がダブ東＝2翻）
r=scoreHand(C(P('111z234m567p789s55m')),{own:27,doras:[]},P('5m')[0]);
ok('double east',r.names.filter(n=>/風/.test(n)).length==2,JSON.stringify(r));
r=scoreHand(C(P('111z234m567p789s55m')),{own:28,doras:[]},P('5m')[0]);
ok('east as non-dealer = 1 yaku',r.names.filter(n=>/風/.test(n)).length==1,JSON.stringify(r));
// 10. ドラ加算
r=scoreHand(C(P('234m456m678p345s55p')),{own:27,doras:[P('5p')[0]]},P('4m')[0]);
ok('dora count 2',r.dc==2,JSON.stringify(r));
// 11. 点数ティア
ok('tier mangan 5',tier(5,30,0)==1&&tier(4,40,0)==1&&tier(4,30,0)==0&&tier(3,70,0)==1&&tier(3,60,0)==0);
ok('tier haneman+',tier(6,30,0)==1.5&&tier(8,30,0)==2&&tier(11,30,0)==3&&tier(13,30,0)==4&&tier(0,0,1)==4);
ok('payMult low',payMult(1,30,0)==.2&&payMult(2,30,0)==.35&&payMult(3,30,0)==.5&&payMult(4,30,0)==.75);
// リーチ（第一打牌で自動リーチ）: +1翻、役なしでも役あり扱い
api.setRii(true);
r=sc('234m456m678p345s55p','4m');
ok('riichi adds 1 han',r.yh==3&&r.names.includes('リーチ 1翻'),JSON.stringify(r));
r=scoreHand(C(P('13m456p789s234p55s').concat(P('2m'))),{own:-1,doras:[]},P('2m')[0]);
api.setRii(false);const r0=scoreHand(C(P('13m456p789s234p55s').concat(P('2m'))),{own:-1,doras:[]},P('2m')[0]);api.setRii(true);
ok('riichi gives yaku to yakuless hand',!r0.hasYaku&&r.hasYaku&&r.yh==1,JSON.stringify(r));
r=scoreHand(C(P('111z234m567p789s55m')),{own:-1,doras:[]},P('5m')[0]);
ok('no seat wind when own=-1',r.names.filter(n=>/自風/.test(n)).length==0,JSON.stringify(r));
api.setRii(false);
// 場風の設定
api.setRound(-1);
r=scoreHand(C(P('111z234m567p789s55m')),{own:-1,doras:[]},P('5m')[0]);
ok('no round wind when ROUNDW=-1',!r.hasYaku||r.names.every(n=>!/風/.test(n)),JSON.stringify(r));
api.setRound(28);
r=scoreHand(C(P('222z234m567p789s55m')),{own:28,doras:[]},P('5m')[0]);
ok('south round + south seat = 2 yaku',r.names.filter(n=>/風/.test(n)).length==2,JSON.stringify(r));
api.setRound(27);
// 麻雀の点数表
ok('mj mangan',mjPoints(5,30,0,false)==8000&&mjPoints(5,30,0,true)==12000);
ok('mj 3han30fu',mjPoints(3,30,0,false)==3900&&mjPoints(3,30,0,true)==5800);
ok('mj 4han30fu',mjPoints(4,30,0,false)==7700&&mjPoints(4,40,0,false)==8000);
ok('mj 1han30fu',mjPoints(1,30,0,false)==1000);
ok('mj haneman/baiman',mjPoints(6,30,0,false)==12000&&mjPoints(8,30,0,false)==16000&&mjPoints(11,30,0,false)==24000);
ok('mj yakuman',mjPoints(13,30,1,false)==32000&&mjPoints(13,30,1,true)==48000&&mjPoints(0,0,2,false)==64000);
// 12. 縛り判定
api.setBind(5);ok('bind5 rejects 2han',!meets({hasYaku:true,han:2,fu:30,ym:0}));
api.setBind(3);ok('bind3 accepts 3han',meets({hasYaku:true,han:3,fu:30,ym:0})&&!meets({hasYaku:true,han:2,fu:30,ym:0}));
api.setBind(0);ok('bind0 needs yaku',meets({hasYaku:true,han:1,fu:30,ym:0})&&!meets({hasYaku:false,han:0,fu:30,ym:0}));
api.setBind(13);ok('bind13 yakuman only',meets({hasYaku:true,han:13,fu:30,ym:1})&&!meets({hasYaku:true,han:8,fu:30,ym:0}));
api.setBind(5);

// 13. 無作為テスト: 待ち判定と分解の一致、クラッシュしない、符の値が正しい
let n=0,crash=0;
const rnd=m=>Math.random()*m|0;
function randomWin(){
  const c=Array(34).fill(0);
  for(let tries=0;tries<200;tries++){
    c.fill(0);let good=true;
    for(let m=0;m<4&&good;m++){
      if(Math.random()<.45){const k=rnd(34);c[k]+=3;if(c[k]>4)good=false}
      else{const su=rnd(3),st=su*9+rnd(7);c[st]++;c[st+1]++;c[st+2]++;if(c[st]>4||c[st+1]>4||c[st+2]>4)good=false}
    }
    const p=rnd(34);c[p]+=2;if(c[p]>4)good=false;
    if(good&&isWin34(c.slice()))return c;
  }
}
for(let t=0;t<4000;t++){
  const c14=randomWin();if(!c14)continue;
  let k=0;do{k=rnd(34)}while(!c14[k]);
  const c=c14.slice();c[k]--;
  try{
    const ev=evalTenpai(c.slice(),{own:27,doras:[rnd(34)]});
    if(!ev.waits.includes(k))ok("original tile is a wait",false,c.join());
    ev.waits.forEach(w=>{
      const d=c.slice();d[w]++;
      if(!isWin34(d))ok("wait consistency",false,c.join());
      const r=ev.res[w];
      if(!r.ym&&![20,25,30,40,50,60,70,80,90,100,110].includes(r.fu))ok("fu valid",false,JSON.stringify(r));
      if(!r.ym&&r.hasYaku&&r.han<1)ok("han positive",false,JSON.stringify(r));
      n++;
    });
  }catch(e){crash++;console.log("CRASH",c.join(),e.message)}
}
ok('no crash',crash==0);
console.log('random waits checked:',n);
// 14. 作牌ソルバ: 配牌から作れた手は必ず有効
api.setBind(5);
let solved=0,trials=40;
for(let t=0;t<trials;t++){
  const deck=[];for(let k=0;k<34;k++)for(let i=0;i<4;i++)deck.push({k,id:t*1000+deck.length});
  shuffle(deck);
  const tiles=deck.slice(0,34);
  const b=api.cpuBuild(tiles,{own:27,doras:[5]});
  if(b){solved++;const ev=evalTenpai(C(b.map(x=>x.k)),{own:27,doras:[5]});ok('solver output valid',ev.ok&&b.length==13);}
}
// 15. 赤牌を翻に数えると、作れる配牌が増え、返った13枚は赤牌込みで縛りを満たす
let sN=0,sR=0,bad=0;
for(let t=0;t<150;t++){
  const deck=[];for(let k=0;k<34;k++)for(let i=0;i<4;i++)deck.push({k,id:t*1000+deck.length,red:i==0&&(k==4||k==13||k==22)});
  shuffle(deck);const tiles=deck.slice(0,34);
  const b0=api.cpuBuild(tiles,{own:27,doras:[]}),b1=api.cpuBuild(tiles,{own:27,doras:[],reds:true});
  if(b0)sN++;if(b1)sR++;
  if(b1){const rd=b1.filter(x=>x.red).length;const ev=evalTenpai(C(b1.map(x=>x.k)),{own:27,doras:[],rd});if(!(ev.ok&&b1.length==13))bad++}
}
ok('reds do not reduce solvable deals (search is random)',sR>=sN*0.9&&bad==0,sN+' '+sR+' bad'+bad);
console.log('without reds',sN,'with reds',sR);
console.log('solver solved',solved,'/',trials);
console.log(fail?`NG: ${fail} failed, ${pass} passed`:`OK: ${pass} passed`);
process.exit(fail?1:0);
