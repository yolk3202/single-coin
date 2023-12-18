import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import config from "@/config";
import { AxiosRequestConfig } from "axios";
import {getCoinTypeList,getCoinList} from '@/api/coin/index'

// 获取订单列表
export function getOrderList(options: any): AxiosPromise {
  return requestApi({
    url: config.api.BI_SYSTEM_GET_ORDER,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}
// 获取历史订单列表
export function getHistoryOrderList(options: any): AxiosPromise {
  return requestApi({
    url: config.api.GET_HISTORY_ORDER,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}

// 获取账号资产实时列表
export function getAccountAssetsList(options: any): AxiosPromise {
  return requestApi({
    url: config.api.GET_ACCOUNT_ASSETS,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}

// 获取账号资产历史列表
export function getAccountAssetsFlowList(options: any): AxiosPromise {
  return requestApi({
    url: config.api.GET_ACCOUNT_ASSETS_HISTORY,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}

export default {
  getCoinList,
  getCoinTypeList,
  getOrderList,
  getHistoryOrderList,
  getAccountAssetsList,
  getAccountAssetsFlowList,
}
