import { createRouter, createWebHistory } from "vue-router";
import ChatIndex from "@/views/chat/index.vue";
import FriendIndex from "@/views/friend/index.vue";
import DiscoverIndex from "@/views/discover/index.vue";
import MeIndex from "@/views/me/index.vue";
import Home from "@/views/Home.vue";
import ChatMessage from "@/views/chat/message.vue";
import FriendInfo from "@/views/friend/info.vue";
import FriendMoment from "@/views/friend/moment.vue";
import DiscoverMoment from "@/views/discover/moment.vue";
import QrcodeScan from "@/views/me/qrcode/scan.vue";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import FriendApply from "@/views/friend/apply.vue";
import QrcodeIndex from "@/views/me/qrcode/index.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          path: "chat",
          name: "chat",
          component: ChatIndex,
        },
        {
          path: "friend",
          name: "friend",
          component: FriendIndex,
        },
        {
          path: "discover",
          name: "discover",
          component: DiscoverIndex,
        },
        {
          path: "me",
          name: "me",
          component: MeIndex,
        },
      ],
    },
    {
      path: "/chat/message/:to_user/:is_group",
      name: "chat-message",
      component: ChatMessage,
    },
    {
      path: "/friend/info",
      name: "friend-info",
      component: FriendInfo,
    },
    {
      path: "/friend/:id/moment",
      name: "friend-moment",
      component: FriendMoment,
    },
    {
      path: "/friend/apply",
      name: "friend-apply",
      component: FriendApply,
    },
    {
      path: "/discover/moment",
      name: "discover-moment",
      component: DiscoverMoment,
    },
    {
      path: "/me/qrcode/index",
      name: "me-qrcode-index",
      component: QrcodeIndex,
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
