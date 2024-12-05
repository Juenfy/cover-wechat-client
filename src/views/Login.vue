<script setup>
import { onMounted, reactive, ref } from "vue";
import * as userApi from "@/api/user";
import { showSuccessToast, showFailToast } from "vant";
import { useUserStore } from "@/stores/user";
import { useAppStore } from "@/stores/app";
import { useRouter, useRoute } from "vue-router";
import { Verify } from "@/components/Verifition";
import ws from "@/utils/websocket";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const formData = reactive({
  mobile: "",
  password: "",
  code: "1234",
  captchaVerification: "",
});
const captchaEnable = ref(true);
const verify = ref();
const captchaType = ref("blockPuzzle"); // blockPuzzle 滑块 clickWord 点击文字

const onSubmit = (data) => {
  formData.captchaVerification = data.captchaVerification || "";
  console.log(formData);
  userApi.postLogin(formData).then((res) => {
    console.log(res);
    if (res.code == 200102) {
      userStore.handleLogin(res.data);
      showSuccessToast(res.msg);
      setTimeout(() => {
        router.push("/chat");
      }, 200);
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

onMounted(() => {
  console.log(route.query);
  if (route.query.logout) {
    ws.stop();
    userStore.handleLogout();
    appStore.clear();
    showFailToast("账户信息已失效，请重新登录");
    setTimeout(() => {
      router.push("/login");
    }, 200);
  }
});
</script>

<template>
  <section class="login">
    <h3 style="color: var(--black-white-color)">手机号登录</h3>
    <van-form @submit="getCode">
      <van-cell-group inset>
        <van-field v-model="formData.mobile" name="手机号" label="手机号" placeholder="手机号" />
        <van-field v-model="formData.password" type="password" name="密码" label="密码" placeholder="密码" />
      </van-cell-group>
      <div style="margin: 1rem">
        <van-button block type="primary" native-type="submit">
          登录
        </van-button>
        <van-button block type="primary" to="/register" style="margin-top: 1rem">
          没有账号？注册
        </van-button>
      </div>
    </van-form>
    <Verify ref="verify" :captchaType="captchaType" :imgSize="{ width: '400px', height: '200px' }" mode="pop"
      @success="onSubmit" />
  </section>
</template>
