import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import { CoinDataOption } from "./types";
/**
 * 拉取两个 线图 数据
 */
export function getCoinDataApi(options: CoinDataOption): AxiosPromise {
  return requestApi({
    url: "/m1/3538235-0-default/fetch_ohlcv",
    // url: "/api/fetch_ohlcv",
    method: "get",
    params: options,
  });
}
/**
 * 拉去k线图数据
 */
export function getKlineDataApi(options: CoinDataOption): AxiosPromise {
  return requestApi({
    url: "/m1/3538235-0-default/fetch_kline",
    // url: "/api/fetch_kline",
    method: "get",
    params: options,
  });
}
/**
 * 提交数据
 */
export function sendCoinDataApi(options: any): AxiosPromise {
  return requestApi({
    url: "/m1/3538235-0-default/create_ohlcv",
    // url: "/api/create_ohlcv",
    method: "post",
    data: options,
  });
}
