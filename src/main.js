import { createApp } from 'vue'
import App from './App.vue'

//Vue.config.productionTip = false

const app = createApp(App)
app.config.productionTip = false
app.mount('#app')