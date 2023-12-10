import router from "@/router";
import { useUserStoreHook } from "@/store/modules/user";
import { awaitWrap } from "@/utils/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false }); // 进度条

const permissionStore = usePermissionStoreHook();

// 白名单路由
const whiteList = ["/login", "/register"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else{
    const userStore = useUserStoreHook();
    if (userStore.token === "") {
      const [err, data] = await awaitWrap(userStore.getUserInfo());
      console.log('nihao===res', err, data)
      if (err || data.code !== 200) {
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
      if (data.code === 200) {
        if (to.path === "/login") {
          // 如果已登录，跳转首页
          next({ path: "/" });
          NProgress.done();
        } else {
          next();
        }
      }
    } else {
      next();
      NProgress.done();
    }
  }
  // if (to.path === "/login") {
  //   // 如果已登录，跳转首页
  //   next({ path: "/" });
  //   NProgress.done();
  // }else {
  //   next();
  // }
});

router.afterEach(() => {
  NProgress.done();
});
