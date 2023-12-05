import { defineStore } from "pinia";

import { loginApi, logoutApi, getUserInfoApi, loginWithAccountApi } from "@/api/auth";
import { getUserInfo } from "@/api/user";
import { resetRouter } from "@/router";
import { store } from "@/store";

import { LoginData } from "@/api/auth/types";
import { UserInfo } from "@/api/user/types";

import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", () => {
  const user: UserInfo = {
    roles: [],
    perms: [],
  };
  const userInfo: Object = {}
  const token = useStorage("accessToken", "");


  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetStore();
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** 清空缓存 */
  function resetStore() {
    resetRouter();
    token.value = "";
    Object.assign(user, { roles: [], perms: [] });
  }

  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfoApi({})
      .then((response) => {
        const { code, data } = response.data;
        if (code === 200) {
          Object.assign(user, { ...data });
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      })
    });
  }

  function loginWithCount(options: any) {
    return new Promise<any>((resolve, reject) => {
      loginWithAccountApi(options)
        .then((res)=>{
          console.log('res===>', res)
          const { code, data } = res;
          if (code === 200) {
            localStorage.setItem('token', data.token);
            token.value = data.token;
            Object.assign(userInfo, { ...data.user });
            resolve(res);
          }
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  return {
    token,
    user,
    logout,
    resetStore,
    getUserInfo,
    loginWithCount
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
