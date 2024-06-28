import { ref } from "vue";
import { defineStore } from "pinia";
export const useUserStore = defineStore(
  "user",
  () => {
    const isLogin = ref(false);
    const info = ref({});

    const handleLogin = (user) => {
      info.value = user;
      localStorage.setItem("accessToken", user.token);
      isLogin.value = true;
    };

    const handleLogout = () => {
      info.value = {};
      localStorage.removeItem("accessToken");
      isLogin.value = false;
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
