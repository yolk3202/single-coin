<script setup>
import { initTableRow, detailInfo} from "./model";
import log from "@/api/log";
import detailItem from './components/detailItem.vue'

defineOptions({
  name: "logManager",
  inheritAttrs: false,
});

const loading = ref(false);


const pageCount = ref(0);
const tableRow = reactive({ ...initTableRow });
const tableData = ref([]);
const queryParams = reactive({
  page_no: 1,
  page_size: 10,
});

const drawer = reactive({
  visible: false,
  title: "",
  data: null
});

function handleDetail(row) {
  const { id } = row;
  log.getLogDetail({id})
    .then((res) => {
      const {code, data, message} = res
      if(code === 200){
        drawer.visible = true;
        drawer.title = "详情";
        drawer.data = data;
      }else{
        ElMessage.error(message)
      }
    })
    .finally(() => {
    });
  //打开详情弹层
}

function closeDrawer(){
  drawer.visible = false;
  drawer.title = "";
  drawer.data = null;
}
// 查询
function handleQuery() {
  loading.value = true;
  log.getLogList(queryParams)
    .then((res) => {
      const {code, data:{items, total },message} = res
      if(code === 200){
        tableData.value = items;
        pageCount.value = total;
      }else{
        ElMessage.error(message)
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
                <el-button type="text" size="small" @click="handleDetail(scope.row)">
                    查看
                </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-model:total="pageCount"
        v-model:page="queryParams.page_no"
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
      <detail-item :data="drawer.data" :detail-info="detailInfo" />
      <template #footer>
        <div class="drawer-footer">
          <el-button type="primary" @click="closeDrawer">关 闭</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
