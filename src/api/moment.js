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
export const getList = async () => {
    return await request.get("/api/moment/list");
};