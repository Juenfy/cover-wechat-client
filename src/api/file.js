import request from "@/utils/request";

//文件上传
export const upload = async (data) => {
  return await request.post("/api/file/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadBase64 = async (data) => {
  return await request.post("/api/file/upload-base64", data);
};
