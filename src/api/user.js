import request from "@/utils/request";
//注册
export const postRegister = async (data) => {
  return request.post("/api/user/register", data);
};

//登录
export const postLogin = async (data) => {
  return request.post("/api/user/login", data);
};

//退出登录
export const postLogout = async () => {
  return request.post("/api/user/logout");
};

//用户主页
export const getHomeInfo = async (keywords) => {
  return request.get(`/api/user/${keywords}/home`);
};
