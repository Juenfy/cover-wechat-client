<script setup>
import * as messageApi from "@/api/message";
import * as friendApi from "@/api/friend";
import { onMounted, watch, inject, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import CommonSearch from "@/components/common/search.vue";
import MessagePopup from "@/components/message/popup.vue";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import {
  SearchFriend,
  UnreadChat,
  UnreadFriend,
  UnreadApply,
} from "@/enums/app";
import { showDialog } from "vant";
import { startWebSocket, getChatList, messageList } from "@/utils/websocket";
const WebSocketClient = inject("WebSocketClient");
const route = useRoute();
const emitter = inject("emitter");
const appStore = useAppStore();
const userStore = useUserStore();
const noticeAudio = inject("NoticeAudio");
const showMessagePopup = ref(false);
const message = ref({});
const onSearch = (action, keywords, cb) => {
  console.log("action", action);
  switch (action) {
    case SearchFriend:
      friendApi.getSearchList(keywords).then((res) => {
        cb(res);
      });
      break;
  }
};
watch(
  () => userStore.isLogin,
  (val) => {
    if (val) {
      //登录成功 连接websocket
      startWebSocket(WebSocketClient, userStore.info.id);
      messageApi.getUnread().then((res) => {
        if (res.code == 200001) {
          appStore.setUnread(res.data);
        }
      });
    }
  }
);

const onMessage = (data) => {
  console.log("App:onMessage", data);
  switch (data.action) {
    case "send":
      let currentPath =
        "/chat/message/" + data.data.from.id + "/" + data.data.is_group;
      console.log(route.fullPath, currentPath);
      // 当前聊天窗口，推进消息
      if (route.fullPath == currentPath) {
        messageList.value.push(data.data);
      }

      if (route.fullPath == "/chat") {
        getChatList();
      }

      //不在聊天窗口或者消息列表页面就弹出消息气泡
      if (
        route.fullPath != "/chat" &&
        route.fullPath.indexOf("/chat/message") == -1
      ) {
        message.value = data.data;
        showMessagePopup.value = true;
      }
      //消息未读数加1
      appStore.unreadIncrBy(UnreadChat);
      //播放消息通知音
      noticeAudio.play();
      break;
    case "logout":
      showDialog({
        title: "强制下线通知",
        message:
          "您的账号于" +
          data.time +
          "在其他地方登录，您已被强制下线，请重新登录。如果不是本人操作，请重新修改密码。",
      }).then(() => {
        location.href = "/login?logout=1";
      });
      break;
    case "apply":
      appStore.unreadIncrBy(UnreadApply);
      appStore.unreadIncrBy(UnreadFriend);
      break;
  }
};

onMounted(() => {
  console.log(emitter, WebSocketClient);
  //页面刷新 重新连接websocket
  if (userStore.isLogin) {
    startWebSocket(WebSocketClient, userStore.info.id);
  }
  emitter.on("onMessage", onMessage);
});

onUnmounted(() => {
  emitter.off("onMessage", onMessage);
});
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition ?? ''" mode="out-in">
      <keep-alive>
        <div :key="route.path" ref="">
          <component :is="Component" :key="route.path" />
        </div>
      </keep-alive>
    </transition>
  </router-view>
  <common-search
    :show="appStore.showCommonSearch"
    @hide="appStore.setShowCommonSearch(false)"
    :action="appStore.commonSearchAction"
    :placeholder="appStore.commonSearchPlaceholder"
    @search="onSearch"
  />
  <message-popup
    :show="showMessagePopup"
    @hide="showMessagePopup = false"
    :message="message"
  />
</template>
