import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import { CoinDataOptionType,CurCoinPriceType } from "./types";
/**
 * 拉取两个 线图 数据
 */
export function getCoinDataApi(options: CoinDataOptionType): AxiosPromise {
  return requestApi({
    // url: "/m1/3538235-0-default/test_get_lines",
    // url: "/m1/3538235-0-default/fetch_ohlcv",
    url: "/api/fetch_ohlcv",
    method: "get",
    params: options,
  });
}

/**
 * 提交数据
 */
export function sendCoinDataApi(options: any): AxiosPromise {
  return requestApi({
    // url: "/m1/3538235-0-default/test_generate_kline",
    // url: "/m1/3538235-0-default/create_ohlcv",
    url: "/api/create_ohlcv",
    method: "post",
    data: options,
  });
}

// 获取交易货币列表
export function getCoinTypeList(): AxiosPromise {
  return requestApi({
    url: "/api/get_exchange_info",
    method: "get",
  });
}
// 获取当前交易货币价格
export function getCurCoinPrice(options: CurCoinPriceType): AxiosPromise {
  return requestApi({
    url: "/api/get_last_price",
    method: "get",
    params: options,
  });
}
