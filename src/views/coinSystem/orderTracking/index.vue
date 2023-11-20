<script setup>
import { cloneDeep } from "lodash-es";
import { initTableRow } from "./model";
/**
 * @see {@link https://vuejs.org/api/sfc-script-setup.html#defineoptions}
 */
defineOptions({
  name: "AgencyInfo",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const loading = ref(false);
const pageCount = ref(0);

const queryParams = reactive({
  page: 1,
  limit: 20,
  date: "",
  keyword: "",
  status: "",
});

const tableRow = reactive({ ...initTableRow });
const tableData = ref([]);


function demoApi() {
  return new Promise((resolve, reject) => {
    const list = [
      {
        id: "001",
        userId: "001",
        time: "2023-12-12",
        type: 2,
        tradingPartners: "tom",
        direction: "上",
        price: 123.5,
        total: 100,
        turnover: 98769.9,
        handingFee: 3000,
      },
      {
        id: "002",
        userId: "001",
        time: "2023-12-12",
        type: 2,
        tradingPartners: "tom",
        direction: "上",
        price: 123.5,
        total: 100,
        turnover: 98769.9,
        handingFee: 3000,
      },
    ];
    resolve({code:200,data:{list,total:2}, message:"ok"});
  });
}
// 查询
function handleQuery() {
  loading.value = true;
  demoApi(queryParams)
    .then((res) => {
      console.log(res);
      const {code, data,message} = res
      if(code === 200){
        tableData.value = data.list || [];
        pageCount.value = data.total || 0;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="某数据:">
          <el-select
            v-model="queryParams.status"
            placeholder="启停状态"
            clearable
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="某数据:">
          <el-select
            v-model="queryParams.status"
            placeholder="启停状态"
            clearable
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="queryParams.date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            @change="changeDate"
          />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.keyword"
            placeholder="用户ID/用户手机/用户邮箱"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><i-ep-search />查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <!-- <template #header></template> -->
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column
          v-for="item in tableRow"
          :key="item.prop"
          :label="item.label"
          :align="item.align || 'center'"
          :prop="item.prop"
          :width="item.width"
          :min-width="item.minWidth"
        />
      </el-table>

      <pagination
        v-if="pageCount > 0"
        v-model:pageCount="pageCount"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.limit"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>
