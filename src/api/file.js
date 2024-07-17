import request from "@/utils/request";

//文件上传
export const upload = async (data, onUploadProgress) => {
  return await request.post("/api/file/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onUploadProgress,
    timeout: 300000,
  });
};

export const uploadBase64 = async (data) => {
  return await request.post("/api/file/upload-base64", data);
};
