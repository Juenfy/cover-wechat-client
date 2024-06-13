<script setup>
import * as friendApi from "@/api/friend";
import { onMounted, watch, inject } from "vue";
import CommonSearch from "@/components/common/search.vue";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { SearchFriend } from "@/enums/app";
const WebSocketClient = inject("WebSocketClient");
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
      const data = {
        who: "user",
        action: "login",
        data: userStore.info,
      };
      WebSocketClient.send(data);
    } else {
      //推出登录 关闭websocket
      WebSocketClient.stop();
    }
  }
);
onMounted(() => {
  console.log(emitter, WebSocketClient);
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
