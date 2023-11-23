<!-- 蜡烛图 / K 线图 -->
<template>
  <el-card>
    <template #header>K 线图 ( UTC 时间 )</template>
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
  max: {
    type: Number,
    default: 10,
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
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    }
  },
  grid: {
    top: "2%",
    bottom: "20%",
    left: "10%",
    right: "10%"
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
      bottom: 10,
      // top: "80%",
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

watch(
  () => props.max,
  (val) => {
    option.yAxis.max = val;
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  const myChart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );

  watch(coinKline, ()=>{
    console.log('Candle kline ==>', coinKline.value);
    let curKData = JSON.parse(JSON.stringify(coinKline.value));
    let k_data = curKData.data;
    let k_x = curKData.x;

    // echarts 超过 600 个，按比例间隔取点。因为 >= 600 个点，放大后蜡烛图只是一条线，不完整
    const small = Math.ceil(k_data.length / 600)
    k_data = curKData.data.filter((_: any, index: number) => index % small === 0);
    k_x = curKData.x.filter((_: any, index: number) => index % small === 0);

    if (Array.isArray(option.series)) {
      // 把时间戳转换为 ”小时:分钟“的格式
      const hour_min = k_x.map(
        (timestamp:number) => {
        const date = new Date(timestamp * 1000);
        let k_hour = date.getHours() >= 8? date.getHours() - 8: date.getHours() + 16;
        const hours = k_hour.toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    });
      // console.log('Candle hour_min ==>', hour_min);

      option.xAxis.data = hour_min;
      option.series[0].data = k_data;
      myChart.setOption(option);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    };
  })
  
});
</script>
