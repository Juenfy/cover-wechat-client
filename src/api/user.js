import request from "@/utils/request";
//注册
export const postRegister = async (data) => {
  return await request.post("/api/user/register", data);
};

//登录
export const postLogin = async (data) => {
  return await request.post("/api/user/login", data);
};

//退出登录
export const postLogout = async () => {
  return await request.post("/api/user/logout");
};

//用户主页
export const getHomeInfo = async (keywords) => {
  return await request.get(`/api/user/${keywords}/home`);
};

//更新用户信息
export const putUpdate = async (data) => {
  return await request.put("/api/user/update", data);
};

//用户朋友圈
export const getMomentList = async (id, page, limit) => {
  return await request.get(`/api/user/moments?user_id=${id}&page=${page}&limit=${limit}`);
};