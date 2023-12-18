<script setup>
import moment from 'moment'
import { initTableRow, statusList,sideList,orderTypeList} from "./model";
import coinSystem from "@/api/coinSystem";

import statusItem from './component/statusItem.vue'
import sideItem from './component/sideItem.vue'

defineOptions({
  name: "orderTracking",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const loading = ref(false);

let coinList = ref([]); // 币种列表

const queryParams = reactive({
  symbol:"",
  start_time:"",
  end_time:"",
});

const pageCount = ref(0);
const tableRow = reactive({ ...initTableRow });
const tableData = ref([]);


// 币种
function getCoinList() {
  coinSystem.getCoinTypeList().then((res) => {
    const { code, data, message } = res;
    coinList.value = data || [];
    data.includes("BTKUSDT") ? queryParams.symbol = "BTKUSDT" : queryParams.symbol = data[0];
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
function startTimeChange(val){
  // val 的0时区时间
  const t = moment(val, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
  const time = moment(val, 'YYYY-MM-DD HH:mm:ss')
  const endTime = moment(queryParams.end_time, 'YYYY-MM-DD HH:mm:ss')
  if(time.isAfter(endTime)){
    queryParams.end_time = ''
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
  loading.value = true;
  console.log('nihao====>queryParams',queryParams)
  coinSystem.getHistoryOrderList(queryParams)
    .then((res) => {
      console.log('res===>res',res);
      const {code, data, message} = res
      if(code === 200){
        tableData.value = data;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
onMounted(() => {
  // 获取币种接口
  getCoinList();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
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
        <el-form-item label="买卖方向:" v-if="false">
          <el-select
            v-model="queryParams.side"
            placeholder="选择买卖方向"
            clearable
          >
            <el-option
              v-for="item in sideList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型:"  v-if="false">
          <el-select
            v-model="queryParams.order_type"
            placeholder="选择订单类型"
            disabled
            clearable
          >
            <el-option
              v-for="item in orderTypeList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态:"  v-if="false">
          <el-select
            v-model="queryParams.status"
            placeholder="选择订单状态"
            disabled
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
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
    </div>
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column
          v-for="item in tableRow"
          :key="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :prop="item.prop"
          :width="item.width"
          :min-width="item.minWidth"
        >
          <template #default="scope">
            <template v-if="item.slot === 'timeStamp'">
              <span>{{ $filters.timestampToTime(scope.row[item.prop]) }}</span>
            </template>
            <template v-if="item.slot === 'status'">
              <status-item :status="scope.row[item.prop]" />
            </template>
            <template v-if="item.slot === 'side'">
              <side-item :status="scope.row[item.prop]" />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
