import request from "@/utils/request";

export const getList = async (toUser, isGroup) => {
  return request.get(`/api/message/list?to_user=${toUser}&is_group=${isGroup}`);
};

//发送消息
export const send = async (data) => {
  return request.post("/api/message/send", data);
};

export const read = async (data) => {
  return request.put("/api/message/read", data);
};

export const getUnread = async () => {
  return request.get("/api/message/unread");
};
