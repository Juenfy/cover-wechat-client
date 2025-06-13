<script setup>
import ChatGroupAction from "@/components/chat/group/action.vue";
import FriendAdd from "@/components/friend/add.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { Home, HomeActions, CreateGroup, SearchFriend } from "@/enums/app";

const appStore = useAppStore();
const userStore = useUserStore();
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

const onSearchFocus = () => {
  appStore.setShowCommonSearch(true);
  appStore.initCommonSearch({
    action: Home,
    placeholder: "搜索",
  });
};

const onSelect = (action) => {
  switch (action.value) {
    case CreateGroup:
      showChatGroupCreate.value = true;
      break;
    case SearchFriend:
      showFriendAdd.value = true;
      break;
    default:
      router.push("/me/qrcode/scan");
      break;
  }
};

onMounted(() => {
  if (["light", "dark"].includes(route.query?.theme) && route.query.theme != appStore.theme) {
    appStore.setTheme(route.query.theme);
  }
  if (userStore.isLogin && route.fullPath == "/") {
    router.push("/chat");
  }
});
</script>

<template>
  <div v-if="userStore.isLogin">
    <div>
      <header>
        <van-nav-bar v-if="appStore.showNavbar" :title="appStore.navTitle" @click-right="!showPopover" :border="false">
          <template #right>
            <van-popover v-if="tabBarActive == 0" v-model:show="showPopover" theme="dark" :actions="HomeActions"
              @select="onSelect" placement="bottom-end">
              <template #reference>
                <van-icon name="add-o" size="20" />
              </template>
            </van-popover>
            <van-icon name="friends-o" size="20" v-if="tabBarActive == 1" @click="showFriendAdd = true" />
          </template>
        </van-nav-bar>
      </header>

      <section>
        <div class="header" v-if="appStore.showNavbar"></div>
        <div class="container">
          <van-search placeholder="搜索" v-if="appStore.showSearch" input-align="center" @focus="onSearchFocus" />
          <router-view />
        </div>
        <div class="footer"></div>
      </section>
      <footer>
        <van-tabbar v-model="tabBarActive" :route="true" z-index="999" @change="(index) => (tabBarActive = index)">
          <van-tabbar-item :icon="tabBarActive == 0 ? 'chat' : 'chat-o'" to="/chat" :badge-props="{
            content: appStore.unread.chat > 0 ? appStore.unread.chat : '',
            max: 99,
          }">消息</van-tabbar-item>
          <van-tabbar-item :icon="tabBarActive == 1 ? 'friends' : 'friends-o'" :badge-props="{
            content: appStore.unread.friend > 0 ? appStore.unread.friend : '',
            max: 99,
          }" to="/friend">通讯录</van-tabbar-item>
          <van-tabbar-item :icon="tabBarActive == 2 ? 'eye' : 'eye-o'" :badge-props="{
            content:
              appStore.unread.discover > 0 ? appStore.unread.discover : '',
            max: 99,
          }" to="/discover">发现</van-tabbar-item>
          <van-tabbar-item :icon="tabBarActive == 3 ? 'contact' : 'contact-o'" to="/me">我</van-tabbar-item>
        </van-tabbar>
      </footer>

      <chat-group-action :show="showChatGroupCreate" @hide="showChatGroupCreate = false" action="create" :users="[]"/>
      <friend-add :show="showFriendAdd" @hide="showFriendAdd = false" />
    </div>
  </div>
  <div class="index" v-else>
    <div class="passport">
      <van-button type="primary" style="margin-left: 1rem" to="login?mobile=13006789002&password=123456">登录</van-button>
      <van-button style="margin-right: 1rem" to="register">注册</van-button>
    </div>
  </div>
</template>

<style lang="less">
.index {
  height: 100vh;
  width: 100%;
  position: relative;
  background-image: url(../assets/home-bg.jpeg);
  background-position: center;
  background-size: cover;
}

.passport {
  width: inherit;
  position: fixed;
  left: 0;
  bottom: 2rem;
  display: flex;
  justify-content: space-between;

  button {
    width: 7rem;
  }
}
</style>
