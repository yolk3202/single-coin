import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import config from "@/config";
import { AxiosRequestConfig } from "axios";
import {getCoinTypeList} from '@/api/coin/index'

// 获取订单列表
export function getOrderList(options: any): AxiosPromise {
  return requestApi({
    url: config.api.BI_SYSTEM_GET_ORDER,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}

export default {
  getCoinTypeList,
  getOrderList
}
