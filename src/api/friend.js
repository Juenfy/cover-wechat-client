import request from "@/utils/request";
export const getInfo = async (id) => {
  request.get(`/api/friend/info/${id}`);
};
