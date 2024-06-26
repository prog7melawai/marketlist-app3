import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/main.css";
import axios from "axios";

import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";

const app = createApp(App);
axios.defaults.baseURL =
    // "https://procurement-api.saritirta-group.com/procurement/web";
    // axios.defaults.baseURL = 'http://172.30.14.134:9335/procurement/web'
    axios.defaults.baseURL = "http://172.30.14.100:9031/procurement/web";
axios.defaults.withCredentials = true;

app.use(ToastPlugin);
app.use(store).use(router).mount("#app");
