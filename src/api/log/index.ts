import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import config from "@/config";
import { AxiosRequestConfig } from "axios";

// 获取日志列表
export const getLogList = (params: any): AxiosPromise => {
  return requestApi({
    url: config.api.GET_LOG_LIST,
    method: "get",
    params,
  }as AxiosRequestConfig<any>);
};

// 获取日志详情
export const getLogDetail = (params: any): AxiosPromise => {
  return requestApi({
    url: config.api.GET_LOG_DETAIL,
    method: "get",
    params,
  }as AxiosRequestConfig<any>);
};

export default {
  getLogList,
  getLogDetail
}
