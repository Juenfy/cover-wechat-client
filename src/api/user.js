import request from "@/utils/request";
//注册
export const postRegister = async (data) => {
  return request.post("/api/users/register", data);
};

//登录
export const postLogin = async (data) => {
  return request.post("/api/users/login", data);
};

//退出登录
export const postLogout = async () => {
  return request.post("/api/users/logout");
};

//用户主页
export const getHomeInfo = async (keywords) => {
  return request.get(`/api/users/${keywords}/home`);
};
