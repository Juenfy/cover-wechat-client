import request from "@/utils/request";
export const getList = async () => {
  return request.get("/api/friends/list");
};

export const getApplyList = async () => {
  return request.get("/api/friends/apply-list");
};

export const deleteApply = async (id) => {
  return request.delete(`/api/friends/delete-apply/${id}`);
};

export const getSearchList = async (keywords) => {
  return request.get(`/api/friends/search/${keywords}`);
};

export const postApply = async (data) => {
  return request.post("/api/friends/apply", data);
};

export const postVerify = async (data) => {
  return request.post("/api/friends/verify", data);
};
