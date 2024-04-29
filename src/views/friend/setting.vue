<script setup>
import FriendRemark from "@/components/friend/remark.vue";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const friendSetting = reactive({
  star: false,
  blacklist: false,
});
const showFriendRemark = ref(false);
const deleteFriend = () => {};
</script>
<template>
  <header>
    <van-nav-bar
      title="资料设置"
      left-arrow
      @click-left="router.go(-1)"
      :border="false"
    />
  </header>
  <main class="main">
    <van-cell-group>
      <van-cell
        title="设置备注和标签"
        is-link
        clickable
        @click="showFriendRemark = true"
        :center="true"
        size="large"
        value="PHP大佬"
      />
      <van-cell
        title="朋友权限"
        is-link
        to="/friend/perm"
        :center="true"
        size="large"
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell
        title="把他推荐给朋友"
        is-link
        to=""
        :center="true"
        size="large"
      />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="设置位星标朋友" :center="true" size="large">
        <template #right-icon>
          <van-switch v-model="friendSetting.star" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="加入黑名单" :center="true" size="large">
        <template #right-icon>
          <van-switch v-model="friendSetting.blacklist" />
        </template>
      </van-cell>
      <van-cell title="投诉" is-link to="" :center="true" size="large" />
    </van-cell-group>
    <van-button
      size="large"
      :square="true"
      style="margin-top: 0.5rem; border: none; color: var(--van-red)"
      @click="deleteFriend"
      >删除联系人</van-button
    >
  </main>
  <friend-remark :show="showFriendRemark" @hide="showFriendRemark = false" />
</template>

<style lang="less" scoped>
.van-cell-group {
  margin-bottom: 0.5rem;
}
</style>
