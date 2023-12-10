<script setup>
import { useI18n } from "vue-i18n";
import router from "@/router";
import LangSelect from "@/components/LangSelect/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import IconEpSunny from "~icons/ep/sunny";
import IconEpMoon from "~icons/ep/moon";
import { registerAccountApi } from "@/api/auth";
import { useSettingsStore } from "@/store/modules/settings";
// 状态管理依赖
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";

// API依赖
import { useRoute } from "vue-router";
import defaultSettings from "@/settings";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const route = useRoute();

const isDark = ref(settingsStore.theme === "dark");

function handleThemeChange(isDark) {
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
 * 登录表单引用
 */
const registerFormRef = ref(ElForm);

const registerData = ref({
  // 手机号
  phone_number: "",
  // 邮箱号
  email: "",
  // 昵称
  nick_name: "",
  // 密码
  password: "",
});

const { t } = useI18n();

const registerRules = computed(() => {
  const prefix = appStore.language === "en" ? "Please enter " : "请输入";
  return {
    phone_number: [
      {
        required: true,
        trigger: "blur",
        message: `${prefix}${t("register.phone_number")}`,
      },
    ],
    email: [
      {
        required: true,
        trigger: "blur",
        message: `${prefix}${t("register.email")}`,
      },
    ],
    nick_name: [
      {
        required: true,
        trigger: "blur",
        message: `${prefix}${t("register.nick_name")}`,
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        validator: passwordValidator,
        message: `${prefix}${t("register.password")}`,
      },
    ],

  };
});

/**
 * 密码校验器
 */
function passwordValidator(rule, value, callback) {
  if (value.length < 6) {
    callback(new Error("The password can not be less than 6 digits"));
  } else {
    callback();
  }
}

/**
 * 检查输入大小写状态
 */
function checkCapslock(e) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

/**
 * 注册
 */
function handleRegister() {
  registerFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      registerAccountApi(registerData.value)
        .then((res) => {
          const { code, data, message } = res;
          if (code !== 200) {
            ElMessage.error({
              message: message || "注册失败",
            });
            return;
          }
          ElMessage.success({
            message: "注册成功",
          });
          router.back()
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  })
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
<template>
  <div class="register-container">
    <div class="absolute top-0 flex items-center justify-end px-5 h-20 w-full">
      <el-switch v-model="isDark" inline-prompt :active-icon="IconEpMoon" :inactive-icon="IconEpSunny"
        active-color="var(--el-fill-color-dark)" inactive-color="var(--el-color-primary)" @change="handleThemeChange" />
      <lang-select class="ml-2 cursor-pointer" />
    </div>
    <el-card class="z-1 !border-none w-100 !bg-transparent !rounded-4% <sm:w-83">
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
        <el-tag class="ml-2 absolute top-0 right-0">{{
          defaultSettings.version
        }}</el-tag>
      </div>
      <el-form ref="registerFormRef" :model="registerData" :rules="registerRules" class="login-form">
        <el-form-item prop="phone_number">
          <div class="p-2">
            {{ $t("register.phone_number") }}
          </div>
          <el-input ref="username" v-model="registerData.phone_number" class="flex-1" size="large"
            :placeholder="$t('register.phone_number')" name="username" />
        </el-form-item>
        <el-form-item prop="email">
          <div class="p-2">
            {{ $t("register.email") }}
          </div>
          <el-input ref="username" v-model="registerData.email" class="flex-1" size="large"
            :placeholder="$t('register.email')" name="username" />
        </el-form-item>
        <el-form-item prop="nick_name">
          <div class="p-2">
            {{ $t("register.nick_name") }}
          </div>
          <el-input ref="username" v-model="registerData.nick_name" class="flex-1" size="large"
            :placeholder="$t('register.nick_name')" name="username" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="p-2">
            {{ $t("register.password") }}
          </span>
          <el-input v-model="registerData.password" class="flex-1" :placeholder="$t('register.password')"
            :type="passwordVisible === false ? 'password' : 'input'" size="large" name="password" @keyup="checkCapslock"
            @keyup.enter="handleRegister" />
          <span class="mr-2" @click="passwordVisible = !passwordVisible">
            <svg-icon :icon-class="passwordVisible === false ? 'eye' : 'eye-open'" class="cursor-pointer" />
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" class="w-full" @click.prevent="handleRegister">{{
          $t("register.submit_btn") }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.dark .register-container {
  background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;
}

.register-container {
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
      transition: background-color 5000s ease-in-out 0s;
      /* 通过延时渲染背景色变相去除背景颜色 */
    }
  }
}

.register-line {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>