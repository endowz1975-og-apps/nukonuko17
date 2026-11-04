// index.html（2D版のロジック）に 3D 表示を差し込んで index3d.html を作る。
// 使い方: node build3d.js
const fs=require('fs');
let s=fs.readFileSync('index.html','utf8');
const three=fs.readFileSync('lib/three.min.js','utf8');
const src=fs.readFileSync('src3d.js','utf8');
const rep=(a,b)=>{if(!s.includes(a))throw new Error('not found: '+a);s=s.replace(a,()=>b)};

rep('<title>ぬこぬこじゅうななほ</title>','<title>ぬこぬこじゅうななほ 3D</title>');
rep('</style>',`
#cv{position:fixed;inset:0;width:100vw;height:100vh;z-index:0;display:block}
#app{position:relative;z-index:1;max-width:none;padding:0;pointer-events:none}
#app>*{pointer-events:auto}
.tiles,.lbl{display:none!important}
#buildBox .lbl.keep{display:block!important}
h1{position:fixed;top:4px;right:12px;margin:0;font-size:13px;text-align:right;pointer-events:none}
h1 small{display:none}
.side{background:rgba(22,17,14,.8);backdrop-filter:blur(3px)}
#cpuBox{position:fixed;top:6px;left:50%;transform:translateX(-50%);width:min(480px,94vw);margin:0;padding:14px 124px 14px 18px;font-size:22px;min-height:150px;box-sizing:border-box}#cpuBox .name{font-size:24px}
#cpuBox #cSay{position:absolute;left:18px;right:124px;bottom:12px;max-width:none;margin:0;font-size:16px;z-index:6;pointer-events:none}#cpuBox #cSay:before{display:none}
#cpuBox #cFace{position:absolute;right:12px;top:8px;width:84px;height:102px;margin:0;border-width:1px}
#cpuBox.catbox{padding-right:196px;min-height:182px}#cpuBox.catbox #cSay{right:196px}#cpuBox #cFace.cat{width:184px;height:184px;right:6px;top:0}
.mid{position:fixed;top:62px;left:6px;width:min(300px,calc(50vw - 255px));min-width:150px;background:rgba(22,17,14,.55);border-radius:8px;pointer-events:none}
.mid *{pointer-events:none}
#buildBox,#playBox{position:fixed;bottom:6px;left:50%;transform:translateX(-50%);width:min(580px,96vw);margin:0}
#ov{z-index:20}
#ov .tiles{display:flex!important}
#info:empty{display:none}
#wallPanel{display:none!important}
#dice{background:none!important;align-items:flex-start!important;justify-content:center!important;pointer-events:none;padding:190px 12px 0}
#dice .box{pointer-events:auto;min-width:220px!important;background:rgba(20,14,10,.88)!important}
#setPanel .only3d{display:block!important}
#setBox{position:fixed;top:6px;left:6px;background:rgba(22,17,14,.8);padding:4px 8px;border-radius:6px;z-index:3;text-align:left}
#zoomBtns{position:fixed;left:8px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:4px;z-index:3}
#zoomBtns button{width:36px;height:36px;padding:0;font-size:18px;background:rgba(22,17,14,.8)}
#buildBox .btns,#playBox .btns{margin-top:4px}
#buildBox,#playBox{padding:6px 8px}
@media(min-width:760px){#buildBox{left:50%;right:auto;bottom:auto;top:38%;transform:translate(-50%,-50%);width:min(400px,60vw);padding:12px 16px;font-size:17px}#buildBox #buildTitle{font-size:20px}#buildBox #timer{font-size:40px}#buildBox .btns button{font-size:19px;padding:10px 20px}#buildBox #info{font-size:16px}#buildBox .btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px}}
@media(max-width:899px){#cpuBox{width:min(520px,calc(100vw - 12px));min-height:112px;padding:8px 86px 8px 12px;font-size:15px}#cpuBox .name{font-size:18px}#cpuBox #cFace{width:64px;height:78px;right:8px;top:6px}#cpuBox #cSay{left:12px;right:86px;bottom:6px;font-size:12px}.mid{top:124px;left:96px;right:6px;width:auto;min-width:0;font-size:12px;padding:4px 6px}#setBox{top:124px;padding:2px 4px}#setBox button{font-size:12px;padding:6px 8px}#cpuBox.catbox{padding-right:122px;min-height:116px}#cpuBox.catbox #cSay{right:122px}#cpuBox #cFace.cat{width:112px;height:112px;right:4px;top:2px}}
</style>`);
rep('<div class="side">\n  <div id="cFace"></div>\n  <div id="cSay"></div>\n  <div id="cEpi"></div>\n  <div class="row"><span class="name" id="cName">','<div class="side" id="cpuBox">\n  <div id="cFace"></div>\n  <div id="cSay"></div>\n  <div id="cEpi"></div>\n  <div class="row"><span class="name" id="cName">');
rep('<div class="lbl">配牌（クリックで選ぶ）</div>','');
rep('<div class="lbl">選んだ牌 <span id="selN">0</span>/13（クリックで戻す）</div>','<div class="lbl keep">牌をクリックで選ぶ／戻す　選んだ牌 <span id="selN">0</span>/13</div>');
rep('<script>\nconst $=',`<script>\n${three}\n</script>\n<script>\nconst $=`);
rep('function render(){','function render(){render2d();try{sync3d()}catch(e){console.error(e)}}\nfunction render2d(){');
rep('\nshowTitle();\n</script>','\n'+src+'\nshowTitle();\n</script>');
fs.writeFileSync('index3d.html',s);
console.log('index3d.html',(s.length/1024|0)+'KB');
