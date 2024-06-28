import { createRouter, createWebHistory } from "vue-router";
import chatIndex from "@/views/chat/index.vue";
import friendIndex from "@/views/friend/index.vue";
import discoverIndex from "@/views/discover/index.vue";
import meIndex from "@/views/me/index.vue";
import home from "@/views/Home.vue";
import chatMessage from "@/views/chat/message.vue";
import chatSetting from "@/views/chat/setting.vue";
import friendInfo from "@/views/friend/info.vue";
import friendSetting from "@/views/friend/setting.vue";
import friendPerm from "@/views/friend/perm.vue";
import discoverMoment from "@/views/discover/moment.vue";
import QrcodeScan from "@/views/me/qrcode/scan.vue";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import FriendApply from "@/views/friend/apply.vue";
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
      path: "/chat/message/:to_user/:is_group",
      name: "chat-message",
      component: chatMessage,
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
    {
      path: "/friend/apply",
      name: "friend-apply",
      component: FriendApply,
    },
    {
      path: "/friend/setting",
      name: "friend-setting",
      component: friendSetting,
    },
    {
      path: "/friend/perm",
      name: "friend-perm",
      component: friendPerm,
    },
    {
      path: "/discover/moment",
      name: "discover-moment",
      component: discoverMoment,
    },
    {
      path: "/me/qrcode/scan",
      name: "me-qrcode-scan",
      component: QrcodeScan,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
});

export default router;
