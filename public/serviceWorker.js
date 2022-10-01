const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

//install SW
self.addEventListener('install', (e) => {
    e.waitUntil (
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache')

            return cache.addAll(urlsToCache)
        })
    )
});

//Listen for requests
self.addEventListener('fetch', (e) => {
    e.respondWith (
        caches.match(e.request)
        .then(() => {
            return fetch(e.request)
            .catch(() => caches.match('offline.html'))
        })
        .catch()
    )
});

//Active the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});