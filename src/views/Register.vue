<script setup>
import { reactive, ref } from "vue";
import * as userApi from "@/api/user";
import { showSuccessToast, showFailToast } from "vant";
import { Verify } from "@/components/Verifition";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import * as fileApi from "@/api/file";
const userStore = useUserStore();
const router = useRouter();
const formData = reactive({
  avatar: "",
  nickname: "",
  mobile: "",
  wechat: "",
  password: "",
  captchaVerification: "",
});
const avatar = ref([]);
const captchaEnable = ref(true);
const verify = ref();
const captchaType = ref("blockPuzzle"); // blockPuzzle 滑块 clickWord 点击文字

const onSubmit = (data) => {
  formData.captchaVerification = data.captchaVerification || "";
  console.log(formData);
  userApi.postRegister(formData).then((res) => {
    console.log(res);
    if (res.code == 200101) {
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

const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (!captchaEnable.value) {
    onSubmit({});
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show();
  }
};

const afterRead = (file) => {
  avatar.value = [];
  const data = new FormData();
  data.append("file", file.file);
  data.append("avatar", true);
  fileApi.upload(data).then((res) => {
    console.log(res);
    if (res.code == 200001) {
      formData.avatar = res.data.path;
      avatar.value = [{ url: res.data.url, imageFit: "contain" }];
    }
    console.log(formData);
  });
};
</script>

<template>
  <section class="register">
    <h3 style="color: var(--black-white-color)">手机号注册</h3>
    <van-uploader
      :after-read="afterRead"
      v-model="avatar"
      accept="image/*"
      style="margin: 2rem 0"
      :deletable="false"
      :reupload="true"
      max-count="1"
    />
    <van-form @submit="getCode">
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
    <Verify
      ref="verify"
      :captchaType="captchaType"
      :imgSize="{ width: '400px', height: '200px' }"
      mode="pop"
      @success="onSubmit"
    />
  </section>
</template>
