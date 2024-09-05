<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as friendApi from "@/api/friend";
import { Apply } from "@/enums/friend";
import { handleResponse } from "@/utils/helper";

const router = useRouter();
const route = useRoute();
const dataLoaded = ref(false);
const formData = ref(null);

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
        () => {
          formData.value = res.data;
          dataLoaded.value = true;
        },
        router
      );
    });
};

const onSubmit = () => {
  if (formData.value.type == Apply) {
    friendApi
      .postApply({
        keywords: route.query.keywords,
        nickname: formData.value.nickname,
        remark: formData.value.remark,
        setting: formData.value.setting,
      })
      .then((res) => {
        handleResponse(
          res,
          () => {
            router.push({
              name: "friend",
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
        friend: formData.value.friend,
        nickname: formData.value.nickname,
        setting: formData.value.setting,
      })
      .then((res) => {
        handleResponse(
          res,
          () => {
            router.push("/chat");
          },
          router,
          true
        );
      });
  }
};

onMounted(async () => {
  await showConfirm();
});
</script>
<template>
  <div v-if="dataLoaded">
    <header>
      <van-nav-bar :title="formData.type == 'apply' ? '申请添加朋友' : '通过好友验证'" left-arrow @click-left="router.go(-1)"
        :border="false" />
    </header>
    <section>
      <div class="header"></div>
      <div class="container friend-apply-container">
        <div class="common friend-apply">
          <van-form @submit="onSubmit">
            <van-cell-group title="发送添加好友申请" v-if="formData.type == 'apply'">
              <van-field v-model="formData.remark" name="备注名" placeholder="添加备注名" class="remark" />
            </van-cell-group>
            <van-cell-group title="设置备注">
              <van-field v-model="formData.nickname" name="备注" placeholder="添加备注" />
            </van-cell-group>
            <van-radio-group v-model="formData.setting.FriendPerm.SettingFriendPerm">
              <van-cell-group :border="false" title="设置朋友权限">
                <van-cell title="聊天、朋友圈、微信运动等" size="large" clickable @click="
                  formData.setting.FriendPerm.SettingFriendPerm = 'ALLOW_ALL'
                  ">
                  <template #right-icon>
                    <van-radio name="ALLOW_ALL" />
                  </template>
                </van-cell>
                <van-cell title="仅聊天" size="large" clickable @click="
                  formData.setting.FriendPerm.SettingFriendPerm = 'ONLY_CHAT'
                  ">
                  <template #right-icon>
                    <van-radio name="ONLY_CHAT" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
            <van-cell-group :border="false" title="朋友圈和状态">
              <van-cell title="不让他看" size="large">
                <template #right-icon>
                  <van-switch v-model="formData.setting.FriendPerm.MomentAndStatus
                    .DontLetHimSeeIt
                    " active-value="1" inactive-value="0" />
                </template>
              </van-cell>
              <van-cell title="不看他" size="large">
                <template #right-icon>
                  <van-switch v-model="formData.setting.FriendPerm.MomentAndStatus.DontSeeHim
                    " active-value="1" inactive-value="0" />
                </template>
              </van-cell>
            </van-cell-group>
            <div style="margin-top: 2rem; text-align: center">
              <van-button type="primary" native-type="submit" style="width: 12rem">
                {{ formData.type == Apply ? "提交" : "完成" }}
              </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped lang="less">
.van-nav-bar {
  background: var(--friend-remark-nav-bar-background);
}

.friend-apply-container {
  background: var(--friend-remark-background) !important;

  [class*="van-hairline"]:after {
    border: none !important;
  }

  .friend-apply {
    .van-form {
      padding: 1rem 2rem;

      .remark {
        height: 6rem;
      }
    }
  }
}
</style>
