import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from "axios";
import config from "@/config";
console.log('...config', config)

// 创建 axios 实例
const service = axios.create({
  baseURL: config.baseUrl,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("请求拦截器");
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
    console.log("all response ==>", response);
    const { code, message } = response.data;
    if (code === 200) {
      console.log("200 response ==>", response);
      return response.data;
    }
    if (code === 404) {
      console.log("404 response ==>", response);
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
  reqConfig.params =reqConfig.params&& dealWidthParams(reqConfig.params);
  return service(reqConfig);
}
