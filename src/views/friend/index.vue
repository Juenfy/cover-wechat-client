<script setup>
import FriendNew from "@/components/friend/new.vue";
import FriendRemark from "@/components/friend/remark.vue";
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import * as friendApi from "@/api/friend";
import { useFriendStore } from "@/stores/friend";
const appStore = useAppStore();
const friendStore = useFriendStore();
const showFriendNew = ref(false);
const showFriendRemark = ref(false);
const indexList = ref([]);
const getFriendList = async () => {
  if (friendStore.list.length == 0) {
    await friendApi.getList().then((res) => {
      friendStore.setList(res.data);
      indexList.value = Object.keys(res.data);
    });
  } else {
    indexList.value = Object.keys(friendStore.list);
  }
};
onMounted(async () => {
  appStore.initHeader({ title: "通讯录", navbar: true, search: true });
  await getFriendList();
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
      <div v-for="(val, index) in indexList" :key="index">
        <van-index-anchor :index="val" />
        <van-swipe-cell
          v-for="friend in friendStore.list[val]"
          :key="friend.friend.id"
        >
          <van-cell
            :title="friend.nickname"
            :icon="friend.friend.avatar"
            size="large"
            :center="true"
            @click="() => {}"
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
</template>
