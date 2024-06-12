import { ref } from "vue";
import { defineStore } from "pinia";
export const useUserStore = defineStore(
  "user",
  () => {
    const isLogin = ref(false);
    const info = ref({});
    const handleLogin = (user) => {
      isLogin.value = true;
      info.value = user;
      localStorage.setItem("accessToken", user.token);
    };

    const handleLogout = () => {
      isLogin.value = false;
      info.value = {};
      localStorage.removeItem("accessToken");
    };
    return {
      handleLogin,
      handleLogout,
      isLogin,
      info,
    };
  },
  { persist: true }
);
