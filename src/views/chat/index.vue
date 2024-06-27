<script setup>
import ChatList from "@/components/chat/list.vue";
import { ref, onMounted, onUnmounted, inject } from "vue";
import { useAppStore } from "@/stores/app";
import { sortChatList } from "@/utils/helper";
import * as chatApi from "@/api/chat";
const appStore = useAppStore();
const chatList = ref([]);
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

const getChatList = () => {
  chatApi.getList().then((res) => {
    console.log("getChatList", res);
    chatList.value = sortChatList(res.data);
  });
};

const onMessage = (data) => {
  console.log("index:onMessage", data);
  getChatList();
};

onMounted(() => {
  appStore.initHeader({ title: "微信", navbar: true, search: true });
  emitter.on("onChatMessage", onMessage);
  getChatList();
});

onUnmounted(() => {
  emitter.off("onChatMessage", onMessage);
});
const thumb = ref(["https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"]);
</script>
<template>
  <van-list v-model="loading" :finished="finished" @load="loadMore">
    <chat-list :list="chatList" />
  </van-list>
</template>

<style scope></style>
