<script setup>
import { initTableRow} from "./model";
import log from "@/api/log";

defineOptions({
  name: "logManager",
  inheritAttrs: false,
});

const loading = ref(false);


const pageCount = ref(0);
const tableRow = reactive({ ...initTableRow });
const tableData = ref([]);
const queryParams = reactive({
  page: 1,
  page_size: 10,
});

const drawer = reactive({
  visible: false,
  title: "",
});

function handleDetail(row) {
  console.log('row===>row',row);
  const { id } = row;
  //打开详情弹层
}

// 查询
function handleQuery() {
  loading.value = true;
  log.getLogList(queryParams)
    .then((res) => {
      console.log('res===>res',res);
      const {code, data:{data:list,page_count, session_id },message} = res
      if(code === 200){
        tableData.value = list;
        pageCount.value = page_count;
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
onMounted(() => {
  // 请求接口
  handleQuery();
});
</script>

<template>
  <div class="app-container">
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
          :fixed="item.fixed"
        >
          <template #default="scope">
            <template v-if="item.slot === 'action'">
                <el-button type="text" size="mini" @click="handleDetail(scope.row)">
                    查看
                </el-button>
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
    <el-drawer
      v-if="drawer.visible"
      v-model="drawer.visible"
      :title="drawer.title"
      direction="rtl"
      :size="'50%'"
      @close="closeDrawer"
    >
      <div>详情</div>
      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="closeDrawer">关 闭</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
