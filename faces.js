// 劇画調の顔（SVG）。部品の組み合わせで24人分を描く。
// このファイルが元。index.html には `node syncfaces.js` で埋め込む。
(function(g){
const K='#111';
const LN=w=>`stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const P=(d,fill,w=3)=>`<path d="${d}" fill="${fill}" ${LN(w)}/>`;
const T=(d,w=2)=>`<path d="${d}" fill="none" ${LN(w)}/>`;
const HEAD={
  sharp:'M52 72 L58 144 L82 178 L100 188 L118 178 L142 144 L148 72 Q146 38 100 36 Q54 38 52 72Z',
  square:'M50 72 L54 150 L78 178 L100 184 L122 178 L146 150 L150 72 Q148 38 100 36 Q52 38 50 72Z',
  round:'M50 90 Q48 40 100 38 Q152 40 150 90 Q154 150 100 182 Q46 150 50 90Z',
  long:'M62 64 L66 140 L88 180 L100 192 L112 180 L134 140 L138 64 Q136 34 100 32 Q64 34 62 64Z',
  chubby:'M38 92 Q38 36 100 34 Q162 36 162 92 Q168 150 140 176 Q100 202 60 176 Q32 150 38 92Z',
  fem:'M58 76 Q58 40 100 38 Q142 40 142 76 L138 130 Q130 164 100 182 Q70 164 62 130Z',
  fem2:'M56 82 Q54 42 100 38 Q146 42 144 82 L138 132 Q128 166 100 178 Q72 166 62 132Z'
};
// ---- 髪 ----  {b:顔の後ろ, f:顔の前}
const HAIR={
  bald:()=>({b:'',f:''}),
  mohawk:c=>({b:'',f:P('M74 54 L70 20 L82 34 L80 -4 L92 26 L96 -12 L104 -12 L108 26 L120 -4 L118 34 L130 20 L126 54 Q100 44 74 54Z',c)+T('M84 48 L82 24 M92 46 L92 14 M100 46 L100 8 M108 46 L108 14 M116 48 L118 24',1.5).replace(K,'#8a6a10')+`<ellipse cx="60" cy="72" rx="5" ry="12" fill="${K}" opacity=".55"/><ellipse cx="140" cy="72" rx="5" ry="12" fill="${K}" opacity=".55"/>`}),
  spiky:c=>({b:'',f:P('M50 80 L40 44 L62 54 L56 16 L78 40 L84 6 L98 34 L112 2 L120 36 L140 12 L138 46 L162 34 L150 80 L138 64 Q100 50 62 64Z',c)}),
  mess:c=>({b:'',f:P('M50 82 L38 56 L60 58 L50 28 L76 46 L86 18 L100 44 L118 8 L124 42 L148 24 L142 56 L164 62 L150 84 L136 66 Q100 54 62 68Z',c)}),
  curly:c=>({b:'',f:[[48,70,17],[56,48,17],[74,34,17],[96,28,17],[118,30,17],[138,40,17],[152,58,16],[154,82,14],[46,92,13],[66,62,14],[90,52,13],[116,54,13],[138,66,13],[72,76,9],[94,72,9],[114,74,9],[132,78,9]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c}" ${LN(2.8)}/>`).join('')+T('M68 40 q6 -9 12 0 q6 -7 10 2 M104 34 q6 -9 12 0 M132 46 q6 -8 12 0 M56 62 q6 -8 12 0 M96 56 q5 -7 10 0',1.6)}),
  allback:c=>({b:P('M50 80 L46 104 L56 100Z M150 80 L154 104 L144 100Z',c,2.4),f:P('M52 84 Q44 34 100 28 Q156 34 148 84 L146 66 Q100 44 54 66Z',c)+T('M64 62 Q96 42 136 60 M70 52 Q100 36 130 50 M58 72 Q96 52 142 72',1.4).replace(K,'#888')}),
  short:c=>({b:'',f:P('M50 86 Q46 34 100 30 Q154 34 150 86 L146 70 Q130 52 100 54 Q70 52 54 70Z',c)+P('M50 86 L52 106 L58 94Z M150 86 L148 106 L142 94Z',c,2.4)}),
  semi:c=>({b:P('M44 130 L44 70 Q54 26 100 24 Q146 26 156 70 L156 130 L148 152 L138 124 L132 80 L68 80 L62 124 L52 152Z',c),f:P('M52 104 L50 66 Q62 30 100 28 Q138 30 150 66 L148 104 L140 122 L136 84 Q116 74 100 54 Q84 74 64 84 L60 122Z',c)+T('M72 44 Q84 32 104 32 M118 36 Q132 42 138 58',1.8).replace(K,'#9fb0e0')}),
  shoulder:c=>({b:P('M42 130 L42 70 Q52 26 100 24 Q148 26 158 70 L158 130 L166 170 L150 200 L138 150 L132 80 L68 80 L62 150 L50 200 L34 170Z',c),f:P('M52 104 L50 66 Q62 30 100 28 Q138 30 150 66 L148 104 L142 130 L136 84 Q116 74 100 54 Q84 74 64 84 L58 130Z',c)+T('M72 44 Q84 32 104 32 M118 36 Q132 42 138 58 M52 140 L46 188 M148 140 L154 188',1.6).replace(K,'#aaa')}),
  helmet:c=>{const h='#e8c860';return {b:'',f:P('M46 96 Q40 28 100 24 Q160 28 154 96 L148 76 Q100 54 52 76Z',c)+P('M46 96 L48 112 L62 108 L60 84Z M154 96 L152 112 L138 108 L140 84Z',c,2.8)+P('M94 26 L100 4 L106 26Z',c,2.6)+T('M60 50 Q76 34 96 32',2).replace(K,'#aaa')+P('M52 78 L58 100 L68 82 L76 104 L86 84 L96 106 L106 84 L116 106 L126 84 L134 104 L142 82 L148 100 L150 78Q100 62 52 78Z',h,2.6)+P('M46 108 L46 128 L58 124 L60 112Z M154 108 L154 128 L142 124 L140 112Z',h,2.6)}},
  slick:c=>({b:P('M50 80 L46 110 L54 108Z M150 80 L154 110 L146 108Z',c,2.4),f:P('M50 80 Q44 32 100 26 Q156 32 150 80 L142 64 Q124 44 98 50 Q76 44 58 66Z',c)+T('M64 56 Q92 38 132 52 M72 66 Q96 52 128 62',1.4).replace(K,'#fff')}),
  sweep:c=>({b:P('M50 80 L44 124 L56 116Z M150 80 L156 124 L144 116Z',c,2.4),f:P('M48 84 Q40 30 100 24 Q164 30 152 84 L146 56 Q120 40 96 56 Q84 76 66 70 Q56 74 52 90Z',c)+T('M70 44 Q100 30 138 50',1.4).replace(K,'#fff')}),
  topknot:c=>({b:'',f:P('M96 38 Q92 22 100 14 Q108 22 104 38Z',c)+P('M56 76 Q64 52 100 48 Q136 52 144 76 L134 66 Q100 56 66 66Z',c,2.6)+P('M52 76 L48 114 L60 120 L58 82Z M148 76 L152 114 L140 120 L142 82Z',c,2.4)}),
  bob:c=>({b:P('M46 124 L46 66 Q56 24 100 22 Q144 24 154 66 L154 124 L140 132 L138 86 Q118 78 100 58 Q82 78 62 86 L60 132Z',c),f:P('M52 100 L50 62 Q60 26 100 24 Q140 26 150 62 L148 100 L138 120 L134 84 Q116 76 100 58 Q84 76 66 84 L62 120Z',c)+T('M72 42 Q84 30 104 30 M118 34 Q132 40 138 56',1.8).replace(K,'#c9d0ea')}),
  bobPlain:c=>({b:P('M48 118 L48 66 Q58 26 100 24 Q142 26 152 66 L152 118 L140 124 L140 86 L60 86 L60 124Z',c),f:P('M54 92 L52 64 Q62 28 100 26 Q138 28 148 64 L146 92 Q126 84 100 62 Q74 84 54 92Z',c)}),
  long:c=>({b:P('M42 124 L40 64 Q56 20 100 18 Q144 20 160 64 L158 124 L168 176 L156 214 L44 214 L32 176Z',c),f:P('M52 100 L50 62 Q64 28 100 28 Q136 28 150 62 L148 100 Q140 80 120 70 Q110 88 92 82 Q76 80 64 88Z',c)+T('M52 130 L48 200 M64 120 L58 204 M148 130 L152 200 M136 120 L142 204',1.4)}),
  longMess:c=>({b:P('M42 124 L40 64 Q56 20 100 18 Q144 20 160 64 L158 124 L170 180 L150 216 L142 170 L136 130 L64 130 L58 170 L50 216 L30 180Z',c),f:P('M48 104 L44 62 Q60 22 100 22 Q140 22 156 62 L152 104 L146 96 L142 80 L134 94 L128 78 L118 92 L112 76 L100 90 L92 76 L84 92 L74 78 L68 94 L58 80 L54 96Z',c)+T('M60 50 Q76 30 96 30 M104 30 Q126 32 142 52 M66 62 L76 84 M96 56 L100 82 M128 60 L122 82',1.6).replace(K,'#999')}),
  raggedShort:c=>({b:'',f:HAIR.longMess(c).f}),
  hime:c=>({b:P('M40 124 L38 64 Q54 20 100 18 Q146 20 162 64 L160 124 L166 216 L34 216Z',c),f:P('M48 100 L48 64 Q62 28 100 26 Q138 28 152 64 L152 100 L144 130 L140 84 L60 84 L56 130Z',c)+T('M70 44 Q100 32 130 44',1.6).replace(K,'#6a6a8a')}),
  wavy:c=>({b:P('M42 120 L40 64 Q56 20 100 18 Q144 20 160 64 L158 120 Q172 140 162 164 Q172 186 158 204 Q146 214 132 206 L68 206 Q54 214 42 204 Q28 186 38 164 Q28 140 42 120Z',c),f:P('M50 100 L48 62 Q62 26 100 26 Q140 26 152 62 L150 100 Q146 82 126 72 Q112 90 90 82 Q70 80 60 98Z',c)}),
  updo:c=>({b:P('M44 120 L42 66 Q50 40 100 40 Q150 40 158 66 L156 120Z',c,2.4),f:P('M58 100 L54 66 Q62 36 100 34 Q138 36 146 66 L142 100 Q134 82 116 74 Q108 88 92 80 Q72 78 58 100Z',c)+`<ellipse cx="100" cy="22" rx="30" ry="22" fill="${c}" ${LN(3)}/>`+T('M80 20 Q100 6 120 20',1.4).replace(K,'#fff')}),
  twin:c=>({b:P('M36 104 Q24 140 34 184 L56 184 Q58 150 54 106Z M164 104 Q176 140 166 184 L144 184 Q142 150 146 106Z',c),f:P('M52 100 L50 62 Q64 28 100 28 Q136 28 150 62 L148 100 Q140 80 120 70 Q110 88 92 82 Q76 80 64 88Z',c)}),
  bowl:c=>({b:'',f:P('M46 98 Q40 34 100 28 Q160 34 154 98 L146 82 Q100 56 54 82Z',c)}),
  cap:c=>({b:'',f:P('M46 80 Q46 28 100 26 Q154 28 154 80 Q100 68 46 80Z',c)+P('M52 76 L148 76 L158 90 L44 90Z',c,2.6)+`<circle cx="100" cy="46" r="3" fill="#ddd"/>`+T('M60 90 Q74 112 70 134',2)}),
  crownHair:c=>({b:'',f:P('M46 98 Q40 40 100 36 Q160 40 154 98 L146 84 Q100 62 54 84Z',c)})
};
// ---- 体 ----
const SH='M26 240 L38 208 L72 194 L128 194 L162 208 L174 240Z';
const BODY={
  suit:(c,s)=>P(SH,c)+P('M84 196 L100 226 L116 196 L108 192 L100 208 L92 192Z',s||'#f2f2f2',2.4),
  jacket:c=>P(SH,c)+P('M58 206 L90 203 L100 232 L66 236Z M142 206 L110 203 L100 232 L134 236Z','#3a332e',2.6)+`<path d="M30 214 L14 184 L52 200Z M170 214 L186 184 L148 200Z" fill="#cfcfcf" ${LN(3)}/>`,
  kimono:c=>P(SH,c)+P('M84 196 L112 240 L100 240 L76 202Z','#eee',2.4)+T('M116 198 L96 240',2.4),
  dress:(c,sk)=>P(SH,c)+P('M82 196 L100 224 L118 196Z',sk,2.4),
  bare:(c,sk)=>P('M26 240 L36 204 L72 194 L128 194 L164 204 L174 240Z',sk)+T('M100 196 L100 240 M70 214 Q86 232 100 222 M130 214 Q114 232 100 222',2.4)+[[80,206],[90,212],[110,212],[120,206],[84,224],[100,230],[116,224]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.2" fill="${K}"/>`).join(''),
  cape:c=>`<path d="M14 240 L24 196 L176 196 L186 240Z" fill="${c}" ${LN(3)}/>`+P('M30 210 Q100 244 170 210 L172 232 Q100 256 28 232Z','#f4f0e8',2.6)+`<g fill="${K}"><circle cx="60" cy="226" r="2"/><circle cx="90" cy="236" r="2"/><circle cx="120" cy="236" r="2"/><circle cx="148" cy="226" r="2"/></g>`,
  robe:(c,t)=>P(SH,c)+T('M82 196 L100 232 L118 196',4).replace(K,t)+T('M36 214 Q100 228 164 214',3).replace(K,t),
  coat:c=>P(SH,c)+P('M70 188 L88 200 L84 234 L52 226Z M130 188 L112 200 L116 234 L148 226Z',c,3),
  gi:(c,s)=>P(SH,c)+T('M84 196 L100 216 L116 196',3)+P('M60 226 L140 226 L140 240 L60 240Z',s,2.4)
};
// ---- 目（左目の形。右は鏡）----
const IRIS=(c,r)=>`<circle cx="80" cy="110" r="${r}" fill="${c}" ${LN(2)}/><circle cx="80" cy="110" r="${r*.45}" fill="${K}"/><circle cx="77.5" cy="107.5" r="${r*.3}" fill="#fff"/>`;
const EYE={
  slit:()=>P('M64 110 Q78 101 94 112 Q78 118 64 110Z','#fff',2.8)+`<circle cx="80" cy="110" r="3.2" fill="${K}"/>`+T('M64 110 Q78 101 94 112',4.2)+T('M66 121 Q80 128 92 121',1.5),
  slitY:()=>P('M64 110 Q78 101 94 112 Q78 118 64 110Z','#fff',2.8)+`<circle cx="80" cy="110" r="3.2" fill="${K}"/>`+T('M64 110 Q78 101 94 112',3.8),
  bug:()=>P('M62 112 Q78 98 94 112 Q78 126 62 112Z','#fff',3)+`<circle cx="79" cy="112" r="3.4" fill="${K}"/>`+T('M64 124 Q78 134 92 124',1.6),
  dot:()=>`<ellipse cx="79" cy="110" rx="11" ry="9" fill="#fff" ${LN(3)}/><circle cx="80" cy="111" r="3.4" fill="${K}"/>`,
  stern:()=>P('M64 112 Q78 100 94 110 Q78 120 64 112Z','#fff',2.8)+`<circle cx="81" cy="111" r="3.4" fill="${K}"/>`+T('M64 112 Q78 100 94 110',4.4)+T('M66 122 Q78 128 90 122',1.5),
  lazy:()=>P('M64 112 Q78 109 94 112 Q78 121 64 112Z','#fff',2.6)+`<circle cx="80" cy="114" r="3.2" fill="${K}"/>`+T('M62 111 L96 111',4.6),
  closed:()=>T('M64 112 Q79 106 95 112',4.2)+T('M70 120 Q80 124 90 120',1.4),
  closedY:()=>T('M64 112 Q79 106 95 112',4),
  crazy:()=>P('M62 110 Q78 94 94 110 Q78 126 62 110Z','#fff',3)+`<circle cx="76" cy="108" r="2.6" fill="${K}"/>`,
  // 女性
  fBig:i=>P('M62 112 Q78 94 94 112 Q78 130 62 112Z','#fff',3)+IRIS(i,9)+T('M62 112 Q78 94 94 112',4.4)+T('M62 112 L56 106',3),
  fCalm:i=>P('M64 110 Q79 101 95 110 Q79 118 64 110Z','#fff',2.4)+IRIS(i,5.6).replace(/stroke-width="2"/,'stroke-width="1.4"')+T('M64 110 Q79 101 95 110',4)+T('M64 110 L57 105',3)+T('M67 115 Q79 120 92 115',1),
  fLazy:i=>P('M64 112 Q79 106 95 112 Q79 120 64 112Z','#fff',2.4)+IRIS(i,5.2).replace('cy="110"','cy="113"').replace('cy="110"','cy="113"').replace('cy="107.5"','cy="110.5"')+T('M62 111 Q79 105 96 111',4.6)+T('M62 111 L55 106',3)
};
const BROWS={angry:'M58 90 L94 102',flat:'M60 97 L95 96',arch:'M62 98 Q78 86 95 95',worry:'M60 101 L95 91',rise:'M62 94 Q78 80 95 90'};
const NOSE={
  long:T('M100 104 L93 142 L107 147',3)+T('M88 143 Q97 153 110 146',2.4),
  hook:T('M100 104 L94 140 Q104 152 112 142',3),
  short:T('M99 116 L96 136 L104 138',2.4),
  fine:T('M100 108 L96 136 L104 139',2.2)
};
const MOUTH={
  flat:()=>T('M82 158 L118 158',3.6)+T('M92 164 L108 164',1.4),
  frown:()=>T('M84 164 Q100 154 116 164',3.4),
  smirk:()=>T('M84 158 Q100 162 118 150',3.4)+T('M118 150 L121 146',2),
  smile:()=>T('M82 154 Q100 172 118 154',3.4),
  grin:()=>`<path d="M66 154 Q100 162 134 154 L126 176 Q100 188 74 176Z" fill="${K}"/><path d="M70 156 L76 168 L82 158 L88 170 L94 160 L100 172 L106 160 L112 170 L118 158 L124 168 L130 156Z" fill="#fff"/>`,
  shout:()=>`<path d="M72 152 Q100 158 128 152 L122 178 Q100 186 78 178Z" fill="${K}"/><path d="M76 154 Q100 159 124 154 L123 160 Q100 164 77 160Z" fill="#fff"/>`,
  cat:()=>T('M86 156 Q93 164 100 156 Q107 164 114 156',3),
  tiny:()=>T('M92 160 Q98 156 108 162',3),
  catWin:()=>`<path d="M84 153 Q92 161 100 153 Q108 161 116 153 L112 172 Q100 182 88 172Z" fill="#6a1220" ${LN(3)}/><path d="M87 156 L90 166 L94 158Z M113 156 L110 166 L106 158Z" fill="#fff"/><ellipse cx="100" cy="173" rx="7" ry="3.5" fill="#e8707a"/>`,
  catLose:()=>T('M86 166 Q93 157 100 166 Q107 157 114 166',3.2),
  pout:l=>`<path d="M86 156 Q93 150 100 153 Q107 150 114 156 Q100 160 86 156Z" fill="${l}" ${LN(1.8)}/><path d="M88 158 Q100 169 112 158 Q100 161 88 158Z" fill="${l}" ${LN(1.8)}/>`,
  smileF:l=>`<path d="M84 152 Q100 174 116 152 Q100 158 84 152Z" fill="${l}" ${LN(1.8)}/><path d="M89 157 Q100 168 111 157" fill="none" stroke="#fff" stroke-width="2.4"/>`,
  frownF:l=>`<path d="M86 163 Q100 151 114 163 Q100 157 86 163Z" fill="${l}" ${LN(1.8)}/>`,
  openF:()=>`<path d="M82 150 Q100 156 118 150 Q112 176 100 176 Q88 176 82 150Z" fill="#6a1220" ${LN(3)}/><path d="M86 152 Q100 156 114 152 L112 158 Q100 162 88 158Z" fill="#fff"/><ellipse cx="100" cy="168" rx="7" ry="4" fill="#e8707a"/>`
};
// ---- 小物 ----
const ACC={
  scar:()=>`<path d="M120 80 L136 128" stroke="${K}" stroke-width="3.4"/><path d="M125 92 L134 88 M128 104 L137 100 M131 116 L139 112" stroke="${K}" stroke-width="2.4"/>`,
  beard:c=>P('M54 120 Q54 168 100 188 Q146 168 146 120 Q136 150 100 150 Q64 150 54 120Z',c,2.6),
  goatee:c=>P('M88 164 Q100 196 112 164 Q100 170 88 164Z',c,2.4),
  stache:c=>P('M78 150 Q90 142 100 148 Q110 142 122 150 Q110 156 100 154 Q90 156 78 150Z',c,2.4),
  glasses:()=>`<g fill="none" ${LN(2.6)}><rect x="60" y="98" width="38" height="26" rx="6"/><rect x="102" y="98" width="38" height="26" rx="6"/><path d="M98 108 L102 108"/></g>`,
  monocle:()=>`<circle cx="121" cy="110" r="14" fill="#fff" fill-opacity=".25" ${LN(2.6)}/><path d="M133 120 L146 150" fill="none" ${LN(1.6)}/>`,
  mask:c=>`<path d="M54 100 Q100 90 146 100 L146 122 Q122 114 100 122 Q78 114 54 122Z" fill="${c}" ${LN(3)}/><path d="M64 110 L90 112 M110 112 L136 110" ${LN(4)} fill="none"/><path d="M68 110 L88 112 M112 112 L132 110" stroke="#fff" stroke-width="1.6" fill="none"/>`,
  domino:()=>`<path d="M56 100 Q100 92 144 100 L142 122 Q120 118 100 124 Q80 118 58 122Z" fill="${K}"/><path d="M66 110 L90 110 M110 110 L134 110" stroke="#fff" stroke-width="2.4" fill="none"/>`,
  tears:()=>`<path d="M70 124 Q66 136 70 146 Q74 138 70 124Z M130 124 Q126 136 130 146 Q134 138 130 124Z M62 128 Q58 140 62 150 Q66 140 62 128Z M138 128 Q134 140 138 150 Q142 140 138 128Z" fill="#9fd8ff" ${LN(1.6)}/>`,
  third:()=>`<ellipse cx="100" cy="76" rx="9" ry="6" fill="#fff" ${LN(2.4)}/><circle cx="100" cy="76" r="2.6" fill="${K}"/>`,
  cheeks:()=>`<ellipse cx="66" cy="140" rx="13" ry="9" fill="#e87a7a" opacity=".55"/><ellipse cx="134" cy="140" rx="13" ry="9" fill="#e87a7a" opacity=".55"/>`,
  gloom:()=>T('M66 52 L66 76 M78 46 L78 72 M90 42 L90 68 M110 42 L110 68 M122 46 L122 72 M134 52 L134 76',1.6),
  shine:()=>`<path d="M160 36 L163 48 L175 52 L163 56 L160 68 L157 56 L145 52 L157 48Z" fill="#fff" ${LN(1.6)}/>`,
  mole:()=>`<circle cx="124" cy="152" r="2.2" fill="${K}"/>`,
  sweat:()=>`<path d="M146 70 Q140 84 146 90 Q152 84 146 70Z M158 100 Q153 110 158 116 Q163 110 158 100Z" fill="#cfeaff" ${LN(1.8)}/>`,
  zawa:()=>`<g fill="${K}" font-family="Yu Gothic,sans-serif" font-weight="bold" font-size="17"><text x="150" y="40">ゴロ</text><text x="158" y="58">…</text></g>`,
  crown:()=>P('M64 52 L70 22 L86 40 L100 16 L114 40 L130 22 L136 52Z','#f0c840',2.8)+`<circle cx="70" cy="22" r="3.2" fill="#e04040"/><circle cx="100" cy="16" r="3.2" fill="#e04040"/><circle cx="130" cy="22" r="3.2" fill="#e04040"/>`,
  headband:()=>P('M52 74 Q100 58 148 74 L148 84 Q100 70 52 84Z','#2a6a5a',2.4)+`<path d="M100 70 L94 80 L100 90 L106 80Z" fill="#f0c840" ${LN(1.6)}/>`,
  ribbon:()=>`<g fill="#e8507a" ${LN(2.6)}><path d="M140 46 L164 32 L162 64Z"/><path d="M140 46 L116 32 L118 64Z"/><circle cx="140" cy="47" r="6"/></g>`,
  band:c=>P('M50 78 Q100 62 150 78 L150 90 Q100 74 50 90Z',c||'#f2f2f2',2.4)+P('M148 82 L170 92 L160 98 L172 108 L150 92Z',c||'#f2f2f2',2),
  veil:c=>P('M84 168 L80 208 L120 208 L116 168Z',c,3)+T('M88 186 Q100 192 112 186 M88 198 Q100 204 112 198',1.4).replace(K,'#2a0a3a')+P('M58 122 Q100 112 142 122 L140 152 Q132 174 100 184 Q68 174 60 152Z',c,3)+T('M82 128 Q100 138 118 128 M70 150 Q100 166 130 150',1.4).replace(K,'#2a0a3a')+T('M100 122 L100 140',1.4).replace(K,'#2a0a3a'),
  hairband:()=>P('M54 72 Q100 54 146 72 L146 80 Q100 64 54 80Z','#e8f0ff',2.2),
  earring:()=>`<circle cx="52" cy="124" r="3" fill="#f0c840" ${LN(1.4)}/><circle cx="148" cy="124" r="3" fill="#f0c840" ${LN(1.4)}/>`,
  ports:()=>`<rect x="82" y="182" width="5" height="12" fill="#9aa4b6" stroke="${K}" stroke-width="2"/><rect x="113" y="182" width="5" height="12" fill="#9aa4b6" stroke="${K}" stroke-width="2"/>`,
  chain:()=>`<path d="M62 92 Q58 120 66 140" fill="none" stroke="#bbb" stroke-width="3" stroke-dasharray="4 3"/>`
};
const BEHIND={
  wings:()=>`<path d="M54 150 L8 120 L14 56 L42 30 L60 70 L66 120Z M146 150 L192 120 L186 56 L158 30 L140 70 L134 120Z" fill="#dcefff" ${LN(3)} opacity=".9"/><path d="M54 140 L22 100 M56 128 L30 70 M146 140 L178 100 M144 128 L170 70" fill="none" ${LN(1.2)}/>`,
  halo:()=>`<circle cx="100" cy="90" r="88" fill="#f6e090" ${LN(3)} opacity=".95"/><circle cx="100" cy="90" r="76" fill="#fff4c0" opacity=".7"/>`+Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return `<path d="M${100+Math.cos(a)*88} ${90+Math.sin(a)*88} L${100+Math.cos(a)*106} ${90+Math.sin(a)*106}" ${LN(3)}/>`}).join('')
};
// ---- 猫 ----（d.cat を付けると、耳・猫の鼻・ひげ・縦長の瞳になる。d.skin は毛の色）
const catEars=(fur,inner)=>P('M52 86 L42 12 L98 46Z',fur,3.5)+P('M148 86 L158 12 L102 46Z',fur,3.5)+`<path d="M58 72 L51 30 L86 49Z M142 72 L149 30 L114 49Z" fill="${inner}"/>`+T('M60 62 L55 40 M140 62 L145 40',1.2);
const catNose=()=>`<ellipse cx="100" cy="147" rx="30" ry="20" fill="#fff" opacity=".4"/><path d="M91 121 L109 121 L100 134Z" fill="#b84a52" ${LN(2.2)}/>`+T('M100 134 L100 156',2.2);
const catWhisk=()=>T('M64 140 L14 124 M64 148 L10 148 M66 157 L16 174 M136 140 L186 124 M136 148 L190 148 M134 157 L184 174',1.7);
const FUR={
  tabby:()=>T('M100 40 L100 64 M85 42 L88 60 M115 42 L112 60 M54 112 L72 118 M52 124 L70 128 M146 112 L128 118 M148 124 L130 128',2.4).replace(/stroke="#111"/g,'stroke="#3a2a1a"').replace(/stroke-width="2.4"/g,'stroke-width="3"'),
  patch:()=>'<ellipse cx="122" cy="110" rx="23" ry="21" fill="#2a2420" opacity=".62"/>',
  none:()=>''
};
function faceSVG(d){
  const f=d.sex=='f',skin=d.skin||(f?'#f6e2d0':'#e8caa0'),hairC=d.hair?d.hair[1]:'#222';
  const H=(HAIR[d.hair?d.hair[0]:'bald'])(hairC);
  let eye=d.eye[0]=='f'?EYE[d.eye[0]](d.eye[1]):EYE[d.eye[0]]();
  if(d.cat)eye=eye.replace(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="#111"\/>/g,(m,x,y,r)=>`<ellipse cx="${x}" cy="${y}" rx="${(r*.42).toFixed(1)}" ry="${(r*1.5).toFixed(1)}" fill="#111"/>`);
  const bw=d.brow[1],lipC=d.lip||'#c0504e';
  const eyeG=`<g>${eye}</g><g>${d.brow[0]=='none'?'':T(BROWS[d.brow[0]],bw)}</g>`;
  const hatch=d.hatch=='cheek'?T('M58 124 L68 134 M56 134 L66 144 M60 144 L68 152 M142 124 L132 134 M144 134 L134 144 M140 144 L132 152',1.8)+T('M64 124 Q78 134 92 124 M108 124 Q122 134 136 124',1.5)
    :d.hatch=='age'?T('M86 126 Q82 140 86 152 M114 126 Q118 140 114 152',1.3):d.hatch=='soft'?T('M62 136 L70 146 M138 136 L130 146',1.6):'';
  const FRONTA=['crown','ribbon','headband','hairband','band','gloom','shine'],mkAcc=front=>(d.acc||[]).map(a=>{const n=typeof a=='string'?a:a[0];return ACC[n]&&(FRONTA.includes(n)==front)?ACC[n](typeof a=='string'?undefined:a[1]):''}).join(''),accs=mkAcc(false);
  const sk=d.cloth;
  const body=BODY[sk[0]](sk[1],sk[2]||skin);
  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">`+
   (d.behind?BEHIND[d.behind]():'')+H.b+
   P('M86 166 L86 200 L114 200 L114 166Z',skin,3)+(d.sex=='m'?T('M90 176 L110 184 M90 184 L110 192',1.8):'')+
   body+(d.neckAcc?ACC[d.neckAcc]():'')+
   (d.cat?catEars(skin,d.inner||'#e8a0a0'):`<path d="M48 98 L40 108 L44 126 L54 124Z M152 98 L160 108 L156 126 L146 124Z" fill="${skin}" ${LN(3)}/>`)+
   `<path d="${HEAD[d.head]}" fill="${skin}" ${LN(3.5)}/>`+
   hatch+(d.cat?(FUR[d.fur||'none'])():'')+
   `<g>${eyeG}</g><g transform="translate(200 0) scale(-1 1)">${eyeG}</g>`+
   (d.cat?catNose():NOSE[d.nose])+
   (d.mouth=='pout'?MOUTH.pout(lipC):(d.mouth=='smileF'||d.mouth=='frownF')?MOUTH[d.mouth](lipC):MOUTH[d.mouth]())+
   (d.cat?catWhisk():'')+accs+H.f+mkAcc(true)+
   `</svg>`;
}
// ---- 24人 ----
const D={
 baka1:{sex:'m',head:'sharp',eye:['bug'],brow:['angry',7],nose:'long',mouth:'grin',hatch:'cheek',hair:['mohawk','#f0c830'],acc:['scar'],cloth:['jacket','#222']},
 baka2:{sex:'f',head:'fem2',eye:['fBig','#4a98d0'],brow:['arch',3],nose:'short',mouth:'openF',hatch:'soft',hair:['long','#8ad0f0'],acc:['ribbon'],behind:'wings',cloth:['dress','#74b894']},
 weak1:{sex:'m',head:'sharp',eye:['lazy'],brow:['rise',5],nose:'hook',mouth:'smirk',hatch:'cheek',hair:['shoulder','#eeeeee'],acc:[['band','#c02a2a']],cloth:['suit','#5a3a6a','#fff']},
 weak2:{sex:'f',head:'fem',eye:['crazy'],brow:['rise',3],nose:'short',mouth:'tiny',hatch:'soft',hair:['mess','#5a3a2a'],cloth:['dress','#8a8aa0']},
 weak3:{sex:'m',head:'long',eye:['slit'],brow:['worry',5],nose:'long',mouth:'frown',hatch:'cheek',hair:['allback','#cfcfcf'],acc:[['stache','#cfcfcf']],cloth:['kimono','#2c5a6a']},
 weak4:{sex:'f',head:'fem2',eye:['fBig','#6a4a2a'],brow:['angry',4],nose:'short',mouth:'shout',hatch:'soft',hair:['twin','#2a1a1a'],acc:['tears'],cloth:['dress','#c04a4a']},
 weak5:{sex:'f',head:'fem2',eye:['fLazy','#d88a2a'],brow:['flat',3],nose:'fine',mouth:'tiny',hair:['bob','#e8872a'],cloth:['dress','#e8d8b8']},
 normal1:{sex:'m',head:'sharp',eye:['stern'],brow:['angry',5],nose:'long',mouth:'flat',hatch:'cheek',hair:['curly','#6a4020'],cloth:['suit','#d8d8e0','#c02a2a']},
 normal2:{sex:'f',head:'fem',eye:['fCalm','#2a5a8a'],brow:['arch',3],nose:'fine',mouth:'pout',lip:'#c07070',hair:['bobPlain','#2a3a8a'],cloth:['dress','#8ab8d8']},
 normal3:{sex:'m',head:'square',eye:['stern'],brow:['angry',7],nose:'long',mouth:'frown',hatch:'cheek',hair:['cap','#1a1a2a'],acc:['chain'],cloth:['coat','#1a1a2a']},
 normal4:{sex:'f',head:'fem',eye:['fCalm','#2a1a1a'],brow:['angry',3.6],nose:'fine',mouth:'pout',lip:'#c0202a',hair:['long','#f0d060'],acc:['domino','earring'],cloth:['dress','#6a2a8a']},
 normal5:{sex:'m',head:'round',eye:['dot'],brow:['flat',4],nose:'short',mouth:'flat',hair:['short','#2a2220'],cloth:['gi','#3a8a6a','#c8a030']},
 normal6:{sex:'f',head:'fem',eye:['fCalm','#c02a3a'],brow:['flat',2.6],nose:'fine',mouth:'flat',hair:['bobPlain','#8ab0d8'],cloth:['suit','#e8e8f0','#f2f2f2']},
 normal7:{sex:'f',head:'fem',eye:['fCalm','#6a2a8a'],brow:['arch',3],nose:'fine',mouth:'pout',lip:'#7a1a4a',hatch:'age',hair:['updo','#7a4a2a'],acc:['earring',['veil','#7a3a9a']],cloth:['coat','#4a2a6a']},
 normal8:{sex:'m',head:'sharp',eye:['slit'],brow:['flat',4],nose:'short',mouth:'smirk',hair:['slick','#e8c040'],cloth:['suit','#c02a2a','#fff']},
 strong1:{sex:'m',head:'sharp',eye:['slitY'],brow:['flat',3.6],nose:'fine',mouth:'flat',skin:'#f0d6b8',hair:['long','#111'],cloth:['kimono','#2a3a5a']},
 strong2:{sex:'f',head:'fem',eye:['fCalm','#4a8ac0'],brow:['arch',2.6],nose:'fine',mouth:'pout',lip:'#c05a5a',hair:['long','#f0d070'],acc:['hairband'],cloth:['dress','#f0f0f8']},
 strong3:{sex:'m',head:'square',eye:['stern'],brow:['angry',8],nose:'long',mouth:'frown',hatch:'cheek',hair:['spiky','#111'],cloth:['bare','#222','#e8caa0']},
 strong4:{sex:'m',head:'sharp',eye:['stern'],brow:['angry',7],nose:'long',mouth:'frown',hatch:'cheek',hair:['sweep','#f0d060'],acc:['headband'],cloth:['coat','#2a6a5a']},
 strong5:{sex:'f',head:'fem',eye:['fLazy','#2a1a1a'],brow:['arch',3],nose:'fine',mouth:'pout',lip:'#c0202a',hair:['wavy','#4a2a1a'],acc:['mole'],cloth:['dress','#c02a4a']},
 max1:{sex:'f',head:'fem2',eye:['fCalm','#d8a02a'],brow:['arch',2.6],nose:'fine',mouth:'pout',lip:'#d0504a',hair:['hime','#111'],behind:'halo',cloth:['robe','#f0e8d0','#d8a020']},
 max2:{sex:'f',head:'fem',eye:['fCalm','#d84a58'],brow:['flat',2.6],nose:'fine',mouth:'pout',lip:'#a6564f',hair:['semi','#2a3f7a'],neckAcc:'ports',cloth:['suit','#232c3c','#f4f4f4']},
 max3:{sex:'m',head:'long',eye:['slitY'],brow:['flat',3.4],nose:'fine',mouth:'smirk',skin:'#f2dcc0',hair:['raggedShort','#f2f2f2'],acc:['zawa'],cloth:['suit','#1a1a1a','#eee']},
 max4:{sex:'m',head:'chubby',eye:['dot'],brow:['flat',2.6],nose:'short',mouth:'cat',hair:['bowl','#e8c860'],acc:['cheeks','crown'],cloth:['cape','#c8962a']}
};
// 表情: normal / win(勝ち) / lose(負け) / zawa(ざわ…)
function withExpr(d,e){
  if(!e||e=='normal')return d;const o=Object.assign({},d),f=d.sex=='f',acc=(d.acc||[]).slice(),has=n=>acc.some(a=>(typeof a=='string'?a:a[0])==n),add=n=>{if(!has(n))acc.push(n)};
  const w=d.brow[1],keep=['grin','openF','cat','smile','shout'];
  if(e=='win'){if(!keep.includes(d.mouth)||(d.cat&&d.mouth=='cat'))o.mouth=d.cat?'catWin':f?'smileF':'smirk';if(d.brow[0]!='angry'&&d.brow[0]!='none')o.brow=['rise',w];add('shine')}
  else if(e=='lose'){o.mouth=d.cat?'catLose':f?'frownF':'frown';if(d.brow[0]!='none')o.brow=['worry',w];add('sweat');add('gloom')}
  else if(e=='zawa'){o.mouth='tiny';if(d.brow[0]!='none')o.brow=['worry',w];add('sweat')}
  o.acc=acc;return o}
g.faceSVGd=(d,e)=>faceSVG(withExpr(d,e));
g.FACES=D;g.faceSVG=(id,e)=>D[id]?faceSVG(withExpr(D[id],e)):'';
})(typeof window!='undefined'?window:globalThis);
