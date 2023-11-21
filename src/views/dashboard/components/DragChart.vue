<!-- 蜡烛图 / K 线图 -->
<template>
  <el-card>
    <template #header>
      <el-row>
        <el-col :span="12">拖拽折线图</el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" @click="submitHandler">保存</el-button>
        </el-col>
      </el-row>
    </template>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";

import { storeToRefs } from "pinia";
import { useCoinStore } from "@/store/modules/coin";
const coinStore = useCoinStore();
const { coinLine } = storeToRefs(coinStore);

const props = defineProps({
  id: {
    type: String,
    default: "DragChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "400px",
    required: true,
  },
  height: {
    type: String,
    default: "600px",
    required: true,
  },
  max: {
    type: Number,
    default: 10,
  },
  date: {
    type: String,
    default: "2023-12-01",
  }
});

type EChartsOption = echarts.EChartsOption;

let myChart: echarts.ECharts;
let form = reactive({
  date: "",
});

var option: EChartsOption;
const symbolSize = 20;
let data = [
  [0, 9.1], [1, 2.3], [2, 3.2], [3, 0],
  [4, 4.1], [5, 6.5], [6, 3], [7, 8],
  // [8,10],[9,2],[10,1],[11,1],[12,1],[13,6],
  // [14,8],[15,5],[16,4],[17,7],[18,2],[19,8],
  // [20,5],[21,8],[22,9],[23,2],
];

option = reactive({
  // title: {
  //   text: "demo",
  // },
  tooltip: {
    triggerOn: "none",
    formatter: function (params: any) {
      return (
        "X: " +
        params.data[0].toFixed(2) +
        "<br>Y: " +
        params.data[1].toFixed(2)
      );
    },
  },
  grid: {
    id: "grid",
    top: "10%",
    bottom: "15%",
  },
  xAxis: {
    id: "timeX",
    type: "value",
    // data:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    axisLine: { onZero: true },
  },
  yAxis: {
    min: 0,
    max: 10,
    type: "value",
    axisLine: { onZero: true },
  },
  series: [
    {
      id: "a",
      type: "line",
      smooth: true,
      symbolSize: symbolSize,
      data: data,
    },
  ],
});

function changeDate(val: any) {
  console.log(val);
  console.log(form.date);
  // 请求接口； todo
}

function getData(val: any) {
  console.log("====>val", val);
  console.log("====>data", data);
  data = val;
}
// function demo(arr){
//   //  处理二维数组
// }
// 保存，提交
async function submitHandler() {
  console.log("提交 drag data===>", data);
  console.log("drag date ===>", form.date);
  
  let options = {
    date: form.date,
    data,
    radio: 10,
    symbol: "ETHUSDT"
  };

  watch(
  () => props.date,
  (val) => {
    options.date = val;
  },
  { immediate: true, deep: true }
);

  console.log("提交 drag options ===>", options);
  await coinStore.sendCoinDataAction(options);
  console.log("提交 drag line ===>", coinLine.value);
  // let curData = JSON.parse(JSON.stringify(coinLine.value.data));
}

function updatePosition() {
  myChart.setOption({
    graphic: data.map(function (item, dataIndex) {
      return {
        position: myChart.convertToPixel("grid", item),
      };
    }),
  });
}

function showTooltip(dataIndex: number) {
  myChart.dispatchAction({
    type: "showTip",
    seriesIndex: 0,
    dataIndex: dataIndex,
  });
}

function hideTooltip(dataIndex: number) {
  myChart.dispatchAction({
    type: "hideTip",
  });
}

function onPointDragging(this: any, dataIndex: number, pos: number[]) {
  data[dataIndex] = myChart.convertFromPixel("grid", pos);
  getData(data);
  // 出数据
  // Update data
  myChart.setOption({
    series: [
      {
        id: "a",
        data: data,
      },
    ],
  });
}

function initDragEnv() {
  setTimeout(function () {
    // Add shadow circles (which is not visible) to enable drag.
    myChart.setOption({
      graphic: data.map(function (item, dataIndex) {
        console.log('==> line item', item, dataIndex)
        return {
          type: "circle",
          position: myChart.convertToPixel("grid", item),
          shape: {
            cx: 0,
            cy: 0,
            r: symbolSize / 2,
          },
          invisible: true,
          draggable: true,
          ondrag: function (params: any) {
            const origin_dot = myChart.convertToPixel("grid", data[dataIndex]);
            // 固定 x 轴，拖拽点.x 始终 = 数值点.x
            onPointDragging(dataIndex, [
              ((this as any).x = origin_dot[0]),
              (this as any).y,
            ]);
          },
          onmousemove: function () {
            showTooltip(dataIndex);
          },
          onmouseout: function () {
            hideTooltip(dataIndex);
          },
          z: 100,
        };
      }),
    });
  }, 1);
}

function initChart() {
  // myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
  myChart.setOption(option);
  nextTick(() => {
    initDragEnv();
    window.addEventListener("resize", updatePosition);
    myChart.on("dataZoom", updatePosition);
  });
}

// watch(
//   () => props.max,
//   (val) => {
//     option.yAxis.max = val;
//   },
//   { immediate: true, deep: true }
// );

onMounted(() => {
  myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);

  watch(coinLine, () => {
    console.log('drag line ==>', coinLine.value);
    let curData = JSON.parse(JSON.stringify(coinLine.value.data));
    const y_min = Math.min(curData.data);
    const y_max = Math.max(curData.data);
    console.log("drag y y_min y_max ===>", y_min, y_max);

    data = [...curData];
    if (Array.isArray(option.series)) {
      option.series[0].data = [...curData];
      console.log("option.series[0].data ===>", option.series[0].data);
    }
    if (curData.date) {
      option.yAxis.max = Math.ceil(curData.radio) * 2;
    }
    else{
      option.yAxis.min = y_min;
      option.yAxis.max = y_max + 1;
    }
    console.log("drag option ===>", option);
    console.log("data ===>", data);
    console.log("myChart ===>", myChart);
    initChart();
  });

});
</script>
