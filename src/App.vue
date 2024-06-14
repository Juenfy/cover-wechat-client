<script setup>
import * as friendApi from "@/api/friend";
import { onMounted, watch, inject } from "vue";
import { useRoute } from "vue-router";
import CommonSearch from "@/components/common/search.vue";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { SearchFriend } from "@/enums/app";
import { showFailToast } from "vant";
import { startWebSocket } from "@/utils/helper";
const WebSocketClient = inject("WebSocketClient");
const route = useRoute();
const emitter = inject("emitter");
const appStore = useAppStore();
const userStore = useUserStore();
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
