<script setup>
import * as friendApi from "@/api/friend";
import { onMounted, watch, inject, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import CommonSearch from "@/components/common/search.vue";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { SearchFriend } from "@/enums/app";
import { showFailToast } from "vant";
import { startWebSocket, getChatList, messageList } from "@/utils/websocket";
const WebSocketClient = inject("WebSocketClient");
const route = useRoute();
const emitter = inject("emitter");
const appStore = useAppStore();
const userStore = useUserStore();
const noticeAudio = inject("NoticeAudio");
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
    }
  }
);
const onChatMessage = (data) => {
  console.log("App:onChatMessage", data);
  console.log(route.fullPath);
  if (route.fullPath.indexOf("chat/message") == -1) {
    noticeAudio.play();
    appStore.unreadIncr();
  } else {
    messageList.value.push(data);
  }
  if (route.fullPath.indexOf("/chat") != -1) {
    getChatList();
  }
};

onMounted(() => {
  console.log(emitter, WebSocketClient);

  if (route.query.logout) {
    userStore.handleLogout();
    return showFailToast("账户信息已失效，请重新登录");
  }

  //页面刷新 重新连接websocket
  if (userStore.isLogin) {
    startWebSocket(WebSocketClient, userStore.info.id);
  }

  emitter.on("onChatMessage", onChatMessage);
});

onUnmounted(() => {
  emitter.off("onChatMessage", onChatMessage);
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
</template>
