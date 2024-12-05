import { createApp } from "vue";
import { createPinia } from "pinia";
//1.引入piniaPersistedstate持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import Vant from "vant";
import mitt from "mitt";
import { WebSocketClient } from "@/utils/websocket";
import VConsole from "vconsole";

if (import.meta.env.VITE_APP_DEBUG === "true") {
  const vconsole = new VConsole();
}

import "@/assets/animation.css";
import "@/assets/style.less";
import "vant/lib/index.css";
import "@/assets/theme.css";
import { SystemAudio } from "@/enums/app";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

//全局事件总线
const emitter = mitt();
app.provide("emitter", emitter);

//连接websocket
const url = import.meta.env.VITE_APP_WEBSOCKET;
console.log(url);
const ws = new WebSocketClient(url, emitter);
app.provide("WebSocketClient", ws);

//加载系统音效
const SysAudio = {};
Object.keys(SystemAudio).forEach(pk => {
  Object.keys(SystemAudio[pk]).forEach(sk => {
    if (!SysAudio.hasOwnProperty(pk)) {
      SysAudio[pk] = {};
    }
    SysAudio[pk][sk] = new Audio(SystemAudio[pk][sk]);
  })
});
app.provide("SysAudio", SysAudio);

app.use(pinia);
app.use(router);
app.use(Vant);

app.mount("#app");
