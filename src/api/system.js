import request from "@/utils/request";
//注册
export const getCodeApi = async (data) => {
  return request.post("/api/system/captcha/get", data);
};

//登录
export const reqCheckApi = async (data) => {
  return request.post("/api/system/captcha/check", data);
};
