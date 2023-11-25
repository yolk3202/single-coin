import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import { CoinDataOptionType,CurCoinPriceType } from "./types";
import config from "@/config";
import { AxiosRequestConfig } from "axios";
/**
 * 拉取两个 线图 数据
 */

export function getCoinDataApi(options: CoinDataOptionType): AxiosPromise {
  return requestApi({
    url: config.api.FETCH_OHLCV,
    method: "get",
    params: options,
  } as AxiosRequestConfig);
}

/**
 * 提交数据
 */
export function sendCoinDataApi(options: any): AxiosPromise {
  return requestApi({
    url: config.api.CREATE_OHLCV,
    method: "post",
    data: options,
  } as AxiosRequestConfig<any>);
}

// 获取交易货币列表
export function getCoinTypeList(): AxiosPromise {
  return requestApi({
    url: config.api.GET_EXCHANGE_INFO,
    method: "get",
  } as AxiosRequestConfig<any>);
}
// 获取当前交易货币价格
export function getCurCoinPrice(options: CurCoinPriceType): AxiosPromise {
  return requestApi({
    url: config.api.GET_NEW_PRICE,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}

export default {
  getCoinDataApi,
  sendCoinDataApi,
  getCoinTypeList,
  getCurCoinPrice
}