// vue.config.js
// const { defineConfig } = require('@vue/cli-service')
// const fs = require('fs')

// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//     host: 'localhost',
//     port: 5173,
//     https: {
//       key: fs.readFileSync('./certs/localhost-key.pem'),
//       cert: fs.readFileSync('./certs/localhost.pem'),
//     },
//     allowedHosts: 'all',
//   },
// })

module.exports = {
  pwa: {
    name: 'AccuSalt Mobile',
    themeColor: '#35b86b',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
}
