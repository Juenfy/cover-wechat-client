import axios from "axios";
import ws from "@/utils/websocket";

const http = axios.create({
  timeout: 60000,
});

http.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("accessToken")) {
      config.headers["Authorization"] =
        "Bearer " + localStorage.getItem("accessToken");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  async (response) => {
    const res = response.data;
    // token过期了
    if ([401200, 400006].indexOf(res.code) != -1) {
      const { useUserStore } = await import('@/stores/user');
      const { useAppStore } = await import('@/stores/app');
      const { showFailToast } = await import('vant');
      const userStore = useUserStore();
      const appStore = useAppStore();
      ws.stop();
      await userStore.handleLogout();
      await appStore.clear();
      showFailToast("账户信息已失效，请重新登录");
      setTimeout(() => {
        location.href = "/login";
      }, 1000);
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default http;
