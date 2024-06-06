<script setup>
import { showSuccessToast, showFailToast } from "vant";
import { onMounted } from "vue";

onMounted(() => {
  // const websocket = new WebSocket("ws://127.0.0.1:8282");
  // websocket.onopen = (e) => {
  //   showSuccessToast("连接成功");
  // };
  // websocket.onmessage = (e) => {};
  // websocket.onclose = (e) => {
  //   showFailToast("连接关闭");
  // };
  // websocket.onerror = (e) => {
  //   showFailToast("连接错误");
  // };
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
</template>
