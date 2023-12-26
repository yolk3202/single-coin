// 时间戳转时间yyyy-MM-dd HH:mm:ss
export function timestampToTime(timestamp) {
  // 字符串转整数
  let time = parseInt(timestamp);
  if (time) {
    let date = new Date(time);
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
  } else {
    return "";
  }
}

export default {
  timestampToTime
}