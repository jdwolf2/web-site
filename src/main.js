// main.js
import { createApp } from 'vue'
import App from './App.vue'

import './styles.css'

// import { Amplify } from '@aws-amplify/core'
// import { Auth } from '@aws-amplify/auth'

import { registerLicense } from '@syncfusion/ej2-base'
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXlfcnZURGZfV0V2X0dWYUA='
)

// CONFIGURE
// Amplify.configure({
//   Auth: {
//     region: 'us-east-2',
//     userPoolId: 'us-east-2_G2vpbtsqp',
//     userPoolWebClientId: '2ps5f1adntoj56ml8ll8c7lbrg',
//     identityPoolId: 'us-east-2:0aeefbe3-768a-4601-aaf6-8b74c0db2eaa',
//     oauth: {
//       domain: 'us-east-2g2vpbtsqp.auth.us-east-2.amazoncognito.com',
//       scope: ['openid', 'email', 'profile'],
//       redirectSignIn: 'http://localhost:5173/',
//       redirectSignOut: 'http://localhost:5173/',
//       responseType: 'code',
//     },
//   },
// })
// Amplify.register(Auth) // this is REQUIRED in v6

createApp(App).mount('#app')
