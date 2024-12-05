<script setup>
import FriendNew from "@/components/friend/new.vue";
import FriendRemark from "@/components/friend/remark.vue";
import GroupList from "@/components/chat/group/list.vue";
import OnlyChatFriendList from "@/components/chat/friend/list.vue";
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
const showOnlyChatFriendList = ref(false);
const indexList = ref([]);
const friendInfo = ref({});
const getFriendList = async () => {
  friendApi.getList().then((res) => {
    friendList.value = res.data;
    indexList.value = Object.keys(res.data);
  });
};

//前往好友主页
const gotoFriendInfo = (keywords) => {
  router.push({
    name: "friend-info",
    query: {
      keywords: keywords,
    },
  });
};

const gotoFriendRemark = (item) => {
  friendInfo.value.id = item.friend;
  friendInfo.value.display_nickname = item.nickname;
  friendInfo.value.desc = item.desc;
  console.log(friendInfo.value);
  showFriendRemark.value = true;
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
  <div class="friend-list">
    <van-index-bar :index-list="indexList">
      <van-cell title="新的朋友" icon="/new-friend.png" size="large" :center="true" clickable @click="showFriendNew = true">
        <template #value>
          <van-badge v-if="appStore.unread.apply > 0" :content="appStore.unread.apply" max="99"
            class="van-badge--center" />
        </template>
      </van-cell>
      <van-cell title="仅聊天的朋友" icon="/friend-only-chat.png" size="large" :center="true"
        @click="showOnlyChatFriendList = true" />
      <van-cell title="群聊" icon="/group-chat.png" size="large" :center="true" @click="showGroupList = true" />
      <div v-for="val in indexList" :key="val">
        <van-index-anchor :index="val" />
        <van-swipe-cell v-for="item in friendList[val]" :key="item.friend">
          <van-cell :title="item.nickname" :icon="item.avatar" size="large" :center="true"
            @click="gotoFriendInfo(item.keywords)" />
          <template #right>
            <van-button square type="primary" text="备注" style="height: inherit" @click="gotoFriendRemark(item)" />
          </template>
        </van-swipe-cell>
      </div>
    </van-index-bar>
  </div>
  <friend-new :show="showFriendNew" @hide="showFriendNew = false" />
  <friend-remark :show="showFriendRemark" @hide="showFriendRemark = false" :info="friendInfo"
    @updateCb="getFriendList" />
  <group-list :show="showGroupList" @hide="showGroupList = false" />
  <only-chat-friend-list :show="showOnlyChatFriendList" @hide="showOnlyChatFriendList = false" />
</template>
