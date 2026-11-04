// faces.js / lines.js の中身を index.html の /*FACES_BEGIN*/ ～ /*FACES_END*/、/*LINES_BEGIN*/ ～ /*LINES_END*/ の間に埋め込む（3Dは build3d.js で index.html から作る）
const fs=require('fs');
let s=fs.readFileSync('index.html','utf8');
for(const [file,tag] of [['faces.js','FACES'],['lines.js','LINES']]){
  const f=fs.readFileSync(file,'utf8').replace(/<\/script/g,'<\\/script');
  const a=s.indexOf('/*'+tag+'_BEGIN*/'),b=s.indexOf('/*'+tag+'_END*/');
  if(a<0||b<0){console.log(tag+' markers missing');process.exit(1)}
  s=s.slice(0,a)+'/*'+tag+'_BEGIN*/\n'+f+'\n'+s.slice(b);
}
fs.writeFileSync('index.html',s);console.log('faces/lines synced');
