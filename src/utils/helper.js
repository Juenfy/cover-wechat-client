import { showFailToast, showSuccessToast } from "vant";

//封装响应
export const handleResponse = (res, cb, router, showSucces = false) => {
  console.log(res);
  if (res.code != 200001) {
    showFailToast(res.msg);
    router.go(-1);
    return false;
  }
  if (showSucces) showSuccessToast(res.msg);
  cb();
};

export const timestampFormat = (timestamp, hi = false) => {
  function zeroize(num) {
    return (String(num).length == 1 ? "0" : "") + num;
  }

  let curTimestamp = parseInt(Date.now() / 1000); //当前时间戳
  let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  let curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  let tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

  let Y = tmDate.getFullYear(),
    m = tmDate.getMonth() + 1,
    d = tmDate.getDate();
  let H = tmDate.getHours(),
    i = tmDate.getMinutes(),
    s = tmDate.getSeconds();

  if (timestampDiff < 60) {
    // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) {
    // 一小时前之内
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (
    curDate.getFullYear() == Y &&
    curDate.getMonth() + 1 == m &&
    curDate.getDate() == d
  ) {
    return zeroize(H) + ":" + zeroize(i);
  } else {
    let newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (
      newDate.getFullYear() == Y &&
      newDate.getMonth() + 1 == m &&
      newDate.getDate() == d
    ) {
      return "昨天 " + zeroize(H) + ":" + zeroize(i);
    } else if (curDate.getFullYear() == Y) {
      return m + "月" + d + "日" + (hi ? zeroize(H) + ":" + zeroize(i) : '');
    } else {
      return Y + "年" + m + "月" + d + "日" + (hi ? zeroize(H) + ":" + zeroize(i) : '');
    }
  }
};

export const timestampFormatMoment = (timestamp) => {
  function zeroize(num) {
    return (String(num).length == 1 ? "0" : "") + num;
  }

  let curTimestamp = parseInt(Date.now() / 1000); //当前时间戳
  let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

  let tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

  let m = tmDate.getMonth() + 1,
    d = tmDate.getDate();

  if (timestampDiff < 86400)
    return "<b class='day' style='font-size:20px'>今天</b>";
  if (timestampDiff < 86400 * 2)
    return "<b class='day' style='font-size:20px'>昨天</b>";
  if (timestampDiff < 86400 * 3)
    return "<b class='day' style='font-size:20px'>前天</b>";
  return "<b class='day' style='font-size:20px'>" + zeroize(d) + "</b> " + m + "月";
};
