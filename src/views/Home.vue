<script setup>
import ChatGroupCreate from "@/components/chat/group/create.vue";
import CommonSearch from "@/components/common/search.vue";
import FriendAdd from "@/components/friend/add.vue";

import { useRoute, useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { useAppStore } from "@/stores/home";

const homeStore = useAppStore();
const route = useRoute();
const router = useRouter();
const fullPathToTabBarActive = reactive({
  "/": 0,
  "/chat": 0,
  "/friend": 1,
  "/discover": 2,
  "/me": 3,
});
const tabBarActive = ref(fullPathToTabBarActive[route.fullPath] ?? 0);

const showPopover = ref(false);
const showFriendAdd = ref(false);
const showChatGroupCreate = ref(false);

const actions = [
  { text: "发起群聊", value: "create-group" },
  { text: "添加好友", value: "search-friend" },
  { text: "扫一扫", value: "qrcode-scan" },
];

const onSelect = (action) => {
  switch (action.value) {
    case "create-group":
      showChatGroupCreate.value = true;
      break;
    case "search-friend":
      showFriendAdd.value = true;
      break;
    default:
      router.push("/me/qrcode/scan");
      break;
  }
};

const showSearch = ref(false);
const searchResult = ref([]);
const onSearch = (value) => {};
</script>

<template>
  <header>
    <van-nav-bar
      v-if="homeStore.showNavbar"
      :title="homeStore.navTitle"
      @click-right="!showPopover"
    >
      <template #right>
        <van-popover
          v-if="tabBarActive == 0"
          v-model:show="showPopover"
          theme="dark"
          :actions="actions"
          @select="onSelect"
          placement="bottom-end"
        >
          <template #reference>
            <van-icon name="add-o" size="20" color="#191919" />
          </template>
        </van-popover>
        <van-icon
          name="friends-o"
          size="20"
          color="#191919"
          v-if="tabBarActive == 1"
          @click="showFriendAdd = true"
        />
      </template>
    </van-nav-bar>
    <van-search
      placeholder="搜索"
      v-if="homeStore.showSearch"
      input-align="center"
      @focus="showSearch = true"
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

  <chat-group-create
    :show="showChatGroupCreate"
    @hide="showChatGroupCreate = false"
  />
  <common-search
    :show="showSearch"
    @hide="showSearch = false"
    action="home"
    placeholder="搜索"
    background="var(--van-nav-bar-background)"
    @search="onSearch"
    :result="searchResult"
  />
  <friend-add
    :show="showFriendAdd"
    @showSearch="showSearch = true"
    @hide="showFriendAdd = false"
  />
</template>

<style scoped></style>
