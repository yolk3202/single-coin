<!-- 蜡烛图 / K 线图 -->
<template>
  <el-card>
    <template #header> K 线图 </template>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";

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

const options = {
  xAxis: {
    data: ["2017-10-24", "2017-10-25", "2017-10-26", "2017-10-27"],
  },
  yAxis: {},
  series: [
    {
      type: "candlestick",
      data: [
        [20, 34, 10, 38],
        [40, 35, 30, 50],
        [31, 38, 33, 44],
        [38, 15, 5, 42],
      ],
    },
  ],
};

onMounted(() => {
  const chart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  chart.setOption(options);
  window.addEventListener("resize", () => {
    chart.resize();
  });
});
</script>
