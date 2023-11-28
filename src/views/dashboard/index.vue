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
  getPrice();
}
function selectCoinType() {
  getPrice();
}

function getCoinList() {
  getCoinTypeList().then((res) => {
    console.log(res);
    const { code, data, message } = res;
    coinList.value = data || [];
    data.includes("DOGEUSDT") ? queryParams.symbol = "DOGEUSDT" : queryParams.symbol = data[0];
    getPrice();
  });
}

function getPrice() {
  let option = {
    symbol: queryParams.symbol,
    date: queryParams.date
  }
  console.log('getPrice option ==>', option)
  // getCurCoinPrice(option).then((res) => {
  //   const { code, data, message } = res;
  //   code === 200? queryParams.radio = Number(data.last_price): queryParams.radio = 10
  //
  // });
  queryParams.radio = 100
  handleQuery();
}

async function handleQuery() {
  // 请求接口； todo
  let { date, symbol, radio } = queryParams;
  let options = {
    date,
    symbol,
    radio,
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
<!--        <el-form-item label="百分比" prop="status">-->
<!--          <el-input-number v-model="queryParams.radio" size="large" />-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Echarts 图表 -->
    <el-row :gutter="40">
      <el-col :sm="24" :lg="24" class="mb-2">
        <DragChart
          id="DragChart"
          height="500px"
          width="100%"
          :max="queryParams.radio * 10"
          :date="queryParams.date"
          :radio="queryParams.radio"
          :symbol="queryParams.symbol"
          class="bg-[var(--el-bg-color-overlay)]"
        />
      </el-col>

    </el-row>

    <!-- K 线图 -->
    <el-row :gutter="40">
      <el-col :sm="24" :lg="24" class="mb-2">
        <CandleChart
          id="CandleChart"
          height="300px"
          width="100%"
          :max="queryParams.radio * 10"
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
