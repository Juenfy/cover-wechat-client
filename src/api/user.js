import request from "@/utils/request";
export const postRegister = async (data) => {
  return request.post("/api/users/register", data);
};

export const postLogin = async (data) => {
  return request.post("/api/users/login", data);
};

export const postLogout = async () => {
  return request.post("/api/users/logout");
};

export const getHomeInfo = async (id) => {
  return request.get(`/api/users/${id}/home`);
};
