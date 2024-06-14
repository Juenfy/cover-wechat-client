import request from "@/utils/request";
//发送消息
export const send = async (data) => {
  return request.post("/api/messages/send", data);
};
