import request from "@/utils/request";
//好友列表
export const getList = async () => {
  return request.get("/api/friends/list");
};

//朋友申请列表
export const getApplyList = async () => {
  return request.get("/api/friends/apply-list");
};

//删除好友申请
export const deleteApply = async (id) => {
  return request.delete(`/api/friends/delete-apply/${id}`);
};

//查找好友
export const getSearchList = async (keywords) => {
  return request.get(`/api/friends/search/${keywords}`);
};

//申请好友确认界面
export const showConfirm = async (data) => {
  return request.post("/api/friends/show-confirm", data);
};

//发送好友申请
export const postApply = async (data) => {
  return request.post("/api/friends/apply", data);
};

//通过好友验证
export const postVerify = async (data) => {
  return request.post("/api/friends/verify", data);
};

//更新好友
export const putUpdate = async (data) => {
  return request.put("/api/friends/update", data);
};
