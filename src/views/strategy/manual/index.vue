<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { useTransition, TransitionPresets } from "@vueuse/core";
import { formatDateToYMD } from "@/utils/utils";
import { getCoinPairList } from "@/api/coin";

import { useCoinStore } from "@/store/modules/coin";
const coinStore = useCoinStore();

defineOptions({
  // eslint-disable-next-line
  name: "Manual",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const queryParams = reactive({
  date: "",
  symbol: "",
  radio: 0,
  utcTime: "",
  chinaTime: "",
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
  getCoinPairList().then((res) => {
    const { code, data, message } = res;
    if(code === 200){
      coinList.value = data || [];
      const hasSymbol = data.some((item: any) => {
        return item.symbol === "BTKUSDT";
      });
      if (hasSymbol) {
        queryParams.symbol = "BTKUSDT";
      } else {
        queryParams.symbol = data[0].symbol;
      }
    }
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

const generateUtcTime = async () => {
  while (true) {
    const now = new Date();
    // 获取UTC时间
    var op = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    }
    queryParams.utcTime = now.toLocaleString('en-US', op);

    // 获取中国时间（北京时区为东八区）
    const chinaTimezoneOffset = 8 * 60;
    const chinaTime = new Date(now.getTime() + chinaTimezoneOffset * 60 * 1000);
    queryParams.chinaTime = chinaTime.toLocaleString('en-US', op);
    // 等待 1 秒
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};


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
  generateUtcTime();
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
        <h1>图表中 X 轴为 UTC 时间</h1>
        <p>UTC 时间: {{queryParams.utcTime }}</p>
        <p>中国时间: {{ queryParams.chinaTime }}</p>
        <el-form-item label="UTC日期" prop="keywords">
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
              :key="item.symbol"
              :value="item.symbol"
              :label="item.symbol"
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
          :max="queryParams.radio * 2"
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
          :max="queryParams.radio * 2"
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
