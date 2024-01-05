<script setup>
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});
</script>
<template>
  <div class="app-container">
    <div style="text-align: center">
      <h1>您好，欢迎来到《市值管理工具》平台</h1>
      <p>
        本页内容搬迁至
        <el-button type="primary" link>
          <router-link to="/startegy/manual">跟盘策略->手动画线</router-link>
        </el-button>
      </p>
    </div>
  </div>
</template>
