<!-- 蜡烛图 / K 线图 -->
<template>
    <el-card>
      <template #header>
        <el-row>
          <el-col :span="12">拖拽折线图</el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="form.date"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
              @change="changeDate"
            />
            <el-button type="primary" @click="submitHandler">保存</el-button>
          </el-col>
        </el-row>
      </template>
      <div :id="id" :class="className" :style="{ height, width }">
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import * as echarts from "echarts";
  import { getCoinDataApi, sendCoinDataApi } from "@/api/coin";
  
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
  });
  
  type EChartsOption = echarts.EChartsOption;
  
  let myChart: echarts.ECharts;
  let form = reactive({
    date: "",
  });
  
  var option: EChartsOption;
  const symbolSize = 20;
  // let data = reactive([
  //   [0,9.1],[1,2.3],[2,3.2],[3,0],
  //   [4,4.1],[5,6.5],[6,3],[7,8],
  //   // [8,10],[9,2],[10,1],[11,1],[12,1],[13,6],
  //   // [14,8],[15,5],[16,4],[17,7],[18,2],[19,8],
  //   // [20,5],[21,8],[22,9],[23,2],
  // ])
  let data = [
    [0,9.1],[1,2.3],[2,3.2],[3,0],
    [4,4.1],[5,6.5],[6,3],[7,8],
    // [8,10],[9,2],[10,1],[11,1],[12,1],[13,6],
    // [14,8],[15,5],[16,4],[17,7],[18,2],[19,8],
    // [20,5],[21,8],[22,9],[23,2],
  ];
  
  option = reactive({
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
      id: "grid",
      top: "8%",
      bottom: "12%",
    },
    xAxis: {
      id: "timeX",
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
    console.log("提交 data===>", data);
    console.log("nihao===>date", form.date);
    // let data1 = demo(data)
    let options = {
      date: form.date,
      data,
    };
  
    await coinStore.sendCoinDataAction(options);
    console.log("提交 line ===>", coinLine.value);
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
  
  function formatDateToYMD(date: Date) {
    // 获取年、月、日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, "0");
  
    // 构建 yyyy-mm-dd 字符串
    const dateString = `${year}-${month}-${day}`;
    return dateString;
  }
  
  function initDragEnv() {
    console.log("nihao======>", data);
    setTimeout(function () {
      console.log("nihao======>", data);
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
            invisible: false,
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
    myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
    myChart.setOption(option);
    nextTick(() => {
      initDragEnv();
      window.addEventListener("resize", updatePosition);
      myChart.on("dataZoom", updatePosition);
    });
  }
  // 拉取数据
  async function getCoinData() {
    let options = {
      date: form.date,
    };
    await coinStore.getCoinDataAction(options);
    console.log("coinStore.coinData===>", coinLine.value);
    let curData = JSON.parse(JSON.stringify(coinLine.value.data));
    data = [...curData];
    if (Array.isArray(option.series)) {
      option.series[0].data = [...curData];
    }
    console.log("data===>", data);
    console.log("myChart===>", myChart);
    
    myChart = echarts.init(document.getElementById(props.id) as HTMLDivElement);
    myChart.setOption(option);
    window.addEventListener("resize", updatePosition);
    myChart.on("dataZoom", updatePosition);
  
    initChart();

    console.log('after initChart==> ')
  }
  onMounted(() => {
    // 初始化时间
    form.date = formatDateToYMD(new Date());
    getCoinData();
    
  });
  </script>
  