<script setup>
import { onMounted, reactive } from "vue";
import * as userApi from "@/api/user";
import { showSuccessToast, showFailToast } from "vant";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
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
      }, 1000);
    } else {
      return showFailToast(res.msg);
    }
  });
};
onMounted(() => {
  if (!localStorage.getItem("accessToken")) {
    userStore.handleLogout();
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
