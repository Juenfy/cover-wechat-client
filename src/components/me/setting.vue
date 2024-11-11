<!--聊天设置页面-->
<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user.js";
import * as userApi from "@/api/user";

const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const props = defineProps({ show: Boolean, info: Object });
const userSetting = reactive(userStore.info.setting);

//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);

const updateUserSetting = () => {
  userApi.putUpdate({ setting:userSetting }).then((res) => {
    if (res.code == 200001) {
      userStore.updateInfo('setting', userSetting);
    }
  });
}
</script>

<template>
  <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
    <header>
      <van-nav-bar title="设置" left-arrow @click-left="$emit('hide')" :border="false" />
    </header>
    <section class="bg-nav">
      <div class="header"></div>
      <div class="container me-setting-container">
        <van-cell-group  title="添加我的方式">
          <van-cell title="手机号" size="large">
            <template #right-icon>
              <van-switch v-model="userSetting.FriendPerm.AddMyWay.Mobile" @update:model-value="updateUserSetting" active-value="1" inactive-value="0"/>
            </template>
          </van-cell>
          <van-cell title="微信号" size="large">
            <template #right-icon>
              <van-switch v-model="userSetting.FriendPerm.AddMyWay.Wechat" @update:model-value="updateUserSetting" active-value="1" inactive-value="0"/>
            </template>
          </van-cell>
          <van-cell title="二维码" size="large">
            <template #right-icon>
              <van-switch v-model="userSetting.FriendPerm.AddMyWay.QRCode" @update:model-value="updateUserSetting" active-value="1" inactive-value="0"/>
            </template>
          </van-cell>
          <van-cell title="群聊" size="large">
            <template #right-icon>
              <van-switch v-model="userSetting.FriendPerm.AddMyWay.GroupChat" @update:model-value="updateUserSetting" active-value="1" inactive-value="0"/>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group  title="朋友圈">
          <van-cell title="允许陌生人查看十条朋友圈" size="large">
            <template #right-icon>
              <van-switch v-model="userSetting.FriendPerm.Moment.AllowStrangerTen" @update:model-value="updateUserSetting" active-value="1" inactive-value="0"/>
            </template>
          </van-cell>
          <van-radio-group v-model="userSetting.FriendPerm.Moment.FriendWatchRange" @change="updateUserSetting">
            <van-cell-group :border="false" title="允许朋友查看朋友圈范围">
              <van-cell title="全部" size="large" clickable
                        @click="userSetting.FriendPerm.Moment.FriendWatchRange = 'ALLOW_ALL'">
                <template #right-icon>
                  <van-radio name="ALLOW_ALL" />
                </template>
              </van-cell>
              <van-cell title="最近半年" size="large" clickable
                        @click="userSetting.FriendPerm.Moment.FriendWatchRange = 'HALF_YEAR'">
                <template #right-icon>
                  <van-radio name="HALF_YEAR" />
                </template>
              </van-cell>
              <van-cell title="最近一个月" size="large" clickable
                        @click="userSetting.FriendPerm.Moment.FriendWatchRange = 'ONE_MONTH'">
                <template #right-icon>
                  <van-radio name="ONE_MONTH" />
                </template>
              </van-cell>
              <van-cell title="最近三天" size="large" clickable
                        @click="userSetting.FriendPerm.Moment.FriendWatchRange = 'THREE_DAYS'">
                <template #right-icon>
                  <van-radio name="THREE_DAYS" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </van-cell-group>
      </div>
    </section>
  </van-popup>
</template>
<style lang="less" scoped>
</style>
