const CACHE = "jati-cek-7";
const NAMA = ["", "index.html", "gaya.css", "aplikasi.js", "contoh.json", "jwks.json"];

self.addEventListener("install", (event) => {
  const aset = NAMA.map((nama) => new URL(nama, self.registration.scope).href);
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(aset)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((kunci) => Promise.all(kunci.filter((nama) => nama !== CACHE).map((nama) => caches.delete(nama)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/cabut.json")) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then((simpanan) => simpanan || fetch(event.request)));
});
