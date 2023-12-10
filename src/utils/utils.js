export const awaitWrap = (promise) => {
  return promise
    .then(data => [null, data])
    .catch(err => [err, null])
}

export const formatDateToYMD = (date) => {
  // 获取年、月、日
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");

  // 构建 yyyy-mm-dd 字符串
  const dateString = `${year}-${month}-${day}`;
  return dateString;
};

