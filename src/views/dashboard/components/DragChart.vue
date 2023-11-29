<!-- 蜡烛图 / K 线图 -->
<template>
  <el-card>
    <template #header>
      <el-row>
        <el-col :span="12">拖拽折线图 ( UTC 时间 )</el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" :disabled="isSaving" @click="submitHandler">保存</el-button>
        </el-col>
      </el-row>
    </template>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";

import {storeToRefs} from "pinia";
import {useCoinStore} from "@/store/modules/coin";

const coinStore = useCoinStore();
const {coinLine} = storeToRefs(coinStore);

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
  [4, 4.1], [5, 6.5], [6, 3], [7, 8]
];

options = {
  // title: {text: "demo",},
  tooltip: {
    triggerOn: "none",
    shared: true,
    formatter: function (params: any) {
      console.log(JSON.stringify(params, null, 2));
      console.log(data)
      var index = params['dataIndex']
      var y = data[index][1]
      if (index == 0) {
        return ("时间: " + index + ':00'+ "<br> 当前值：" + y );
      } else {
        var preIndex = index - 1
        var pre_y = data[preIndex][1]

        console.log("preIndex=" + y)
        var gap = y - pre_y
        console.log("gap=" + gap)
        if (gap == 0) {
          return "时间: " + index + ":00 <br>价格和上个点持平"
        } else {
          console.log("前一个值=" + pre_y)
          console.log("比例=" + (gap / pre_y))
          var radio = ((gap / pre_y) * 100).toFixed(2)
          return (
            "时间: " + index + ':00' +
            "<br> 当前值：" + y +
            "<br>比上一个点的涨跌比例: " + radio + "%"
          );
        }

      }

      // var currentData = params[0].data;
      // var previousData;
      //
      // // 检查是否有前一个数据项的信息
      // if (params[1] && params[1].data) {
      //   previousData = params[1].data;
      // } else {
      //   previousData = 0;
      // }
      //
      // var ratio = (currentData / previousData * 100).toFixed(2) + '%';
      //
      // return '当前值: ' + currentData + '<br/>'
      //   + '前一个值: ' + previousData + '<br/>'
      //   + '比例: ' + ratio;

      return (
        "时间: " +
        params.data[0] + ':00' +
        "<br>百分比: " +
        ((params.data[1] * 2 / props.max - 1) * 100).toFixed(4) + '%' +
        "<br>预估价格: " +
        params.data[1].toFixed(4)
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
    type: "category",
    axisTick: {
      interval: 0,
      alignWithLabel: true
    },
    axisLine: {onZero: true},
  },
  yAxis: {
    min: 0,
    max: 10,
    type: "value",
    axisLine: {onZero: true},
  },

  series: [{
    id: "a",
    type: "line",
    smooth: true,
    symbolSize: symbolSize,
    data: data,
  }],
};

const isSaving = ref(false); // 响应式数据，用于控制保存按钮的禁用状态

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
    {immediate: true, deep: true}
  );

  watch( // 监听价格
    () => props.radio,
    (val) => {
      options.radio = val;
    },
    {immediate: true, deep: true}
  );

  watch( // 监听币种
    () => props.symbol,
    (val) => {
      options.symbol = val;
    },
    {immediate: true, deep: true}
  );

  isSaving.value = true; // 禁用保存按钮

  try {
    await coinStore.sendCoinDataAction(options);
  } catch (error) {
    console.log('drag 提交保存 失败==>', error)
  } finally {
    isSaving.value = false; // 启用保存按钮
  }
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
            let newY = Math.max(Math.min(params.event.offsetY, myChart.getHeight() * 0.85), myChart.getHeight() * 0.1); // 限制拖拽点在容器内部

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
    if (options.yAxis) {
      options.yAxis.max = val;
    }
  },
  {immediate: true, deep: true}
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

    data = [...curData.data];
    if (Array.isArray(options.series)) {
      options.series[0].data = [...curData.data];
    }
    initChart();
  });
});
</script>
