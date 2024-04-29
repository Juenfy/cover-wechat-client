<script setup>
import FriendRemark from "@/components/friend/remark.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const showFriendSetting = () => {
  router.push("/friend/setting");
};
const showFriendRemark = ref(false);
</script>
<template>
  <header>
    <van-nav-bar
      left-arrow
      @click-left="router.go(-1)"
      @click-right="showFriendSetting"
      :border="false"
    >
      <template #right>
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
                  >PHP大佬<van-icon name="user" color="#008cff"
                /></span>
                <span class="vchat">微信号：phpdalao</span>
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
      />
      <van-cell title="朋友权限" is-link to="/friend/perm" size="large" />
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
      <van-cell title="个性签名" value="我是PHP大佬" size="large" />
      <van-cell title="来源" value="对方通过搜索手机号添加" size="large" />
    </van-cell-group>
    <van-button
      size="large"
      :square="true"
      icon="chat-o"
      style="
        margin-top: 0.5rem;
        border: none;
        color: var(--theme-blue-tint);
        font-weight: bold;
      "
      to="/chat/detail"
      >发送消息</van-button
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
