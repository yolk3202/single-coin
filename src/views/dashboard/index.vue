<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { useTransition, TransitionPresets } from "@vueuse/core";
import { formatDateToYMD } from "@/utils/utils";
import { getCoinTypeList, getCurCoinPrice } from "@/api/coin";

import { useCoinStore } from "@/store/modules/coin";
const coinStore = useCoinStore();

defineOptions({
  // eslint-disable-next-line
  name: "Dashboard",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const queryParams = reactive({
  date: "",
  symbol: "",
  radio: 0,
});
let coinList = ref([]); // 币种列表

function changeDate(val: any) {
  console.log(val);
  // 请求接口； todo
}
function selectCoinType() {
  getPrice();
}

// demo
function demoApi() {
  return new Promise((resolve, reject) => {
    const list = [
      { name: "ETH/USDT", initPrice: 1000 },
      { name: "ETH/USDT1", initPrice: 200 },
      { name: "ETH/USDT2", initPrice: 100 },
    ];
    resolve(list);
  });
}

function getCoinList() {
  getCoinTypeList().then((res) => {
    console.log(res);
    const { code, data, message } = res;
    coinList.value = data || [];
    queryParams.symbol = data[0];
    handleQuery();
    getPrice();
  });
}
function getPrice() {
  getCurCoinPrice({ symbol: queryParams.symbol }).then((res) => {
    console.log('res', res)
    const { code, data, message } = res;
    queryParams.radio = data.last_price;
    
  });
}

async function handleQuery() {
  // 请求接口； todo
  let { date, symbol, radio } = queryParams;
  let options = {
    // date,
    // symbol,
    date: "2023-12-01",
    symbol: "ETH/USDT",
  };
  await coinStore.getCoinDataAction(options);
}

onMounted(() => {
  // 获取币种接口
  getCoinList();
  // 初始化时间
  queryParams.date = formatDateToYMD(new Date());
  
});
</script>

<template>
  <div class="dashboard-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="日期" prop="keywords">
          <el-date-picker
            v-model="queryParams.date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            @change="changeDate"
          />
        </el-form-item>
        <el-form-item label="币种" prop="status">
          <el-select
            v-model="queryParams.symbol"
            placeholder="选择币种"
            @change="selectCoinType"
            clearable
          >
            <el-option
              v-for="item in coinList"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="status">
          <el-input-number v-model="queryParams.radio" size="large" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- github角标 -->
    <!-- <github-corner class="github-corner" /> -->

    <!-- 用户信息 -->
    <!-- <el-row class="mb-8">
      <el-card class="w-full">
        <div class="flex justify-between flex-wrap">
          <div class="flex items-center">
            <img
              class="user-avatar"
              :src="userStore.user.avatar + '?imageView2/1/w/80/h/80'"
            />
            <span class="ml-[10px] text-[16px]">
              {{ userStore.user.nickname }}
            </span>
          </div>

          <div class="leading-[40px]">
            {{ greetings }}
          </div>

          <div class="space-x-2 flex items-center justify-end">
            <el-link
              target="_blank"
              type="danger"
              href="https://blog.csdn.net/u013737132/article/details/130191394"
              >💥官方从零到一文档</el-link
            >
            <el-divider direction="vertical" />
            <el-link
              target="_blank"
              type="success"
              href="https://gitee.com/youlaiorg"
              >Gitee</el-link
            >
            <el-divider direction="vertical" />
            <el-link
              target="_blank"
              type="primary"
              href="https://github.com/youlaitech"
              >GitHub
            </el-link>
          </div>
        </div>
      </el-card>
    </el-row> -->

    <!-- 数据卡片 -->
    <!-- <el-row :gutter="40" class="mb-4">
      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div class="p-3 rounded">
            <svg-icon icon-class="visit" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">访问数</div>
            <div class="text-lg text-right">
              {{ Math.round(visitCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>

      <!消息数-->
    <!-- <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div class="p-3 rounded">
            <svg-icon icon-class="message" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">消息数</div>
            <div class="text-lg text-right">
              {{ Math.round(messageCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
        <div class="data-box">
          <div class="p-3 rounded">
            <svg-icon icon-class="money" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">收入金额</div>
            <div class="text-lg text-right">
              {{ Math.round(amountOutput) }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="mb-2">
        <div class="data-box">
          <div class="p-3 rounded">
            <svg-icon icon-class="cart" size="3em" />
          </div>
          <div class="flex flex-col space-y-3">
            <div class="text-[var(--el-text-color-secondary)]">订单数</div>
            <div class="text-lg text-right">
              {{ Math.round(orderCountOutput) }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row> -->

    <!-- Echarts 图表 -->
    <el-row :gutter="40">
      <el-col :sm="24" :lg="24" class="mb-2">
        <DragChart
          id="DragChart"
          height="200px"
          width="100%"
          class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col>

      <!-- <el-col :xs="24" :sm="12" :lg="8" class="mb-2">
        <PieChart
          id="pieChart"
          height="400px"
          width="100%"
          class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col> -->

      <!-- <el-col :xs="24" :sm="12" :lg="8" class="mb-2">
        <RadarChart
          id="radarChart"
          height="400px"
          width="100%"
          class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col> -->
    </el-row>

    <!-- K 线图 -->
    <el-row :gutter="40">
      <el-col :sm="24" :lg="24" class="mb-2">
        <CandleChart
          id="CandleChart"
          height="200px"
          width="100%"
          class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }

  .data-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  .svg-icon {
    fill: currentcolor !important;
  }
}
</style>
