import { ref } from "vue";
import { defineStore } from "pinia";
export const useUserStore = defineStore(
  "user",
  () => {
    const isLogin = ref(false);
    const accessToken = ref("");
    const info = ref({});
    const setting = ref({});
    const setSetting = (data) => {
      setting = data;
    };
    const handleLogin = (user) => {
      isLogin.value = true;
      accessToken.value = user.token;
      info = user;
      localStorage.setItem("accessToken", user.token);
    };

    const handleLogout = () => {
      isLogin.value = false;
      accessToken.value = "";
      info = {};
      localStorage.removeItem("accessToken");
    };
    return {
      setSetting,
      handleLogin,
      handleLogout,
      isLogin,
      accessToken,
      info,
    };
  },
  { persist: true }
);
