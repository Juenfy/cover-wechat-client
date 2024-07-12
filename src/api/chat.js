import request from "@/utils/request";
//发送消息
export const getList = async () => {
  return await request.get("/api/chat/list");
};

export const getInfo = async (toUser, isGroup) => {
  return await request.get(
    `/api/chat/info?to_user=${toUser}&is_group=${isGroup}`
  );
};

export const putHide = async (data) => {
  return await request.put("/api/chat/hide", data);
};

export const putTop = async (data) => {
  return await request.put("/api/chat/top", data);
};

export const putUpdate = async (data) => {
  return await request.put("/api/chat/update", data);
};

export const putDelete = async (data) => {
  return await request.put("/api/chat/delete", data);
};
