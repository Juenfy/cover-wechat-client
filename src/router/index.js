import { createRouter, createWebHistory } from "vue-router";
import chatIndex from "@/views/chat/index.vue";
import friendIndex from "@/views/friend/index.vue";
import discoverIndex from "@/views/discover/index.vue";
import meIndex from "@/views/me/index.vue";
import home from "@/views/Home.vue";
import chatDetail from "@/views/chat/detail.vue";
import chatSetting from "@/views/chat/setting.vue";
import friendInfo from "@/views/friend/info.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: home,
      children: [
        {
          path: "chat",
          name: "chat",
          component: chatIndex,
        },
        {
          path: "friend",
          name: "friend",
          component: friendIndex,
        },
        {
          path: "discover",
          name: "discover",
          component: discoverIndex,
        },
        {
          path: "me",
          name: "me",
          component: meIndex,
        },
      ],
    },
    {
      path: "/chat/detail",
      name: "chat-detail",
      component: chatDetail,
    },
    {
      path: "/chat/setting",
      name: "chat-setting",
      component: chatSetting,
    },
    {
      path: "/friend/info",
      name: "friend-info",
      component: friendInfo,
    },
  ],
});

export default router;
