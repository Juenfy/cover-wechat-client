import request from "@/utils/request";

//获取聊天记录
export const getList = async (toUser, isGroup) => {
  return await request.get(
    `/api/message/list?to_user=${toUser}&is_group=${isGroup}`
  );
};

//发送消息
export const send = async (data) => {
  return await request.post("/api/message/send", data);
};

//标记已读消息
export const read = async (data) => {
  return await request.put("/api/message/read", data);
};

//获取未读消息数
export const getUnread = async () => {
  return await request.get("/api/message/unread");
};

//清空聊天记录
export const clear = async (data) => {
  return await request.put("/api/message/clear", data);
}