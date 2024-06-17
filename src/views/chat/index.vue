<script setup>
import ChatList from "@/components/chat/list.vue";
import { ref, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
// import { useChatStore } from "@/stores/chat";
import { sortChatList } from "@/utils/helper";
import * as chatApi from "@/api/chat";
const appStore = useAppStore();
// const chatStore = useChatStore();
const chatList = ref([]);
const loading = ref(false);
const finished = ref(false);

defineEmits(["onSelect"]);

onMounted(async () => {
  appStore.initHeader({ title: "微信", navbar: true, search: true });
  await getChatList();
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

const getChatList = async () => {
  chatApi.getList().then((res) => {
    console.log(res);
    chatList.value = res.data;
  });
};

const thumb = ref(["https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"]);
</script>
<template>
  <van-list v-model="loading" :finished="finished" @load="loadMore">
    <chat-list :list="chatList" />
  </van-list>
</template>

<style scope></style>
