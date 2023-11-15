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
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});

type EChartsOption = echarts.EChartsOption;

var myChart: echarts.ECharts;

// var chartDom = document.getElementById(props.id)!;
// var myChart = echarts.init(chartDom);
var option: EChartsOption;

const symbolSize = 20;
var data = [
  [0, 0],
  [6, 20],
  [12, 40],
  [18, 80],
  [24, 50],
];

option = {
  title: {
    // text: "Try Dragging these Points",
    left: "center",
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
    top: "8%",
    bottom: "12%",
  },
  xAxis: {
    min: -1,
    max: 25,
    type: "value",
    axisLine: { onZero: false },
  },
  yAxis: {
    min: -20,
    max: 100,
    type: "value",
    axisLine: { onZero: false },
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
        invisible: true,
        draggable: true,
        ondrag: function (dx: number, dy: number) {
          onPointDragging(dataIndex, [(this as any).x, (this as any).y]);
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

// window.addEventListener('resize', updatePosition);
// myChart.on('dataZoom', updatePosition);

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

function onPointDragging(dataIndex: number, pos: number[]) {
  // var charPos = myChart.convertFromPixel("grid", pos);
  data[dataIndex][1] = myChart.convertFromPixel("grid", pos)[1];
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

// option && myChart.setOption(option);

onMounted(() => {
  myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
  myChart.setOption(option);
  window.addEventListener("resize", updatePosition);
  myChart.on("dataZoom", updatePosition);
});
</script>
