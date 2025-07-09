const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'AccuSalt Mobile',
    themeColor: '#2196f3',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '.',
    orientation: 'portrait',
    manifestOptions: {
      short_name: 'AccuSalt',
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
})
