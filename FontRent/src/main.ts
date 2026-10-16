// @ts-ignore Vue's package is missing its declaration file in this installation.
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './Home.vue'
import router from './router/index.ts'
import './assets/main.css' 



const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
