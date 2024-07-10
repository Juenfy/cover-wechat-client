<script setup>
import MeInfo from "@/components/me/info.vue";
import { showConfirmDialog } from "vant";
import { onMounted, inject, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import * as userApi from "@/api/user";
const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const WebSocketClient = inject("WebSocketClient");
const showMeInfo = ref(false);

const onLogout = () => {
  showConfirmDialog({
    title: "提示",
    message: "确定退出登录吗？",
  })
    .then(async () => {
      // on confirm
      userApi.postLogout().then((res) => {
        if (res.code == 200001) {
          WebSocketClient.stop();
          userStore.handleLogout();
          appStore.clear();
          setTimeout(() => {
            router.push("/");
          }, 200);
        }
      });
    })
    .catch(() => {
      // on cancel
    });
};

onMounted(() => {
  appStore.initHeader({ title: "我", navbar: false, search: false });
});
</script>

<template>
  <main>
    <van-cell-group :border="false">
      <van-cell is-link clickable @click="showMeInfo = true" :center="true">
        <template #title>
          <div class="card">
            <div class="info">
              <van-image
                radius=".5rem"
                width="4rem"
                height="4rem"
                :src="userStore.info.avatar"
              />
              <div class="text">
                <span class="nickname"
                  >{{ userStore.info.nickname
                  }}<van-icon name="user" color="#008cff"
                /></span>
                <span class="vchat">微信号：{{ userStore.info.wechat }}</span>
                <span class="area">地区：广州</span>
              </div>
            </div>
          </div>
        </template>
        <template #right-icon>
          <van-icon name="qr" />
          <van-icon name="arrow" />
        </template>
      </van-cell>
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
      <van-cell :center="true" is-link to="/me/setting">
        <template #title>
          <van-image height="1.5rem" width="1.5rem" src="/setting.png" />
          <div class="left-box" style="">
            <span>设置</span>
            <span></span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-button
      size="large"
      :square="true"
      icon="chat-o"
      style="margin-top: 0.5rem; border: none; font-weight: bold"
      @click="onLogout"
      >退出登录</van-button
    >
  </main>
  <me-info :show="showMeInfo" @hide="showMeInfo = false" />
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
