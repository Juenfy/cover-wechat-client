<script setup>
import FriendNew from "@/components/friend/new.vue";
import FriendRemark from "@/components/friend/remark.vue";
import GroupList from "@/components/chat/group/list.vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/stores/app";
import * as friendApi from "@/api/friend";

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const friendList = ref({});
const showFriendNew = ref(false);
const showFriendRemark = ref(false);
const showGroupList = ref(false);
const indexList = ref([]);
const getFriendList = async () => {
  friendApi.getList().then((res) => {
    friendList.value = res.data;
    indexList.value = Object.keys(res.data).reverse();
  });
};

const handleHomeClick = (item) => {
  router.push({
    path: "/friend/info",
    query: {
      keywords: item.keywords,
    },
  });
};

onMounted(async () => {
  appStore.initHeader({ title: "通讯录", navbar: true, search: true });
  await getFriendList();
  if (route.query.show_friend_new == 1) {
    showFriendNew.value = true;
  }
});
</script>

<template>
  <main class="friend-list">
    <van-index-bar :index-list="indexList">
      <van-cell
        title="新的朋友"
        icon="/public/new-friend.png"
        size="large"
        :center="true"
        clickable
        @click="showFriendNew = true"
      >
        <template #right-icon>
          <div v-if="appStore.unread.apply > 0">
            <van-badge :content="appStore.unread.apply" max="99" />
          </div>
        </template>
      </van-cell>
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
        @click="showGroupList = true"
      />
      <div v-for="val in indexList" :key="val">
        <van-index-anchor :index="val" />
        <van-swipe-cell v-for="item in friendList[val]" :key="item.friend">
          <van-cell
            :title="item.nickname"
            :icon="item.avatar"
            size="large"
            :center="true"
            @click="handleHomeClick(item)"
          />
          <template #right>
            <van-button
              square
              type="primary"
              text="备注"
              style="height: inherit"
              @click="showFriendRemark = true"
            />
          </template>
        </van-swipe-cell>
      </div>
    </van-index-bar>
  </main>
  <friend-new :show="showFriendNew" @hide="showFriendNew = false" />
  <friend-remark :show="showFriendRemark" @hide="showFriendRemark = false" />
  <group-list :show="showGroupList" @hide="showGroupList = false" />
</template>
