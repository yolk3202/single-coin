import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import config from "@/config";
import { AxiosRequestConfig } from "axios";
import {getCoinTypeList} from '@/api/coin/index'

// 获取当前机器人的配置
export function getCurRobotConfig(options: any): AxiosPromise{
  return requestApi({
    url: config.api.ROBOT_ADMIN_GET_CONFIG,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
  
}

// 修改当前机器人的状态
export function updateCurRobotStatus(options: any): AxiosPromise{
  return requestApi({
    url: config.api.ROBOT_ADMIN_SWITCH,
    method: "post",
    data: options,
  } as AxiosRequestConfig<any>);
}

// 新增机器人配置
export function addRobotConfig(options: any): AxiosPromise{
  return requestApi({
    url: config.api.ADD_ROBOT_CONFIG,
    method: "post",
    data: options,
  } as AxiosRequestConfig<any>);
}

export default {
  getCoinTypeList,
  getCurRobotConfig,
  updateCurRobotStatus,
  addRobotConfig
}
