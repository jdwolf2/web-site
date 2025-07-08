// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { registerLicense } from '@syncfusion/ej2-base'
import './registerServiceWorker'
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXlfcnZURGZfV0V2X0dWYUA='
)

createApp(App).mount('#app')
