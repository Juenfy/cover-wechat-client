import { createApp } from "vue";
import { createPinia } from "pinia";
//1.引入piniaPersistedstate持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";
import Vant from "vant";

import VConsole from "vconsole";
const vconsole = new VConsole();

import "@/assets/animation.css";
import "@/assets/main.less";
import "vant/lib/index.css";
import "@/assets/theme.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Vant);

app.mount("#app");
