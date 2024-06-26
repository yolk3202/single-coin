<template>
  <div class="login-container">
    <!-- 顶部 -->
    <div class="absolute top-0 flex items-center justify-end px-5 h-20 w-full">
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="IconEpMoon"
        :inactive-icon="IconEpSunny"
        active-color="var(--el-fill-color-dark)"
        inactive-color="var(--el-color-primary)"
        @change="handleThemeChange"
      />
      <lang-select class="ml-2 cursor-pointer" />
    </div>
    <!-- 登录表单 -->
    <el-card
      class="z-1 !border-none w-100 !bg-transparent !rounded-4% <sm:w-83"
    >
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
        <el-tag class="ml-2 absolute top-0 right-0">{{
          defaultSettings.version
        }}</el-tag>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="phone_number">
          <div class="p-2">
            <svg-icon icon-class="user" />
          </div>
          <el-input
            ref="username"
            v-model="loginData.phone_number"
            class="flex-1"
            size="large"
            :placeholder="$t('login.phone_number')"
            name="username"
          />
        </el-form-item>

        <el-tooltip
          :disabled="isCapslock === false"
          content="Caps lock is On"
          placement="right"
        >
          <el-form-item prop="password">
            <span class="p-2">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              v-model="loginData.password"
              class="flex-1"
              :placeholder="$t('login.password')"
              :type="passwordVisible === false ? 'password' : 'input'"
              size="large"
              name="password"
              @keyup="checkCapslock"
              @keyup.enter="handleLogin"
            />
            <span class="mr-2" @click="passwordVisible = !passwordVisible">
              <svg-icon
                :icon-class="passwordVisible === false ? 'eye' : 'eye-open'"
                class="cursor-pointer"
              />
            </span>
          </el-form-item>
        </el-tooltip>

        <!-- 验证码 -->
        <!-- <el-form-item prop="verifyCode">
          <span class="p-2">
            <svg-icon icon-class="verify-code" />
          </span>

          <el-input
            v-model="loginData.verifyCode"
            auto-complete="off"
            :placeholder="$t('login.verifyCode')"
            class="w-[60%]"
            @keyup.enter="handleLogin"
          />

          <div class="captcha">
            <el-image
              :src="captchaBase64"
              @click="getCaptcha"
              class="w-[120px] h-[48px] cursor-pointer"
            >
              <template #error>
                <div class="image-slot">
                  <i-ep-picture />
                </div>
              </template>
            </el-image>
          </div>
        </el-form-item> -->

        <el-button
          :loading="loading"
          type="primary"
          class="w-full"
          @click.prevent="handleLogin"
          >{{ $t("login.login") }}
        </el-button>

        <!--
          <div class="register-line">
          <el-button
            type="primary"
            class="register-btn"
            @click.prevent="handleRegister"
            >{{ $t("login.register") }}
          </el-button>
        </div>
        -->
        
      </el-form>
    </el-card>

    <!-- ICP备案 -->
    <!-- <div class="absolute bottom-1 text-[10px] text-center">
      <p>Copyright © 2023 xinrui All Rights Reserved. 新锐科技 版权所有</p>
      <p>ICP备案号:xxx</p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "@/router";
import LangSelect from "@/components/LangSelect/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import IconEpSunny from "~icons/ep/sunny";
import IconEpMoon from "~icons/ep/moon";
import { useSettingsStore } from "@/store/modules/settings";

// 状态管理依赖
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";

// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { getCaptchaApi } from "@/api/auth";
import { LoginData } from "@/api/auth/types";
import defaultSettings from "@/settings";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const route = useRoute();

const isDark = ref<boolean>(settingsStore.theme === "dark");

function handleThemeChange(isDark: boolean) {
  console.log("登录页面主题切换", isDark);
  useToggle(isDark);
  settingsStore.changeSetting({
    key: "theme",
    value: isDark ? "dark" : "light",
  });
}

/**
 * 按钮loading
 */
const loading = ref(false);
/**
 * 是否大写锁定
 */
const isCapslock = ref(false);
/**
 * 密码是否可见
 */
const passwordVisible = ref(false);
/**
 * 验证码图片Base64字符串
 */
const captchaBase64 = ref();

/**
 * 登录表单引用
 */
const loginFormRef = ref(ElForm);

const loginData = ref<LoginData>({
  phone_number: "",
  password: "",
});

const { t } = useI18n();

const loginRules = computed(() => {
  const prefix = appStore.language === "en" ? "Please enter " : "请输入";
  return {
    phone_number: [
      {
        required: true,
        trigger: "blur",
        message: `${prefix}${t("login.phone_number")}`,
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        validator: passwordValidator,
        message: `${prefix}${t("login.password")}`,
      },
    ],
  };
});

/**
 * 密码校验器
 */
function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error("The password can not be less than 6 digits"));
  } else {
    callback();
  }
}

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

/**
 * 获取验证码
 */
function getCaptcha() {
  getCaptchaApi().then(({ data }) => {
    const { captchaImgBase64, verifyCodeKey } = data;
    loginData.value.verifyCodeKey = verifyCodeKey;
    captchaBase64.value = captchaImgBase64;
  });
}

/**
 * 登录
 */
 function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .loginWithCount(loginData.value)
        .then((res) => {
          const {code, data} = res
          if (code === 200) {
            // 登录成功
            ElMessage({
              message: "登录成功～",
              type: "success",
            });
            gotoRoute()
          }
        })
        .catch(() => {
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}
function gotoRoute() {
  const query: LocationQuery = route.query;

  const redirect = (query.redirect as LocationQueryValue) ?? "/";

  const otherQueryParams = Object.keys(query).reduce(
    (acc: any, cur: string) => {
      if (cur !== "redirect") {
        acc[cur] = query[cur];
      }
      return acc;
    },
    {}
  );

  router.push({ path: redirect, query: otherQueryParams });
}
function handleRegister() {
  router.push({ path: "/register" });
}

onMounted(() => {
  // 主题初始化
  const theme = useSettingsStore().theme;
  useSettingsStore().changeSetting({ key: "theme", value: theme });
  if (theme == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});
</script>

<style lang="scss" scoped>
.dark .login-container {
  background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;
}

.login-container {
  @apply w-full h-full flex-center;

  overflow-y: auto;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;

  .login-form {
    padding: 30px 10px;

    .captcha {
      position: absolute;
      top: 0;
      right: 0;

      .image-slot {
        display: flex;
        align-items: center;
        justify-content: right;
        width: 100%;
        height: 100%;
        font-size: 18px;
        color: var(--el-text-color-secondary);
        background: var(--el-fill-color-light);

        svg {
          margin-right: 10px;
        }
      }
    }
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      transition: background-color 5000s ease-in-out 0s; /* 通过延时渲染背景色变相去除背景颜色 */
    }
  }
}
.register-line{
  margin-top:18px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
