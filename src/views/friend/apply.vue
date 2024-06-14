<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as friendApi from "@/api/friend";
import { Apply } from "@/enums/friend";
import { handleResponse } from "@/utils/helper";
const router = useRouter();
const route = useRoute();

const formData = ref({
  remark: "",
  nickname: "",
  setting: {
    MomentAndStatus: {
      DontSeeHim: false,
      DontLetHimSeeIt: false,
    },
    SettingFriendPerm: "ALLOW_ALL",
  },
  type: "apply",
});

const showConfirm = async () => {
  friendApi
    .showConfirm({
      source: route.query.source,
      keywords: route.query.keywords,
      relationship: route.query.relationship,
    })
    .then((res) => {
      handleResponse(
        res,
        (res) => {
          formData.value = res.data;
        },
        router
      );
    });
};

const onSubmit = () => {
  console.log(formData.value);
  if (formData.value.type == Apply) {
    friendApi
      .postApply({
        friend: formData.value.friend.id,
        nickname: formData.value.nickname,
        remark: formData.value.remark,
        setting: formData.value.setting,
      })
      .then((res) => {
        handleResponse(
          res,
          (res) => {
            router.push({
              path: "/friend",
              query: {
                show_friend_new: 1,
              },
            });
          },
          router,
          true
        );
      });
  } else {
    friendApi
      .postVerify({
        friend: formData.value.friend.id,
        nickname: formData.value.nickname,
        setting: formData.value.setting,
      })
      .then((res) => {
        handleResponse(
          res,
          (res) => {
            router.push({
              path: "/friend",
            });
          },
          router,
          true
        );
      });
  }
};

onBeforeMount(async () => {
  await showConfirm();
});
</script>
<template>
  <header>
    <van-nav-bar
      :title="formData.type == 'apply' ? '申请添加朋友' : '通过好友验证'"
      left-arrow
      @click-left="router.go(-1)"
      :border="false"
    />
  </header>
  <main class="main">
    <van-form @submit="onSubmit">
      <van-cell-group title="发送添加好友申请" v-if="formData.type == 'apply'">
        <van-field
          v-model="formData.remark"
          name="备注名"
          placeholder="添加备注名"
          class="remark"
        />
      </van-cell-group>
      <van-cell-group title="设置备注">
        <van-field
          v-model="formData.nickname"
          name="备注"
          placeholder="添加备注"
        />
      </van-cell-group>
      <van-radio-group v-model="formData.setting.SettingFriendPerm">
        <van-cell-group :border="false" title="设置朋友权限">
          <van-cell
            title="聊天、朋友圈、微信运动等"
            size="large"
            clickable
            @click="formData.setting.SettingFriendPerm = 'ALLOW_ALL'"
          >
            <template #right-icon>
              <van-radio name="ALLOW_ALL" />
            </template>
          </van-cell>
          <van-cell
            title="仅聊天"
            size="large"
            clickable
            @click="formData.setting.SettingFriendPerm = 'ONLY_CHAT'"
          >
            <template #right-icon>
              <van-radio name="ONLY_CHAT" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-cell-group :border="false" title="朋友圈和状态">
        <van-cell title="不让他看" size="large">
          <template #right-icon>
            <van-switch
              v-model="formData.setting.MomentAndStatus.DontLetHimSeeIt"
            />
          </template>
        </van-cell>
        <van-cell title="不看他" size="large">
          <template #right-icon>
            <van-switch v-model="formData.setting.MomentAndStatus.DontSeeHim" />
          </template>
        </van-cell>
      </van-cell-group>
      <div style="margin-top: 2rem; text-align: center">
        <van-button type="primary" native-type="submit" style="width: 12rem">
          {{ formData.type == "apply" ? "提交" : "完成" }}
        </van-button>
      </div>
    </van-form>
  </main>
</template>
<style scoped lang="less">
.van-nav-bar {
  background: var(--vant-white);
}
.main {
  background: var(--vant-white);
  .van-form {
    padding: 1rem 2rem;
    .remark {
      height: 6rem;
    }
  }
}
</style>
