import { createApp } from 'vue'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import '@/styles/style.css'
import App from '@/App.vue'

createApp(App)
  .use(Vue3Toastify, {} as ToastContainerOptions)
  .mount('#app')
