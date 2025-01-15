<!--设置聊天背景组件-->
<script setup>
import { UploadMaxSize } from "@/enums/file";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  closeToast,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
} from "vant";
import * as fileApi from "@/api/file";
import * as chatApi from "@/api/chat";
import * as userApi from "@/api/user";
import { useUserStore } from "@/stores/user";

const props = defineProps({ show: Boolean, info: Object, title: String, type: String });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const router = useRouter();
const maxSize = ref(UploadMaxSize.image);
const userStore = useUserStore();

const onOversize = () => {
  const limit = maxSize / 1024 / 1024;
  showFailToast("文件大小超过" + limit + "MB限制");
};

const afterRead = (file) => {
  console.log(file);
  showLoadingToast(`上传中`);
  const data = new FormData();
  data.append("file", file.file);

  fileApi
    .upload(data)
    .then((res) => {
      console.log(res);
      if (res.code == 200001) {
        setBackground(res.data);
      }
    })
    .finally(() => {
      closeToast(true);
    });
};

const setBackground = (data) => {
  switch (props.type) {
    case 'chat':
      const chatData = {
        to_user: props.info.to_user,
        is_group: props.info.is_group,
        bg_file_id: data.id,
        bg_file_path: data.path,
      };
      chatApi.putUpdate(chatData).then((res) => {
        if (res.code == 200001) {
          showSuccessToast(res.msg);
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      });
      break;
    case 'moment':
      const momentData = {
        moment_bg_file_id: data.id,
        moment_bg_file_path: data.path,
      };
      userApi.putUpdate(momentData).then((res) => {
        if (res.code == 200001) {
          showSuccessToast(res.msg);
          userStore.updateInfo('moment_bg_file_id', data.id);
          userStore.updateInfo('moment_bg_file_path', data.path);
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      });
      break;
  }
};
onMounted(() => {
  console.log(maxSize);
});
</script>
<template>
  <van-popup v-model:show="props.show" position="right" :style="{ height: '100%', width: '100%' }" duration="0.2">
    <header>
      <van-nav-bar :title="props.title" left-arrow @click-left="emit('hide')" />
    </header>
    <section class="bg-nav">
      <div class="header"></div>
      <div class="container">
        <van-cell-group>
          <van-cell title="选择背景图" is-link clickable size="large" />
        </van-cell-group>
        <van-uploader :after-read="afterRead" :max-size="maxSize" max-count="1" @oversize="onOversize"
          accept="image/jpg,image/png,image/webp,image/jpeg"><van-cell-group>
            <van-cell title="从手机相册选择" is-link clickable size="large" />
          </van-cell-group>
        </van-uploader>
        <van-cell-group>
          <van-cell title="拍一张" is-link clickable size="large" />
        </van-cell-group>
      </div>
    </section>
  </van-popup>
</template>
<style lang="less">
.van-uploader,
.van-uploader__wrapper,
.van-uploader__input-wrapper {
  width: 100%;
}
</style>
