import { ref } from "vue";
import { defineStore } from "pinia";
export const useUserStore = defineStore(
  "user",
  () => {
    const isLogin = ref(false);
    const accessToken = ref("");
    const info = ref({});
    const handleLogin = (user) => {
      isLogin.value = true;
      accessToken.value = user.token;
      info.value = user;
      localStorage.setItem("accessToken", user.token);
    };

    const handleLogout = () => {
      isLogin.value = false;
      accessToken.value = "";
      info.value = {};
      localStorage.removeItem("accessToken");
    };
    return {
      handleLogin,
      handleLogout,
      isLogin,
      accessToken,
      info,
    };
  },
  { persist: true }
);
