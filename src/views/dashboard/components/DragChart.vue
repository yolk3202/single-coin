<!-- 蜡烛图 / K 线图 -->
<template>
  <el-card>
    <template #header>
      <el-row>
        <el-col :span="12">拖拽折线图 ( UTC 时间 )</el-col>
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
    default: "",
  },
  radio: {
    type: Number,
    default: "",
  },
  symbol: {
    type: String,
    default: "",
  }
});

type EChartsOption = echarts.EChartsOption;

let myChart: echarts.ECharts;
let options: EChartsOption;
const symbolSize = 12;

let data = [
  [0, 9.1], [1, 2.3], [2, 3.2], [3, 0],
  [4, 4.1], [5, 6.5], [6, 3], [7, 8],
  // [8,10],[9,2],[10,1],[11,1],[12,1],[13,6],
  // [14,8],[15,5],[16,4],[17,7],[18,2],[19,8],
  // [20,5],[21,8],[22,9],[23,2],
];

options = {
  // title: {text: "demo",},
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
    axisLine: { onZero: true },
  },
  yAxis: {
    min: 0,
    max: 10,
    type: "value",
    axisLine: { onZero: true },
  },
  series: [{
    id: "a",
    type: "line",
    smooth: true,
    symbolSize: symbolSize,
    data: data,
  }],
};

// 保存，提交
async function submitHandler() {
  console.log("提交 drag data===>", data);
  
  let options = {
    date: "",
    data,
    radio: 10,
    symbol: "ETHUSDT"
  };

  watch( // 监听日期
    () => props.date,
    (val) => {
      options.date = val;
    },
    { immediate: true, deep: true }
  );

  watch( // 监听价格
    () => props.radio,
    (val) => {
      options.radio = val;
    },
    { immediate: true, deep: true }
  );

  watch( // 监听币种
    () => props.symbol,
    (val) => {
      options.symbol = val;
    },
    { immediate: true, deep: true }
  );

  // console.log("提交 drag options ===>", options);
  await coinStore.sendCoinDataAction(options);
  console.log("提交 drag line ===>", coinLine.value);
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
  // 获取鼠标相对于容器的位置
  const containerPosition = myChart.getDom().getBoundingClientRect();
  const containerTop = containerPosition.top;
  const containerHeight = containerPosition.height;

  // 获取数据点的位置
  const pointPosition = myChart.convertToPixel("grid", data[dataIndex]);
  const pointTop = pointPosition[1];

  // 计算展示框的位置
  let tooltipTop;
  if (pointTop - containerTop < containerHeight / 2) {  // 127 - 286 > 150 / 2
    // 如果点位置靠下，展示框放在点上面
    tooltipTop = pointTop - 70; // 调整具体的偏移量
  } else {
    // 否则展示框放在点下面
    tooltipTop = pointTop + 10; // 调整具体的偏移量
  }

  myChart.dispatchAction({
    type: "showTip",
    seriesIndex: 0,
    dataIndex: dataIndex,
    position: [pointPosition[0], tooltipTop], // 设置展示框的位置
  });  
}

function hideTooltip(dataIndex: number) {
  myChart.dispatchAction({
    type: "hideTip",
  });
}

function onPointDragging(this: any, dataIndex: number, pos: number[]) {
  data[dataIndex][1] = myChart.convertFromPixel("grid", pos)[1];
  // console.log('drag data[dataIndex] ==>', data[dataIndex])
  // Update data
  myChart.setOption({
    series: [{
      id: "a",
      data: data,
    }],
  });
}

function initDragEnv() {
  setTimeout(function () {
    // Add shadow circles (which is not visible) to enable drag.
    myChart.setOption({
      graphic: data.map(function (item, dataIndex) {
        // console.log('==> line item', item, dataIndex)
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
            let newX = Math.max(Math.min(params.event.offsetX, myChart.getWidth()), 0); // 限制拖拽点在容器内部
            let newY = Math.max(Math.min(params.event.offsetY, myChart.getHeight() * 0.85), 15); // 限制拖拽点在容器内部

            // console.log('drag origin_dot ==>', origin_dot)

            // 处理边界情况，防止拖拽用力过猛，超出边界时，拖拽点消失
            if (isNaN(newX)) 
              newX = origin_dot[0];
            if (isNaN(newY)) 
              newY = origin_dot[1];
            
            // 固定 x 轴，拖拽点.x 始终 = 数值点.x
            onPointDragging(dataIndex, [
              ((this as any).x = origin_dot[0]),
              (this as any).y = newY,
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
};

function initChart() {
  // myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
  myChart.setOption(options);
  nextTick(() => {
    initDragEnv();
    window.addEventListener("resize", updatePosition);
    myChart.on("dataZoom", updatePosition);
  });
}

watch(
  () => props.max,
  (val) => {
    if (options.yAxis){  
      options.yAxis.max = val;
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);

  watch(coinLine, () => {
    // console.log('drag line ==>', coinLine.value);
    let curData = JSON.parse(JSON.stringify(coinLine.value));
    // 求 y 轴最大值，最小值
    const y_1 = curData.data.map((item: any[]) => item[1]);
    const y_max = Math.max(...y_1);
    const y_min = Math.min(...y_1);
    // console.log("drag y y_min y_max ===>", y_min, y_max);
    // console.log("drag curData ===>", curData);

    data = [...curData.data];
    if (Array.isArray(options.series)) {
      options.series[0].data = [...curData.data];
      // console.log("option.series[0].data ===>", options.series[0].data);
    }
    // if (curData.date) {
    //   console.log('drag curData 有 date ==>')
    //   option.yAxis.min = Math.ceil(y_min * 0.9);
    //   option.yAxis.max = Math.ceil(y_max * 1.1);
    // }
    // else {
    //   console.log('drag curData 无 date ==>')
    //   option.yAxis.max = Math.ceil(curData.radio) * 2;  // coin.js 404 mock 假数据
    // }
    // console.log("drag options ===>", options);
    // console.log("data ===>", data);
    // console.log("myChart ===>", myChart);
    initChart();
  });
});
</script>
