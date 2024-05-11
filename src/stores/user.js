import { ref } from "vue";
import { defineStore } from "pinia";
export const useUserStore = defineStore(
  "user",
  () => {
    const isLogin = ref(false);
    const accessToken = ref("");
    const userInfo = ref({});
    function handleLogin(user) {
      isLogin.value = true;
      accessToken.value = user.token;
      userInfo.value = user;
      localStorage.setItem("accessToken", user.token);
    }

    function handleLogout() {
      isLogin.value = false;
      accessToken.value = "";
      userInfo.value = {};
      localStorage.removeItem("accessToken");
    }
    return { handleLogin, handleLogout, isLogin, accessToken, userInfo };
  },
  { persist: true }
);
