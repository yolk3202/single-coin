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

// 获取货币列表
export function getCoinList(): AxiosPromise {
  return requestApi({
    url: config.api.GET_COIN_LIST,
    method: "get",
  } as AxiosRequestConfig<any>);
}

// 获取币对列表
export function getCoinPairList(): AxiosPromise {
  return requestApi({
    url: config.api.GET_COIN_PAIR_LIST,
    method: "get",
  } as AxiosRequestConfig<any>);
}
// 新增币对
export function addCoinPair(options: any): AxiosPromise {
  return requestApi({
    url: config.api.ADD_COIN_PAIR,
    method: "post",
    data: options,
  } as AxiosRequestConfig<any>);
}

// 修改币对
export function updateCoinPair(options: any): AxiosPromise {
  return requestApi({
    url: config.api.ADD_COIN_PAIR,
    method: "put",
    data: options,
  } as AxiosRequestConfig<any>);
}

// 删除币对
export function deleteCoinPair(options: any): AxiosPromise {
  return requestApi({
    url: config.api.ADD_COIN_PAIR,
    method: "delete",
    data: options,
  } as AxiosRequestConfig<any>);
}


// 获取账号列表
export function getAccountList(): AxiosPromise {
  return requestApi({
    url: config.api.GET_ACCOUNT_LIST,
    method: "get",
  } as AxiosRequestConfig<any>);
}

export default {
  getCoinDataApi,
  sendCoinDataApi,
  getCoinTypeList,
  getCurCoinPrice,
  getCoinList,
  getCoinPairList,
  addCoinPair,
  updateCoinPair,
  deleteCoinPair,
  getAccountList,
}