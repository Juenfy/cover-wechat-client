import request from "@/utils/request";
//好友列表
export const getList = async (type = 'all') => {
  return await request.get(`/api/friend/list?type=${type}`);
};

//朋友申请列表
export const getApplyList = async () => {
  return await request.get("/api/friend/apply-list");
};

//删除好友申请
export const deleteApply = async (id) => {
  return await request.delete(`/api/friend/delete-apply/${id}`);
};

//查找好友
export const getSearchList = async (keywords) => {
  return await request.get(`/api/friend/search/${keywords}`);
};

//申请好友确认界面
export const showConfirm = async (data) => {
  return await request.post("/api/friend/show-confirm", data);
};

//发送好友申请
export const postApply = async (data) => {
  return await request.post("/api/friend/apply", data);
};

//通过好友验证
export const postVerify = async (data) => {
  return await request.post("/api/friend/verify", data);
};

//更新好友
export const putUpdate = async (data) => {
  return await request.put("/api/friend/update", data);
};
