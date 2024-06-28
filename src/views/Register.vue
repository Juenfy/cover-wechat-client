<script setup>
import { reactive } from "vue";
import * as userApi from "@/api/user";
import { showSuccessToast, showFailToast } from "vant";
const formData = reactive({
  avatar: "",
  nickname: "",
  mobile: "",
  wechat: "",
  password: "",
});
const onSubmit = () => {
  console.log(formData);
  userApi.postRegister(formData).then((res) => {
    console.log(res);
    if (res.code === 200101) {
      userStore.handleLogin(res.data);
      showSuccessToast("登录成功");
      setTimeout(() => {
        router.push("/chat");
      }, 1000);
    } else {
      return showFailToast(res.msg);
    }
  });
};

const afterRead = (file) => {
  console.log(file);
};
</script>

<template>
  <div class="main">
    <h3>手机号注册</h3>
    <van-uploader
      :after-read="afterRead"
      v-model="formData.avatar"
      accept="image/*"
      style="margin: 2rem 0"
      :preview-image="false"
    />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formData.nickname"
          name="昵称"
          label="昵称"
          placeholder="昵称"
        />
        <van-field
          v-model="formData.wechat"
          name="微信号"
          label="微信号"
          placeholder="微信号"
        />
        <van-field
          v-model="formData.mobile"
          name="手机号"
          label="手机号"
          placeholder="手机号"
        />
        <van-field
          v-model="formData.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
        />
      </van-cell-group>
      <div style="margin: 1rem">
        <van-button block type="primary" native-type="submit">
          注册
        </van-button>
        <van-button block type="primary" to="/login" style="margin-top: 1rem">
          已有账号？登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<style scoped lang="less">
.main {
  background: var(--van-white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .van-form {
    width: 100%;
    .van-cell-group,
    .van-cell {
      background: none;
    }
  }
}
</style>
