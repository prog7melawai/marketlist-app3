import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/main.css'
import axios from 'axios'

const app = createApp(App)
axios.defaults.baseURL = 'http://172.30.14.134:9322/procurement/web'
axios.defaults.withCredentials = true;

app.use(store).use(router).mount('#app')
