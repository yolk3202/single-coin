import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from "axios";
import config from "@/config";
// console.log('...config', config)

// 创建 axios 实例
const service = axios.create({
  baseURL: config.baseUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
// 框架
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log("all response ==>", response);
    const { code, message } = response.data;
    if (code === 200) {
      // console.log("200 response ==>", response);
      return response.data;
    }
    if (code === 404) {
      console.log("404 response ==>", response);
      return response.data;
    }
    if(code === 401){
      console.log("401 response ==>", response);
      if(message === 'Token is invalid'){
        // 关注其他api接口 是否要做token校验
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          localStorage.clear();
          window.location.href = "/";
        });
        return response.data;
      }
      return response.data;
    }
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response;
    }

    ElMessage.error(message || "系统出错");
    return Promise.reject(new Error(message || "Error"));
  },
  (error: any) => {
    const {message, response} = error;
    const {status, config:{url}} = response;
    if(status >= 500){
      ElMessage.error(`服务器错误，请联系开发人员! message: ${message}`)
      return Promise.reject(error.message);
    }
    if(status >= 400){
      ElMessage.error(`接口不存在，请联系开发人员! 接口: ${url}`)
      return Promise.reject(error.message);
    }
    // 超时
    if (error.code === 'ECONNABORTED') {
      // 如果错误是由于超时引起的，显示一个提示
      ElMessage.error('接口超时，请刷新页面或者重新请求')
    }
    // 内部约定
    if (error.response.data) {
      const { code, message } = error.response.data;
      // token 过期,重新登录
      if (code === "A0230") {
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          localStorage.clear();
          window.location.href = "/";
        });
      } else {
        ElMessage.error(message || "系统出错");
      }
    }
    return Promise.reject(error.message);
  }
);

function dealWidthParams(data: { [key: string]: any } | null | undefined) {
  let config =  data && data.value ? data.value : data;
  for (let key in config) {
    if (
      config[key] === "" ||
      config[key] === null ||
      config[key] === undefined ||
      (Array.isArray(config[key]) && !config[key].length)
    ) {
      delete config[key];
    }
  }
  return config;
}
// 导出 axios 实例
export default function (reqConfig: AxiosRequestConfig<any>) {
  reqConfig.data =reqConfig.data && dealWidthParams(reqConfig.data);
  // reqConfig.params =reqConfig.params&& dealWidthParams(reqConfig.params);
  const token = localStorage.getItem('token');
  // 判断当前接口是否需要 添加自定义头部
  if(!config.noTokenList.includes(reqConfig.url as string)){
    reqConfig.headers = { ...reqConfig.headers, Authorization: token }
  }
  return service(reqConfig);
}
