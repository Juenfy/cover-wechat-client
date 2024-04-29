<script setup>
import FriendNew from "@/components/friend/new.vue";
import { ref, onBeforeMount } from "vue";
import { useAppStore } from "@/stores/app";
const appStore = useAppStore();
const showFriendNew = ref(false);

onBeforeMount(() => {
  appStore.initHeader({ title: "通讯录", navbar: true, search: true });
});
</script>

<template>
  <main class="friend-list">
    <van-index-bar>
      <van-cell
        title="新的朋友"
        icon="/public/new-friend.png"
        size="large"
        :center="true"
        clickable
        @click="showFriendNew = true"
      />
      <van-cell
        title="仅聊天的朋友"
        icon="/public/friend-only-chat.png"
        size="large"
        :center="true"
        @click="() => {}"
      />
      <van-cell
        title="群聊"
        icon="/public/group-chat.png"
        size="large"
        :center="true"
        @click="() => {}"
      />
      <van-index-anchor index="A" />
      <van-cell
        title="文本"
        icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
        size="large"
        :center="true"
        @click="() => {}"
      />
      <van-cell
        title="文本"
        icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
        size="large"
        :center="true"
      />

      <van-index-anchor index="B" />
      <van-cell
        title="文本"
        icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
        size="large"
        :center="true"
      />
      <van-cell
        title="文本"
        icon="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
        size="large"
        :center="true"
      />
    </van-index-bar>
  </main>
  <friend-new :show="showFriendNew" @hide="showFriendNew = false" />
</template>
