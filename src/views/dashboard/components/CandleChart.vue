<!-- 蜡烛图 / K 线图 -->
<template>
  <el-card>
    <template #header> K 线图 </template>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { getCoinDataApi, sendCoinDataApi } from "@/api/coin";
import { storeToRefs } from "pinia";
import { useCoinStore } from "@/store/modules/coin";
const coinStore = useCoinStore();
const { coinKline } = storeToRefs(coinStore);

const props = defineProps({
  id: {
    type: String,
    default: "CandleChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});

const option = {
  xAxis: {
    data: ['0', '1', '2', '3', '4', '5', '6', '7'],
  },
  yAxis: {
    min: 0,
    max: 10,
    type: "value",
    axisLine: { onZero: true },
  },
  series: [
    {
      type: "candlestick",
      data: [
              [6.9, 74.2, 80.0, 11.7], 
              [70.5, 79.3, 99.8, 71.2], 
              [59.0, 96.1, 97.7, 7.3], 
              [28.3, 15.8, 34.4, 39.8], 
              [98.8, 11.2, 1.6, 15.7], 
              [4.4, 72.5, 54.9, 5.2] 
            ],
    },
  ],
  dataZoom: [
    {
      type: "slider",
      xAxisIndex: 0,
      filterMode: "none",
    },
    {
      type: "slider",
      yAxisIndex: 0,
      filterMode: "none",
    },
    {
      type: "inside",
      xAxisIndex: 0,
      filterMode: "none",
    },
    {
      type: "inside",
      yAxisIndex: 0,
      filterMode: "none",
    },
  ],
};

function formatDateToYMD(date: Date) {
  // 获取年、月、日
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");

  // 构建 yyyy-mm-dd 字符串
  const dateString = `${year}-${month}-${day}`;
  return dateString;
};

// 拉取数据
function getCoinData() {
  return new Promise((resolve, reject) => {
    let options = {
      // date: formatDateToYMD(new Date()),
      date:'2023-11-16',
    };
    getCoinDataApi(options)
      .then((res) => {
        console.log("kline res", res.data.kline);
        resolve(res.data.kline); // 使用resolve返回获取到的结果
      })
      .catch((err) => {
        console.log("err", err);
        reject(err); // 使用reject返回错误信息
      });
  });
};

onMounted(() => {
  const myChart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );

  getCoinData()
  .then((kline: any) => {
    if (Array.isArray(option.series)) {
      option.xAxis.data = kline.x;
      option.series[0].data = kline.data;
      console.log('==> kline option data 内层', option.series[0].data);
      console.log('==> kline option', option);
      myChart.setOption(option);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    };
  });

  watch(coinKline, ()=>{
    console.log('提交 kline', coinKline.value);
    let curKData = JSON.parse(JSON.stringify(coinKline.value));
    if (Array.isArray(option.series)) {
      option.xAxis.data = curKData.x;
      option.series[0].data = curKData.data;
      console.log('==> kline option data 内层', option.series[0].data);
      console.log('==> kline option', option);
      myChart.setOption(option);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    };
  })
  
  
});
</script>
