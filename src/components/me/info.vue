<script setup>
import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import CommonCamera from "@/components/common/camera.vue";
import * as fileApi from "@/api/file";
import * as userApi from "@/api/user";
import { handleResponse } from "@/utils/helper";

const router = useRouter();
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const userStore = useUserStore();
const avatar = ref(userStore.info.avatar);
const showMore = ref(false);
const showAvatar = ref(false);
const showUpdateAvatar = ref(false);
const showCommonCamera = ref(false);
const gender = ref({
  male: "男",
  female: "女",
  unknown: "未知",
});

const openCamera = () => {
  showUpdateAvatar.value = false;
  showCommonCamera.value = true;
};

const takePhotoCb = (photo) => {
  showCommonCamera.value = false;
  alert(photo);
  // console.log(photo);
  avatar.value = photo;
};
watch(
  () => userStore.info.avatar,
  (val) => {
    avatar.value = val;
  }
);

const afterRead = (file) => {
  const data = new FormData();
  data.append("file", file.file);
  data.append("avatar", true);
  fileApi.upload(data).then((res) => {
    handleResponse(
      res,
      () => {
        userApi.putUpdate({ avatar: res.data.path }).then(() => {
          userStore.updateInfo("avatar", res.data.url);
          showUpdateAvatar.value = false;
        });
      },
      router,
      true
    );
  });
};
</script>
<template>
  <van-popup v-model:show="props.show" position="right"
    style="height: 100%; width: 100%; background: var(--van-nav-bar-background)" duration="0.2">
    <header>
      <van-nav-bar title="个人信息" left-arrow @click-left="$emit('hide')" />
    </header>
    <section>
      <div class="header"></div>
      <div class="container">
        <van-cell-group>
          <van-cell title="头像" is-link clickable @click="showAvatar = true" :center="true" size="large">
            <template #value>
              <van-image height="3.5rem" width="3.5rem" radius="0.1rem" :src="userStore.info.avatar" />
            </template>
          </van-cell>
          <van-cell title="名字" :value="userStore.info.nickname" is-link :center="true" size="large" />
          <van-cell title="拍一拍" :value="userStore.info.wechat" is-link :center="true" size="large" />
          <van-cell title="微信号" :value="userStore.info.wechat" is-link :center="true" size="large" />
          <van-cell title="我的二维码" is-link to="/me/qrcode/index" :center="true" size="large">
            <template #value>
              <van-icon name="qr" size="1rem" />
            </template>
          </van-cell>
          <van-cell title="更多" is-link clickable @click="showMore = true" :center="true" size="large" />
        </van-cell-group>
        <van-cell-group>
          <van-cell title="来电铃声" is-link :center="true" size="large" />
        </van-cell-group>

        <van-cell-group>
          <van-cell title="微信豆" is-link :center="true" size="large" />
        </van-cell-group>

        <van-cell-group>
          <van-cell title="我的地址" is-link :center="true" size="large" />
        </van-cell-group>
      </div>
    </section>

    <!--更多-->
    <van-popup v-model:show="showMore" position="right" style="
        height: 100%;
        width: 100%;
        background: var(--van-nav-bar-background);
      " duration="0.2">
      <header>
        <van-nav-bar left-arrow @click-left="showMore = false" />
      </header>
      <section class="bg-nav">
        <div class="header"></div>
        <div class="container">
          <van-cell-group>
            <van-cell title="性别" :value="gender[userStore.info.gender]" is-link clickable :center="true" size="large" />
            <van-cell title="地区" value="中国 广州" is-link :center="true" size="large" />
            <van-cell title="个性签名" :value="userStore.info.sign" is-link :center="true" size="large" />
          </van-cell-group>
        </div>
      </section>
    </van-popup>
    <!--查看头像-->
    <van-popup v-model:show="showAvatar" position="right"
      style="height: 100%; width: 100%; background: var(--van-black)" duration="0.2">
      <header>
        <van-nav-bar @click-left="showAvatar = false" style="background: transparent">
          <template #left>
            <van-icon name="arrow-left" size="20" color="var(--theme-white-cd)" />
          </template>
          <template #title>
            <span style="color: var(--theme-white)">个人头像</span>
          </template>
          <template #right>
            <van-icon name="ellipsis" size="20" color="var(--theme-white-cd)" @click="showUpdateAvatar = true" />
          </template>
        </van-nav-bar>
      </header>
      <section class="bg-black">
        <div class="header"></div>
        <div class="container" style="background: transparent">
          <van-image width="inhert" :src="avatar" style="
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 100%;
            " />
        </div>
      </section>
    </van-popup>
    <!--更换头像菜单-->
    <van-popup v-model:show="showUpdateAvatar" round position="bottom" class="popup-menu">
      <van-cell-group>
        <van-cell title="拍照" clickable @click="openCamera" size="large" />
        <van-cell title="拍照" clickable size="large">
          <template #title>
            <van-uploader :after-read="afterRead" max-count="1" accept="image/*">从手机相册选择</van-uploader>
          </template>
        </van-cell>
        <van-cell title="查看上一张头像" clickable size="large" />
        <van-cell title="保存图片" clickable size="large" />
      </van-cell-group>
      <van-cell-group class="cancel">
        <van-cell title="取消" clickable @click="showUpdateAvatar = false" size="large" />
      </van-cell-group>
    </van-popup>
  </van-popup>
  <common-camera :show="showCommonCamera" @hide="showCommonCamera = false" @takePhotoCb="takePhotoCb" />
</template>
<style lang="css"></style>
<style scoped lang="less">
.van-cell-group {
  margin-bottom: 0.5rem;
}

[class*="van-hairline"]:after {
  border: none;
}
</style>
