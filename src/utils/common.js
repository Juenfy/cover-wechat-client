import { showFailToast, showSuccessToast } from "vant";

export const handleResponse = (res, cb, router, showSucces = false) => {
  console.log(res);
  if (res.code != 200001) {
    showFailToast(res.msg);
    router.go(-1);
    return false;
  }
  if (showSucces) showSuccessToast(res.msg);
  cb(res);
};
