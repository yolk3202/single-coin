import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

import requestApi from "@/utils/requestApi";
import config from "@/config";
import { AxiosRequestConfig } from "axios";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("verifyCodeKey", data.verifyCodeKey || "");
  formData.append("verifyCode", data.verifyCode || "");
  return request({
    url: "/api/v1/auth/login",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/api/v1/auth/logout",
    method: "delete",
  });
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: "/api/v1/auth/captcha",
    method: "get",
  });
}

// 使用账号登录
export function loginWithAccountApi(options: any): AxiosPromise {
  return requestApi({
    url: config.api.LOGIN,
    method: "post",
    data: options,
  } as AxiosRequestConfig<any>);
}
// 注册账号
export function registerAccountApi(options: any): AxiosPromise {
  return requestApi({
    url: config.api.REGISTER,
    method: "post",
    data: options,
  } as AxiosRequestConfig<any>);
}
// 获取用户信息
export function getUserInfoApi(options: any): AxiosPromise {
  return requestApi({
    url: config.api.GET_CURRENT_USER,
    method: "get",
    params: options,
  } as AxiosRequestConfig<any>);
}
