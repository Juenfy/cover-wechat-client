<script setup>
import ChatList from "@/components/chat/list.vue";
import { ref, onMounted, inject } from "vue";
import { useAppStore } from "@/stores/app";
import { chatList, getChatList } from "@/utils/websocket";
const appStore = useAppStore();
const loading = ref(false);
const finished = ref(false);
const emitter = inject("emitter");
defineEmits(["onSelect"]);

const loadMore = () => {
  // setTimeout(() => {
  //   if (chatList.value.length >= 20) {
  //     finished.value = true
  //     return
  //   }
  //   loading.value = false
  // }, 1000)
};

onMounted(() => {
  appStore.initHeader({ title: "微信", navbar: true, search: true });
  getChatList();
});
const thumb = ref(["https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"]);
</script>
<template>
  <van-list v-model="loading" :finished="finished" @load="loadMore">
    <chat-list :list="chatList" />
  </van-list>
</template>

<style scope></style>
