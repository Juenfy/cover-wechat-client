import request from "@/utils/request";
//获取聊天列表
export const getList = async () => {
  return await request.get("/api/chat/list");
};
//获取聊天信息
export const getInfo = async (toUser, isGroup) => {
  return await request.get(
    `/api/chat/info?to_user=${toUser}&is_group=${isGroup}`
  );
};
//不显示聊天
export const putHide = async (data) => {
  return await request.put("/api/chat/hide", data);
};
//置顶聊天
export const putTop = async (data) => {
  return await request.put("/api/chat/top", data);
};
//更新聊天信息
export const putUpdate = async (data) => {
  return await request.put("/api/chat/update", data);
};
//删除聊天
export const putDelete = async (data) => {
  return await request.put("/api/chat/delete", data);
};
