import request from "@/utils/request";
//获取验证码
export const getCodeApi = async (data) => {
  return await request.post("/api/system/captcha/get", data);
};

//验证码校验
export const reqCheckApi = async (data) => {
  return await request.post("/api/system/captcha/check", data);
};
