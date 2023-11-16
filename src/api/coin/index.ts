import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import { CoinDataOption } from "./types";
/**
 * 拉取数据
 */
export function getCoinDataApi(options: CoinDataOption): AxiosPromise {
  return requestApi({
    url: "/m1/3538235-0-default/get_line_kline",
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
    method: "post",
    data: options,
  });
}
