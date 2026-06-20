const CACHE_NAME = "ragab-league-v4"; // تم رفع الرقم لإجبار الأجهزة على مسح الكاش القديم واسترجاع اسم RGL

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./logo-192.png",
  "./logo-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// مسح الكاش القديم فوراً
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = event.request.url;

  // 1. طلبات الـ API الخاصة بقاعدة البيانات
  if (url.includes("script.google.com")) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. تحديث ملفات (HTML و Manifest) دائماً من النت لو متاح (لكي يقرأ الاسم الجديد دائماً)
  if (event.request.mode === 'navigate' || url.includes('manifest.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(res => res || caches.match("./offline.html"));
        })
    );
    return;
  }

  // 3. باقي الملفات (صور، أيقونات) من الكاش للسرعة
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return res;
      }).catch(() => caches.match("./offline.html"));
    })
  );
});