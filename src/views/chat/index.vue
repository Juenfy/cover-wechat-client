<script setup>
import ChatList from "@/components/chat/list.vue";
import { ref, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useChatStore } from "@/stores/chat";
import { sortChatList } from "@/utils/helper";
const appStore = useAppStore();
const chatStore = useChatStore();

const loading = ref(false);
const finished = ref(false);

defineEmits(["onSelect"]);

onMounted(() => {
  appStore.initHeader({ title: "微信", navbar: true, search: true });
});

const loadMore = () => {
  // setTimeout(() => {
  //   if (chatList.value.length >= 20) {
  //     finished.value = true
  //     return
  //   }
  //   loading.value = false
  // }, 1000)
};

watch(
  () => chatStore.list,
  (list) => {
    console.log("list", list);
  }
);

const thumb = ref(["https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"]);
</script>
<template>
  <van-list v-model="loading" :finished="finished" @load="loadMore">
    <chat-list :list="chatStore.list" />
  </van-list>
</template>

<style scope></style>
