<script setup>
import { cloneDeep } from "lodash-es";
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
  page: 1,
  page_size: 20,
  session_id: '-1',
  symbol:"",
  side: "",
  order_type:"",
  status:"",
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
  });
}

function setEndTimeDisabledDate(v){
  return v.getTime() < new Date(queryParams.start_time).getTime()- 8.64e7
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

function QueryInquire(){
  queryParams.page = 1;
  queryParams.session_id = '-1';
  handleQuery()
}
function resetQuery(){
  Object.assign(queryParams, {
    page: 1,
    page_size: 20,
    session_id: '-1',
    symbol:"",
    side: "",
    order_type:"",
    status:"",
    start_time:"",
    end_time:"",
  })
  handleQuery()
}
// 查询
function handleQuery() {
  loading.value = true;
  coinSystem.getOrderList(queryParams)
    .then((res) => {
      console.log('res===>res',res);
      const {code, data:{data:list,page_count, session_id },message} = res
      if(code === 200){
        tableData.value = list;
        pageCount.value = page_count;
        queryParams.session_id = String(session_id);
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
onMounted(() => {
  // 获取币种接口
  getCoinList();
  // 请求接口
  handleQuery();
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
        <el-form-item label="买卖方向:">
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
        <el-form-item label="订单类型:">
          <el-select
            v-model="queryParams.order_type"
            placeholder="选择订单类型"
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
        <el-form-item label="订单状态:">
          <el-select
            v-model="queryParams.status"
            placeholder="选择订单状态"
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
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="queryParams.start_time"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY/MM/DD hh:mm:ss"
            value-format="YYYY/MM/DD hh:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="queryParams.end_time"
            type="datetime"
            placeholder="选择结束时间"
            :disabled-date="setEndTimeDisabledDate"
            :disabled-hours="setEndTimeDisabledHour"
            :disabled-minutes="setEndTimeDisabledMinute" 
            :disabled-seconds="setEndTimeDisabledSecond"
            format="YYYY/MM/DD hh:mm:ss"
            value-format="YYYY/MM/DD hh:mm:ss"
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
            <template v-if="item.slot === 'status'">
              <status-item :status="scope.row[item.prop]" />
            </template>
            <template v-if="item.slot === 'side'">
              <side-item :status="scope.row[item.prop]" />
            </template>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-model:pageCount="pageCount"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.page_size"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>
