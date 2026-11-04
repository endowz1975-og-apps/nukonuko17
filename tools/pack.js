// 公開用の app フォルダを作る。使い方: node build3d.js && node tools/pack.js
// app/index.html = 3D版、app/2d.html = 2D版。sw.js の VERSION は中身のハッシュから自動で決まる（更新時の手作業なし）
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..'), out = path.join(root, 'app');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const files = [];
const put = (src, dst) => { const d = path.join(out, dst); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(path.join(root, src), d); files.push(dst) };
put('index3d.html', 'index.html');
fs.writeFileSync(path.join(out,'index.html'),fs.readFileSync(path.join(out,'index.html'),'utf8').replace('<title>ぬこぬこじゅうななほ 3D</title>','<title>ぬこぬこじゅうななほ</title>')); // 公開ページのタイトルから「3D」を外す
put('index.html', '2d.html');
put('tools/pwa/manifest.json', 'manifest.json');
put('tools/pwa/icon-192.png', 'icon-192.png');
put('tools/pwa/icon-512.png', 'icon-512.png');
put('tools/pwa/LICENSE.txt', 'LICENSE.txt');
for (const dir of ['cat', 'tiles', 'fonts']) for (const f of fs.readdirSync(path.join(root, dir)).sort()) put(dir + '/' + f, dir + '/' + f);
fs.writeFileSync(path.join(out, '_headers'), ['/', '/index.html', '/2d.html', '/sw.js', '/manifest.json'].map(p => p + '\n  Cache-Control: no-cache').join('\n') + '\n');
const h = crypto.createHash('sha1');
for (const f of files) { h.update(f); h.update(fs.readFileSync(path.join(out, f))) }
const version = 'nukonuko17-' + h.digest('hex').slice(0, 8);
const sw = `// ぬこぬこじゅうななほ：オフラインで使えるようにする。VERSION は tools/pack.js が中身から自動で決める
const VERSION = '${version}';
const FILES = ${JSON.stringify(['./'].concat(files), null, 1).replace(/\n\s*/g, ' ')};

self.addEventListener('install', (e) => {
  // 新しい版は待機させ、画面側で「更新しますか？」を確認してから切り替える
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)));
});
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // 画面はネット優先（つながらなければ保存した物）、それ以外は保存した物優先
  if (req.mode === 'navigate') {
    const key = url.pathname.endsWith('/2d.html') ? '2d.html' : 'index.html';
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(VERSION).then((ca) => ca.put(key, c)); return r; })
      .catch(() => caches.match(key)));
  } else {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
  }
});
`;
fs.writeFileSync(path.join(out, 'sw.js'), sw);
const size = files.reduce((a, f) => a + fs.statSync(path.join(out, f)).size, 0);
console.log('app/ ' + (files.length + 2) + ' files, ' + (size / 1024 / 1024).toFixed(2) + ' MB, ' + version);
