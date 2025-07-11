/* eslint-disable no-console */

import { register } from 'register-service-worker'

navigator.serviceWorker?.addEventListener('controllerchange', () => {
  window.location.reload() // forces a reload after the new service worker takes over
})

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        '✅ App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered(registration) {
      console.log('✅ Service worker has been registered.')

      // Force activation if a new service worker is waiting
      if (registration.waiting) {
        console.log('🔁 Sending SKIP_WAITING to waiting service worker...')
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }

      registration.onupdatefound = () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.onstatechange = () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('🆕 New content is available; reloading...')
              window.location.reload()
            }
          }
        }
      }
    },
    cached() {
      console.log('📦 Content has been cached for offline use.')
    },
    updatefound() {
      console.log('⬇️ New content is downloading...')
    },
    updated() {
      console.log('📢 New content is available; please refresh.')
    },
    offline() {
      console.log('⚠️ No internet connection. App is running in offline mode.')
    },
    error(error) {
      console.error('❌ Error during service worker registration:', error)
    },
  })
}
