import requestApi from "@/utils/requestApi";
import { AxiosPromise } from "axios";
import config from "@/config";
import { AxiosRequestConfig } from "axios";

// 获取当前币种的机器人列表
export const getRobotList = (params: any): AxiosPromise => {
  return requestApi({
    url: config.api.GET_CURRENT_BOT_LIST,
    method: "get",
    params,
  }as AxiosRequestConfig<any>);
};

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
  getRobotList,
  getCurRobotConfig,
  updateCurRobotStatus,
  addRobotConfig
}
