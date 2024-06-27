import request from "@/utils/request";
//发送消息
export const getList = async () => {
  return request.get("/api/chat/list");
};

export const getInfo = async (toUser, isGroup) => {
  return request.get(`/api/chat/info?to_user=${toUser}&is_group=${isGroup}`);
};
