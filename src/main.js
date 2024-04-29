//import './assets/main.css'

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Vant from "vant";
import "@/assets/animation.css";
import "@/assets/main.css";
import "vant/lib/index.css";
import "@/assets/theme.css";
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vant);

app.mount("#app");
