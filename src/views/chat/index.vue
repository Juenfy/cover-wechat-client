<!--消息列表页面-->
<script setup>
import ChatList from "@/components/chat/list.vue";
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useRoute } from "vue-router";
import { chatList, getChatList, sortChatList } from "@/utils/websocket";
import { UnreadChat, UnreadFriend, UnreadApply } from "@/enums/app";
const appStore = useAppStore();
const route = useRoute();
const loading = ref(false);
const finished = ref(false);

const handleAction = (type, data) => {
  let uk = data.is_group + ":" + data.from_user + "-" + data.to_user;
  console.log(uk);
  chatList.value.forEach((item, index) => {
    let key = item.is_group + ":" + data.from_user + "-" + item.to_user;
    console.log(key);
    if (key == uk) {
      switch (type) {
        case "top":
          chatList.value[index].top = data.top;
          break;
        case "delete":
        case "hide":
          chatList.value.splice(index, 1);
          break;
      }
      return;
    }
  });
  console.log(chatList);
  chatList.value = sortChatList(chatList.value);
};

const computeUnread = () => {
  //通过好友验证消息未读数计算
  if (route.query.verify) {
    appStore.unreadIncrBy(UnreadChat);
    appStore.unreadDecrBy(UnreadFriend, appStore.unread.apply);
    appStore.unreadDecrBy(UnreadApply, appStore.unread.apply);
  }
};

onMounted(() => {
  appStore.initHeader({ title: "微信", navbar: true, search: true });
  getChatList();
  computeUnread();
});
</script>
<template>
  <van-list v-model="loading" :finished="finished">
    <chat-list :list="chatList" @action="handleAction" />
  </van-list>
</template>

<style scope></style>
