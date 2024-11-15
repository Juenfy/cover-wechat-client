import { ref } from "vue";
import { defineStore } from "pinia";
export const useUserStore = defineStore(
  "user",
  () => {
    const isLogin = ref(false);
    const info = ref({});
    const homeInfo = ref({});

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

    const updateInfo = (key, val) => {
      info.value[key] = val;
    };

    const setHomeInfo = (data) => {
      homeInfo.value = data;
    };

    return {
      handleLogin,
      handleLogout,
      updateInfo,
      setHomeInfo,
      isLogin,
      info,
      homeInfo
    };
  },
  { persist: true }
);
