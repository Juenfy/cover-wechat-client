<script setup>
import FriendAdd from "../friend/add.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import * as friendApi from "@/api/friend";
import { SearchFriend } from "@/enums/app";
import { ApplyStatus } from "@/enums/friend";
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const router = useRouter();
const appStore = useAppStore();
const showFriendAdd = ref(false);
const applyList = ref({
  three_day: [],
  over_three_day: [],
});

const onSearchFocus = () => {
  appStore.setShowCommonSearch(true);
  appStore.initCommonSearch({
    action: SearchFriend,
    placeholder: "账号/手机号",
  });
};

const getApplyList = () => {
  friendApi.getApplyList().then((res) => {
    applyList.value = res.data;
  });
};

const deleteApply = (id) => {
  friendApi.deleteApply(id).then((res) => {
    if (res.code == 200001) {
      getApplyList;
    }
  });
};

const handleHomeClick = (item) => {
  emit("hide");
  router.push({
    path: "/friend/info",
    query: {
      keywords: item.keywords,
    },
  });
};
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      getApplyList();
    }
  }
);
</script>

<template>
  <van-popup
    v-model:show="props.show"
    position="right"
    :style="{ height: '100%', width: '100%' }"
    duration="0.2"
  >
    <header>
      <van-nav-bar
        title="新的朋友"
        left-arrow
        :right-text="'添加朋友'"
        @click-left="$emit('hide')"
        @click-right="showFriendAdd = true"
      />
      <van-search
        placeholder="账号/手机号"
        input-align="center"
        @focus="onSearchFocus"
      />
    </header>
    <main>
      <van-cell-group title="近三天" v-if="applyList.three_day.length > 0">
        <van-swipe-cell v-for="item in applyList.three_day" :key="item.id">
          <van-cell :center="true" @click="handleHomeClick(item)">
            <template #title>
              <van-image
                height="2.5rem"
                width="2.5rem"
                radius="0.2rem"
                :src="item.friend.avatar"
              />
              <div class="left-box" style="">
                <span>{{ item.friend.nickname }}</span>
                <span>{{ item.remark }}</span>
              </div>
            </template>
            <template #right-icon>
              <div class="right-box" style="">
                <span>{{ ApplyStatus[item.status] }}</span>
              </div>
            </template>
          </van-cell>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              style="height: inherit"
              @click="deleteApply(item.id)"
            />
          </template>
        </van-swipe-cell>
      </van-cell-group>
      <van-cell-group title="三天前" v-if="applyList.over_three_day.length > 0">
        <van-swipe-cell v-for="item in applyList.over_three_day" :key="item.id">
          <van-cell :center="true" @click="handleHomeClick(item)">
            <template #title>
              <van-image
                height="2.5rem"
                width="2.5rem"
                radius="0.2rem"
                :src="item.friend.avatar"
              />
              <div class="left-box" style="">
                <span>{{ item.friend.nickname }}</span>
                <span>{{ item.remark }}</span>
              </div>
            </template>
            <template #right-icon>
              <div class="right-box" style="">
                <span>{{ ApplyStatus[item.status] }}</span>
              </div>
            </template>
          </van-cell>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              style="height: inherit"
              @click="deleteApply(item.id)"
            />
          </template>
        </van-swipe-cell>
      </van-cell-group>
    </main>
  </van-popup>

  <friend-add :show="showFriendAdd" @hide="showFriendAdd = false" />
</template>
<style scoped lang="less"></style>
