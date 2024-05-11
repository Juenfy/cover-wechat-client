import axios from "axios";
import { showFailToast } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();

const http = axios.create({
  timeout: 5000,
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
  (response) => {
    const res = response.data;
    if ([401200, 400006].indexOf(res.code) != -1) {
      // 登录已失效
      showFailToast(res.msg);
      localStorage.removeItem("accessToken");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default http;
