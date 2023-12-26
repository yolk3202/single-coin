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
  let hasLogin = ref(false);

  // 注销
  function logout() {
    return new Promise<void>((resolve) => {
      resetStore();
      location.reload(); // 清空路由
      resolve();
    });
  }

  /** 清空缓存 */
  function resetStore() {
    // resetRouter();
    token.value = "";
    localStorage.removeItem("token");
    Object.assign(user, { roles: [], perms: [] });
  }

  function getUserInfo() {
    return new Promise((resolve, reject) => {
      getUserInfoApi({})
      .then((response) => {
        const {code, data} = response;
        if (code === 200) {
          Object.assign(user, { ...data });
          hasLogin.value = true;
          resolve(response);
        }else{
          reject(response)
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
          const { code, data } = res;
          if (code === 200) {
            localStorage.setItem('token', data.token);
            token.value = data.token;
            Object.assign(userInfo, { ...data.user });
            hasLogin.value = true;
            getUserInfo()
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
    hasLogin,
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
