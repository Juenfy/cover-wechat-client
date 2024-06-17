import request from "@/utils/request";
//发送消息
export const getList = async () => {
  return request.get("/api/chat/list");
};
