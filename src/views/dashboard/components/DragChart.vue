<!-- 蜡烛图 / K 线图 -->
<template>
  <el-card>
    <template #header> 拖拽折线图 </template>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";


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
});

type EChartsOption = echarts.EChartsOption;

var myChart: echarts.ECharts;

// var chartDom = document.getElementById(props.id)!;
// var myChart = echarts.init(chartDom);
var option: EChartsOption;

const symbolSize = 20;
const data = [
  [0,1.1],
  [1,2.3],
  [2,3.2],
  [3,0],
  [4,4.1],
  [5,6.5],
  [6,3],
  [7,8],
  [8,10],
  [9,2],
  [10,1],
  [11,1],
  [12,1],
  [13,6],
  [14,8],
  [15,5],
  [16,4],
  [17,7],
  [18,2],
  [19,8],
  [20,5],
  [21,8],
  [22,9],
  [23,2],
];

// const data = [0,1,2,3,4,1,2,3,4,1,2,3,4,5,4,3,2,1,2,3,4,4,10,3];

option = {
  title: {
    text: "demo",
  },
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
    id:'grid',
    top: "8%",
    bottom: "12%",
  },
  xAxis: {
    id:'timeX',
    type: "category",
    // data:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    axisLine: { onZero: true },
  },
  yAxis: {
    min: 0,
    max: 10,
    type: "value",
    axisLine: { onZero: true },
  },
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
  series: [
    {
      id: "a",
      type: "line",
      smooth: true,
      symbolSize: symbolSize,
      data: data,
    },
  ],
};

setTimeout(function () {
  // Add shadow circles (which is not visible) to enable drag.
  myChart.setOption({
    graphic: data.map(function (item, dataIndex) {
      return {
        type: "circle",
        position: myChart.convertToPixel("grid", item),
        shape: {
          cx: 0,
          cy: 0,
          r: symbolSize / 2,
        },
        invisible: false,
        draggable: true,
        ondrag: function (params: any) {
          const origin_dot = myChart.convertToPixel('grid', data[dataIndex])
          // 固定 x 轴，拖拽点.x 始终 = 数值点.x
          onPointDragging(dataIndex, [(this as any).x=origin_dot[0], (this as any).y]);
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

onMounted(() => {
  myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
  myChart.setOption(option);
  window.addEventListener("resize", updatePosition);
  myChart.on("dataZoom", updatePosition);
});
</script>
