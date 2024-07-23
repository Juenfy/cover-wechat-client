import request from "@/utils/request";

//创建群聊或邀请好友进群
export const postAction = async (data) => {
  return await request.post("/api/group/action", data);
};

export const getList = async () => {
  return await request.get("/api/group/list");
};
