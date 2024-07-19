<script setup>
import * as friendApi from "@/api/friend";
import { ref, watch } from "vue";
import { Setting } from "@/enums/friend";
const props = defineProps({ show: Boolean, info: Object });
//调用父组件关闭弹窗
defineEmits(["hide"]);
const friendSetting = ref(Setting);

watch(
  () => props.info,
  (info) => {
    friendSetting.value = info.setting;
  }
);

const onChangePerm = (e) => {
  friendApi
    .putUpdate({
      friend: props.info.id,
      setting: friendSetting.value,
    })
    .then((res) => {
      console.log(res);
    });
};
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
        title="朋友权限"
        left-arrow
        @click-left="$emit('hide')"
        :border="false"
      />
    </header>
    <section class="bg-nav">
      <div class="header"></div>
      <div class="container">
        <van-radio-group
          v-model="friendSetting.FriendPerm.SettingFriendPerm"
          @change="onChangePerm"
        >
          <van-cell-group :border="false" title="设置朋友权限">
            <van-cell
              title="聊天、朋友圈、微信运动等"
              size="large"
              clickable
              @click="friendSetting.FriendPerm.SettingFriendPerm = 'ALLOW_ALL'"
            >
              <template #right-icon>
                <van-radio name="ALLOW_ALL" />
              </template>
            </van-cell>
            <van-cell
              title="仅聊天"
              size="large"
              clickable
              @click="friendSetting.FriendPerm.SettingFriendPerm = 'ONLY_CHAT'"
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
          v-if="friendSetting.FriendPerm.SettingFriendPerm === 'ALLOW_ALL'"
        >
          <van-cell title="不让他看" size="large">
            <template #right-icon>
              <van-switch
                v-model="
                  friendSetting.FriendPerm.MomentAndStatus.DontLetHimSeeIt
                "
                @change="onChangePerm"
              />
            </template>
          </van-cell>
          <van-cell title="不看他" size="large">
            <template #right-icon>
              <van-switch
                v-model="friendSetting.FriendPerm.MomentAndStatus.DontSeeHim"
                @change="onChangePerm"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </section>
  </van-popup>
</template>
<style scoped lang="less"></style>
