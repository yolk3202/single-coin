import requestApi from "@/utils/requestApi";
import { AxiosPromise, AxiosRequestConfig } from "axios";
import config from "@/config";

// 获取交易所跟单配置列表
export function getExchangeConfigList(options: any): AxiosPromise {
  return requestApi({
    url: config.api.GET_EXCHANGE_FOLLOW_LIST,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}
// 新增交易所跟单配置
export function addExchangeConfig(options: any): AxiosPromise {
  return requestApi({
    url: config.api.UPDATE_EXCHANGE_FOLLOW,
    method: "post",
    data: options,
  } as AxiosRequestConfig<any>);
}
// 修改交易所跟单配置
export function updateExchangeConfig(options: any): AxiosPromise {
  return requestApi({
    url: config.api.UPDATE_EXCHANGE_FOLLOW,
    method: "put",
    data: options,
  } as AxiosRequestConfig<any>);
}
// 删除交易所跟单配置
export function deleteExchangeConfig(options: any): AxiosPromise {
  return requestApi({
    url: config.api.UPDATE_EXCHANGE_FOLLOW,
    method: "delete",
    data: options,
  } as AxiosRequestConfig<any>);
}

export default {
  getExchangeConfigList,
  addExchangeConfig,
  updateExchangeConfig,
  deleteExchangeConfig,
};
