<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const friendSetting = reactive({
  MomentAndStatus: {
    DontSeeHim: 0,
    DontLetHimSeeIt: 0,
  },
  SettingFriendPerm: "ALLOW_ALL",
});
</script>
<template>
  <header>
    <van-nav-bar
      title="朋友权限"
      left-arrow
      @click-left="router.go(-1)"
      :border="false"
    />
  </header>
  <main class="main">
    <van-radio-group v-model="friendSetting.SettingFriendPerm">
      <van-cell-group :border="false" title="设置朋友权限">
        <van-cell
          title="聊天、朋友圈、微信运动等"
          size="large"
          clickable
          @click="friendSetting.SettingFriendPerm = 'ALLOW_ALL'"
        >
          <template #right-icon>
            <van-radio name="ALLOW_ALL" />
          </template>
        </van-cell>
        <van-cell
          title="仅聊天"
          size="large"
          clickable
          @click="friendSetting.SettingFriendPerm = 'ONLY_CHAT'"
        >
          <template #right-icon>
            <van-radio name="ONLY_CHAT" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-cell-group
      :border="false"
      title="朋友圈和状态"
      v-if="friendSetting.SettingFriendPerm === 'ALLOW_ALL'"
    >
      <van-cell title="不让他看" size="large">
        <template #right-icon>
          <van-switch v-model="friendSetting.MomentAndStatus.DontLetHimSeeIt" />
        </template>
      </van-cell>
      <van-cell title="不看他" size="large">
        <template #right-icon>
          <van-switch v-model="friendSetting.MomentAndStatus.DontSeeHim" />
        </template>
      </van-cell>
    </van-cell-group>
  </main>
</template>
<style scoped lang="less"></style>
