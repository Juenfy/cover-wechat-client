import request from "@/utils/request";

//发布朋友圈
export const publish = async (data, onUploadProgress) => {
    return await request.post("/api/moment/publish", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: onUploadProgress,
        timeout: 300000,
    });
};
//获取朋友圈列表
export const getList = async (page, limit) => {
    return await request.get(`/api/moment/list?page=${page}&limit=${limit}`);
};
//获取朋友圈详情
export const getDetail = async (id) => {
    return await request.get(`/api/moment/detail?id=${id}`);
}

//获取点赞、评论消息列表
export const getMessageList = async (page, limit) => {
    return await request.get(`/api/moment/message?page=${page}&limit=${limit}`);
};
//点赞朋友圈
export const like = async (id) => {
    return await request.post('/api/moment/like', { id: id });
};
//取消点赞
export const unlike = async (id) => {
    return await request.delete(`/api/moment/unlike?id=${id}`);
};
//评论
export const comment = async (data) => {
    return await request.post('/api/moment/comment', data);
};
//删除朋友圈
export const del = async (id) => {
    return await request.delete(`/api/moment/delete?id=${id}`);
};