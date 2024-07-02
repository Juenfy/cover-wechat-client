import request from "@/utils/request";

//创建群聊
export const postCreate = async (data) => {
  return request.post("/api/group/create", data);
};

export const getList = async () => {
  return request.get("/api/group/list");
};
