<script setup>
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { useAppStore } from "@/stores/app";
import ChatGroupCreate from "@/components/chat/group/create.vue";
const appStore = useAppStore();
const route = useRoute();
const fullPathToTabBarActive = reactive({
  "/": 0,
  "/chat": 0,
  "/friend": 1,
  "/discover": 2,
  "/me": 3,
});
const tabBarActive = ref(fullPathToTabBarActive[route.fullPath]);
const showPopover = ref(false);

const actions = [
  { text: "发起群聊", value: "create-group" },
  { text: "添加好友", value: "search-friend" },
];
const showChatGroupCreate = ref(false);

const hideChatGroupCreate = () => {
  showChatGroupCreate.value = false;
};
</script>

<template>
  <header>
    <van-nav-bar
      v-if="appStore.showNavbar"
      :title="appStore.navTitle"
      @click-right="!showPopover"
    >
      <template #right>
        <van-popover
          v-if="tabBarActive == 0"
          v-model:show="showPopover"
          theme="dark"
          :actions="actions"
          @select="showChatGroupCreate = true"
          placement="bottom-end"
        >
          <template #reference>
            <van-icon name="add-o" size="20" color="#191919" />
          </template>
        </van-popover>
        <router-link
          to="/friend/search"
          v-else-if="tabBarActive == 1"
          style="color: var(--van-text-color)"
        >
          <van-icon name="friends-o" size="20" color="#191919" />
        </router-link>
      </template>
    </van-nav-bar>
    <van-search
      placeholder="搜索"
      v-if="appStore.showSearch"
      input-align="center"
    />
  </header>

  <router-view />

  <footer>
    <van-tabbar
      v-model="tabBarActive"
      :route="true"
      z-index="999"
      @change="(index) => (tabBarActive = index)"
    >
      <van-tabbar-item :icon="tabBarActive == 0 ? 'chat' : 'chat-o'" to="/chat"
        >消息</van-tabbar-item
      >
      <van-tabbar-item
        :icon="tabBarActive == 1 ? 'friends' : 'friends-o'"
        to="/friend"
        >通讯录</van-tabbar-item
      >
      <van-tabbar-item
        :icon="tabBarActive == 2 ? 'eye' : 'eye-o'"
        badge="5"
        to="/discover"
        >发现</van-tabbar-item
      >
      <van-tabbar-item
        :icon="tabBarActive == 3 ? 'contact' : 'contact-o'"
        badge="20"
        to="/me"
        >我</van-tabbar-item
      >
    </van-tabbar>
  </footer>

  <chat-group-create :show="showChatGroupCreate" @hide="hideChatGroupCreate" />
</template>

<style scoped></style>
