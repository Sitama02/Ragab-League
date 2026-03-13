self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
    // بيسمح للتطبيق يشتغل ويسحب الداتا من النت عادي جداً
    e.respondWith(fetch(e.request));
});