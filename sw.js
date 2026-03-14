self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
    // هذا السطر يخبر جوجل كروم أن التطبيق جاهز ويعمل بكفاءة
    e.respondWith(
        fetch(e.request).catch(() => new Response('مرحباً، التطبيق يعمل.'))
    );
});