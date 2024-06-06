<script setup>
import FriendRemark from "@/components/friend/remark.vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as userApi from "@/api/user";
const router = useRouter();
const route = useRoute();
const showFriendSetting = () => {};

const homeInfo = ref({});
const showFriendRemark = ref(false);

const onButtonClick = () => {
  router.push({
    path: "/friend/apply",
    query: {
      keywords: homeInfo.value.keywords,
      source: homeInfo.value.source,
    },
  });
};
onMounted(() => {
  userApi.getHomeInfo(route.query.keywords).then((res) => {
    homeInfo.value = res.data;
  });
});
</script>
<template>
  <header>
    <van-nav-bar
      left-arrow
      @click-left="router.go(-1)"
      @click-right="showFriendSetting"
      :border="false"
    >
      <template #right v-if="homeInfo.relationship == 'friend'">
        <van-icon name="ellipsis" />
      </template>
    </van-nav-bar>
  </header>
  <main>
    <van-cell-group :border="false">
      <van-cell>
        <template #title>
          <div class="card">
            <div class="info">
              <van-image
                radius=".5rem"
                width="4rem"
                height="4rem"
                src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
              />
              <div class="text">
                <span class="nickname"
                  >{{ homeInfo.nickname }}<van-icon name="user" color="#008cff"
                /></span>
                <span class="vchat">微信号：{{ homeInfo.wechat }}</span>
                <span class="area">地区：上海</span>
              </div>
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell
        title="备注和标签"
        is-link
        clickable
        @click="showFriendRemark = true"
        size="large"
        v-if="homeInfo.relationship == 'friend'"
      />
      <van-cell
        title="朋友权限"
        is-link
        to="/friend/perm"
        size="large"
        v-if="homeInfo.relationship == 'friend'"
      />
    </van-cell-group>
    <van-cell-group :border="false">
      <van-cell is-link to="index" size="large" :center="true">
        <template #title>
          <span>朋友圈</span>
          <van-image
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            style="width: 3rem; height: 3rem; margin-left: 1rem"
          />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group :border="false">
      <van-cell
        title="个性签名"
        v-if="homeInfo.sign"
        :value="homeInfo.sign"
        size="large"
      />
      <van-cell
        title="来源"
        :value="homeInfo.source_text"
        size="large"
        v-if="homeInfo.relationship != 'owner'"
      />
    </van-cell-group>
    <van-button
      size="large"
      :square="true"
      icon="chat-o"
      @click="onButtonClick"
      v-if="
        homeInfo.relationship == 'owner' || homeInfo.relationship == 'friend'
      "
      >发送消息</van-button
    >
    <van-button
      size="large"
      :square="true"
      @click="onButtonClick"
      v-if="homeInfo.relationship == 'apply'"
      >添加到通讯录</van-button
    >
    <van-button
      size="large"
      :square="true"
      @click="onButtonClick"
      v-if="homeInfo.relationship == 'go_check'"
      >前往验证</van-button
    >
  </main>
  <friend-remark :show="showFriendRemark" @hide="showFriendRemark = false" />
</template>
<style scoped lang="less">
.van-nav-bar {
  background: var(--van-white);
}
.van-cell-group {
  margin-bottom: 0.5rem;
}
main {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: var(--van-nav-bar-background);
  button {
    margin-top: 0.5rem;
    border: none;
    color: var(--theme-blue-tint);
    font-weight: bold;
  }
  .card {
    width: 100%;
    background-color: var(--van-white);
    .info {
      display: flex;
      position: relative;
      justify-content: flex-start;
      justify-items: flex-start;
      padding: 1.5rem 1.5rem 2.5rem 1.5rem;
      .text {
        height: 4rem;
        margin-left: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        span {
          color: var(--theme-text-color-tint);
        }
        .nickname {
          color: var(--van-text-color);
          font-weight: bold;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
