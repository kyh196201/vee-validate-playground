import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import 'bulma/css/bulma.min.css'
import ElementPlus from 'element-plus'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')

