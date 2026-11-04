// ぬこぬこじゅうななほ：オフラインで使えるようにする。VERSION は tools/pack.js が中身から自動で決める
const VERSION = 'nukonuko17-0bb55eaf';
const FILES = [ "./", "index.html", "2d.html", "manifest.json", "icon-192.png", "icon-512.png", "LICENSE.txt", "cat/c01.png", "cat/c02.png", "cat/c03.png", "cat/c04.png", "cat/c05.png", "cat/c06.png", "cat/c07.png", "cat/c08.png", "cat/c09.png", "cat/c10.png", "cat/c11.png", "cat/c12.png", "cat/c13.png", "cat/c14.png", "cat/c15.png", "cat/c16.png", "cat/c17.png", "cat/c18.png", "cat/c19.png", "cat/c20.png", "cat/c21.png", "cat/c22.png", "cat/c23.png", "cat/c24.png", "tiles/cats.png", "tiles/kokushi.png", "tiles/tiles34.png", "fonts/shout.woff2" ];

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
