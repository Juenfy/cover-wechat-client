<script setup>
import { onMounted, reactive, inject } from "vue";
import * as userApi from "@/api/user";
import { showSuccessToast, showFailToast } from "vant";
import { useUserStore } from "@/stores/user";
import { useFriendStore } from "@/stores/friend";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const WebSocketClient = inject("WebSocketClient");
const userStore = useUserStore();
const friendStore = useFriendStore();
const formData = reactive({
  mobile: "",
  password: "",
  code: "1234",
});

const onSubmit = () => {
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
onMounted(() => {
  console.log(route.query);
  if (route.query.logout) {
    WebSocketClient.stop();
    userStore.handleLogout();
    friendStore.clear();
    return showFailToast("账户信息已失效，请重新登录");
  }
});
</script>

<template>
  <div class="main">
    <h3>手机号登录</h3>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
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
          登录
        </van-button>
        <van-button
          block
          type="primary"
          to="/register"
          style="margin-top: 1rem"
        >
          没有账号？注册
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
