<script setup>
import ChatList from "@/components/chat/list.vue";
import { ref, onBeforeMount } from "vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const chatList = ref([
  {
    name: "张三",
    avatars: [
      "https://img.yzcdn.cn/vant/cat.jpeg",
      "https://img.yzcdn.cn/vant/cat.jpeg",
      "https://img.yzcdn.cn/vant/cat.jpeg",
    ],
    message: "今天天气不错",
    time: "1712915431",
    badge: 10,
    id: 1,
    type: "group",
    muted: true,
  },
  {
    name: "张三",
    avatars: [
      "https://img.yzcdn.cn/vant/cat.jpeg",
      "https://img.yzcdn.cn/vant/cat.jpeg",
      "https://img.yzcdn.cn/vant/cat.jpeg",
    ],
    message: "今天天气不错",
    time: "1712915431",
    badge: 0,
    id: 2,
    type: "group",
    muted: true,
  },
  {
    name: "张三",
    avatars: ["https://img.yzcdn.cn/vant/cat.jpeg"],
    message: "今天天气不错",
    time: "1712915431",
    badge: 100,
    id: 3,
    type: "private",
    muted: false,
  },
]);

const loading = ref(false);
const finished = ref(false);

defineEmits(["onSelect"]);

onBeforeMount(() => {
  console.log(chatList);
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

const handleItemClick = (item) => {
  console.log(item);
};
const thumb = ref(["https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"]);
</script>
<template>
  <van-list v-model="loading" :finished="finished" @load="loadMore">
    <chat-list :list="chatList" />
  </van-list>
</template>

<style scope></style>
