import axios from "axios";

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
  (response) => {
    const res = response.data;
    if ([401200, 400006].indexOf(res.code) != -1) {
      location.href = "/login?logout=1";
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default http;
