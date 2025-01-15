<script setup>
import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import CommonCamera from "@/components/common/camera.vue";
import * as fileApi from "@/api/file";
import * as userApi from "@/api/user";
import { handleResponse } from "@/utils/helper";
import { GenderName } from "@/enums/user";
import CommonPopup from "@/components/common/popup.vue";
import {showFailToast} from "vant";

const router = useRouter();
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const userStore = useUserStore();
const userInfo = ref(userStore.info);
const showMore = ref(false);
const showAvatar = ref(false);
const showUpdateAvatar = ref(false);
const showCommonCamera = ref(false);
const showGender = ref(false);
const showSign = ref(false);
const showNickname = ref(false);
const updateAvatarActions = [
  { name: "拍照", value: "camera" },
  { name: "从手机相册选择", value: "album" },
  { name: "查看上一张头像", value: "prev-avatar" },
  { name: "保存", value: "save" }
];

const uploadRef = ref(null);

const takePhotoCb = (photo) => {
  showCommonCamera.value = false;
  alert(photo);
  userInfo.value.avatar = photo;
};

//更新头像菜单选中
const onSelectUpdateAvatarAction = (action) => {
  switch (action.value) {
    case "camera":
      showCommonCamera.value = true;
      break;
    case "album":
      console.log(uploadRef.value.chooseFile());
      break;
    default:
      break;
  }
};

const afterRead = (file) => {
  const data = new FormData();
  data.append("file", file.file);
  data.append("avatar", true);
  fileApi.upload(data).then((res) => {
    handleResponse(
      res,
      () => {
        updateUserInfo("avatar", res.data.path);
      },
      router,
      true
    );
  });
};

const updateUserInfo = (field, value) => {
  let data = {}
  data[field] = value;
  console.log(data);
  if (field == "sign" && value.length > 20) {
    return showFailToast("个性签名不能超过20个字符");
  }
  if (field == "nickname" && value.length > 16) {
    return showFailToast("个性签名不能超过16个字符");
  }
  userApi.putUpdate(data).then((res) => {
    if (res.code == 200001) {
      userStore.updateInfo(field, value);
      hide();
    } else {
      return showFailToast(res.msg);
    }
  });
};

const validator = {
  sign: (val) => val.length <= 20,
  nickname: (val) => val.length <= 16,
};

const hide = () => {
  showNickname.value = false;
  showSign.value = false;
  showGender.value = false;
  userInfo.value = userStore.info;
}

watch(
    () => userStore.info.avatar,
    (val) => {
      userInfo.value.avatar = val;
    }
);
</script>
<template>
  <common-popup :show="props.show">
    <template #header>
      <van-nav-bar title="个人信息" left-arrow @click-left="$emit('hide')" />
    </template>
    <template #container>
      <van-cell-group>
        <van-cell title="头像" is-link clickable @click="showAvatar = true" :center="true" size="large">
          <template #value>
            <van-image height="3.5rem" width="3.5rem" radius="0.35rem" :src="userStore.info.avatar" />
          </template>
        </van-cell>
        <van-cell title="名字" :value="userStore.info.nickname" is-link :center="true" size="large" @click="showNickname = true"/>
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
    </template>
    <template #extend>
      <!--更多-->
      <common-popup :show="showMore">
        <template #header>
          <van-nav-bar left-arrow @click-left="showMore = false" />
        </template>
        <template #container>
          <van-cell-group>
            <van-cell title="性别" :value="GenderName[userStore.info.gender]" is-link clickable :center="true" size="large" @click="showGender = true"/>
            <van-cell title="地区" value="中国 广州" is-link :center="true" size="large" />
            <van-cell title="个性签名" :value="userStore.info.sign" is-link clickable :center="true" size="large" @click="showSign = true"/>
          </van-cell-group>
        </template>
        <template #extend>
          <!--性别-->
          <common-popup :show="showGender" @hide="hide" title="设置性别" @submit="updateUserInfo('gender', userInfo.gender)">
            <template #container>
              <van-radio-group v-model="userInfo.gender">
                <van-cell-group :border="false">
                  <van-cell title="男" size="large" clickable>
                    <template #right-icon>
                      <van-radio name="male" />
                    </template>
                  </van-cell>
                  <van-cell title="女" size="large" clickable>
                    <template #right-icon>
                      <van-radio name="female" />
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
            </template>
          </common-popup>
          <!--个性签名-->
          <common-popup :show="showSign" @hide="hide" title="设置个性签名" @submit="updateUserInfo('sign', userInfo.sign)">
            <template #container>
              <van-form>
                <van-cell-group>
                  <van-field
                      v-model="userInfo.sign"
                      name="个性签名"
                      placeholder="个性签名"
                      :rules="[{ validator: validator.sign, message: '个性签名不能超过20个字符' }]"
                  />
                </van-cell-group>
              </van-form>
            </template>
          </common-popup>
        </template>
      </common-popup>
      <!--名字-->
      <common-popup :show="showNickname" @hide="hide" title="设置名字" @submit="updateUserInfo('nickname', userInfo.nickname)">
        <template #container>
          <van-form>
            <van-cell-group>
              <van-field
                  v-model="userInfo.nickname"
                  name="名字"
                  placeholder="名字"
                  :rules="[{ validator: validator.nickname, message: '名字不能超过16个字符' }]"
              />
            </van-cell-group>
          </van-form>
        </template>
      </common-popup>
      <!--查看头像-->
      <common-popup :show="showAvatar" popup-style="height: 100%; width: 100%; background: var(--van-black);" container-style="background: transparent;">
        <template #header>
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
        </template>
        <template #container>
          <van-image width="inherit" :src="userInfo.avatar" style="
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 100%;
            " />
        </template>
      </common-popup>
      <!--更换头像菜单-->
      <van-action-sheet v-model:show="showUpdateAvatar" :actions="updateAvatarActions"
                        @select="onSelectUpdateAvatarAction" cancel-text="取消" close-on-click-action />
      <van-uploader :after-read="afterRead" max-count="1" accept="image/*" ref="uploadRef" style="display: none;" />
      <common-camera :show="showCommonCamera" @hide="showCommonCamera = false" @takePhotoCb="takePhotoCb" />
    </template>
  </common-popup>
</template>
<style lang="less">
.van-cell-group {
  margin-bottom: 0.5rem;
}

[class*="van-hairline"]:after {
  border: none;
}
</style>
