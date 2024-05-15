import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/main.css";
import axios from "axios";

<<<<<<< HEAD
const app = createApp(App);
// axios.defaults.baseURL = 'https://procurement-api.saritirta-group.com/procurement/web'
// axios.defaults.baseURL = 'http://172.30.14.134:9335/procurement/web'
axios.defaults.baseURL = "http://172.30.14.208:9642/procurement/web";
=======
const app = createApp(App)
axios.defaults.baseURL = 'https://procurement-api.saritirta-group.com/procurement/web'
// axios.defaults.baseURL = 'http://172.30.14.134:9335/procurement/web'
// axios.defaults.baseURL = 'http://172.30.14.206:8810/procurement/web'
>>>>>>> 3ade8451bb426e7cbdd29565286418aabc066b57
axios.defaults.withCredentials = true;

app.use(store).use(router).mount("#app");
