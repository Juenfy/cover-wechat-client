import request from "@/utils/request";

//创建群聊
export const postCreate = async (data) => {
  return await request.post("/api/group/create", data);
};

export const getList = async () => {
  return await request.get("/api/group/list");
};
