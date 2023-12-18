<script setup>
import moment from 'moment'
defineOptions({
  name: "orderRecords",
  inheritAttrs: false,
});
import {initFlowTableRow, initRealTimeTableRow,hourList} from './model.js'
import coinSystem from "@/api/coinSystem";

const queryFormRef = ref(ElForm); // 查询表单


let coinList = ref([]); // 币种列表

const queryParams = reactive({
  symbol:"",
  hour:24,
  start_time:"",
  end_time:"",
});
// 流水table
const flowTableRow = reactive({...initFlowTableRow});
const flowTableData = ref([]);
const flowLoading = ref(false);

// 实时数据table
const realTimeTableRow = reactive({...initRealTimeTableRow});
const realTimeTableData = ref([]);
const realTimeLoading = ref(false);

// 币种
function getCoinList() {
  coinSystem.getCoinList().then((res) => {
    const { code, data, message } = res;
    coinList.value = data || [];
    data.includes("USDT") ? queryParams.symbol = "USDT" : queryParams.symbol = data[0];
    handleQuery();
  });
}

function setEndTimeDisabledDate(v){
  let zero_time = moment(queryParams.start_time, 'YYYY-MM-DD HH:mm:ss').startOf('day').valueOf();
  return v.getTime() < zero_time
}

function setEndTimeDisabledHour(){
  const arrs = []
  const hour = new Date(queryParams.start_time).getHours()
  for (let i = 0; i < 24; i++) {
     if (i >= hour) continue;
     arrs.push(i)
  }
  return arrs;
}

function setEndTimeDisabledMinute(){
  const arrs = []
  const minute = new Date(queryParams.start_time).getMinutes()
  for (let i = 0; i < 60; i++) {
     if (i >= minute) continue;
     arrs.push(i)
  }
  return arrs;
}

function setEndTimeDisabledSecond(){
  const arrs = []

  const second = new Date(queryParams.start_time).getSeconds()
  for (let i = 0; i < 60; i++) {
     if (i >= second) continue;
     arrs.push(i)
  }
  return arrs;
}

// 选择
function chooseHour(val){
  if(val===24){
    queryParams.start_time = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    queryParams.end_time = moment().format('YYYY-MM-DD HH:mm:ss')
  }
  else{
    queryParams.start_time = moment().subtract(val, 'hours').format('YYYY-MM-DD HH:mm:ss')
    queryParams.end_time = moment().format('YYYY-MM-DD HH:mm:ss')
  }
}
function startTimeChange(val){
  // val 的0时区时间
  const t = moment(val, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
  const time = moment(val, 'YYYY-MM-DD HH:mm:ss')
  const endTime = moment(queryParams.end_time, 'YYYY-MM-DD HH:mm:ss')
  if(time.isAfter(endTime)){
    queryParams.end_time = moment(val, 'YYYY-MM-DD HH:mm:ss').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
  }
}

function QueryInquire(){
  handleQuery()
}
function resetQuery(){
  Object.assign(queryParams, {
    symbol:"",
    start_time:"",
    end_time:"",
  })
  handleQuery()
}
// 查询
function handleQuery() {
  flowLoading.value = true;
  coinSystem.getAccountAssetsFlowList(queryParams)
    .then((res) => {
      console.log('res===>res',res);
      const {code, data, message} = res
      if(code === 200){
        flowTableData.value = data || [];
      }
    })
    .finally(() => {
      flowLoading.value = false;
    });
}

function getRealTimeData(){
  realTimeLoading.value = true;
  coinSystem.getAccountAssetsList()
  .then((res) => {
    const {code, data, message} = res
    console.log('data===>realTimeTableData', data)
    if(code === 200){
      realTimeTableData.value = data || [];
    }
  })
  .finally(()=>{
    realTimeLoading.value= false
  })
}
onMounted(() => {
  queryParams.start_time = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  queryParams.end_time = moment().format('YYYY-MM-DD HH:mm:ss')
  // 获取币种接口
  getCoinList();
  // 请求接口
  // 获取实时数据
  getRealTimeData();
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <el-form ref="queryFormRef" :model="queryParams" :inline="true">
              <el-form-item label="币种" prop="status">
                <el-select
                  v-model="queryParams.symbol"
                  placeholder="选择币种"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in coinList"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="查看方式" prop="status">
                <el-select
                  v-model="queryParams.hour"
                  placeholder="选择币种"
                  @change="chooseHour"
                >
                  <el-option
                    v-for="item in hourList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="日期时间">
                <el-date-picker
                  v-model="queryParams.start_time"
                  type="datetime"
                  placeholder="选择开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :clearable="false"
                  @change="startTimeChange"
                />
                <span style="width:16px;text-align: center;"> - </span>
                <el-date-picker
                  v-model="queryParams.end_time"
                  type="datetime"
                  placeholder="选择结束时间"
                  :disabled-date="setEndTimeDisabledDate"
                  :disabled-hours="setEndTimeDisabledHour"
                  :disabled-minutes="setEndTimeDisabledMinute" 
                  :disabled-seconds="setEndTimeDisabledSecond"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :clearable="false"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="QueryInquire">
                  <i-ep-search />查询
                </el-button>
                <el-button @click="resetQuery">
                    <i-ep-refresh /> 重置
                </el-button >
              </el-form-item>
            </el-form>
          </template>
          <el-table v-loading="flowLoading" :data="flowTableData" border>
            <el-table-column
              v-for="item in flowTableRow"
              :key="item.prop"
              :label="item.label"
              :align="item.align || 'center'"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
            >
            <template #default="scope">
              <template v-if="item.slot === 'account'">
                <span>BTK01</span>
              </template>
            </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never">
          <template #header>
            <div class="robot-header">
              <div class="robot-title">实时数据</div>
              <div class="robot-switch">
                <el-button type="text" icon="el-icon-refresh" @click="getRealTimeData" >刷新</el-button>
              </div>
            </div>
          </template>
          <el-table
          v-loading="realTimeLoading" :data="realTimeTableData" border>
            <el-table-column
              v-for="item in realTimeTableRow"
              :key="item.prop"
              :label="item.label"
              :align="item.align || 'center'"
              :prop="item.prop"
              :width="item.width"
              :min-width="item.minWidth"
            >
            <template #default="scope">
              <template v-if="item.slot === 'account'">
                <span>BTK01</span>
              </template>
            </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
