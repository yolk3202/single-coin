import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 获取表类型的数据项
 *
 * @param eline 线上各点的数据集合
 */
export function getLineOptions(eline: string): AxiosPromise<OptionType[]> {
  return request({
    url: "/api/v1/line/" + eline + "/options",
    method: "get",
  });
}
