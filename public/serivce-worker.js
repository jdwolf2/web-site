/* public/service-worker.js */

// Listen for a message from the app to skip waiting and activate the new SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⚡️ Service worker received SKIP_WAITING')
    self.skipWaiting()
  }
})

// Optional: cleanup old caches if you're using custom caching
self.addEventListener('activate', (event) => {
  console.log('✅ Service worker activated')
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'workbox-precache') {
            console.log(`🗑 Deleting old cache: ${cacheName}`)
            return caches.delete(cacheName)
          }
        })
      )
    )
  )
})
