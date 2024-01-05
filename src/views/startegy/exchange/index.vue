<script setup>
import { cloneDeep } from "lodash-es";
import exchangeApi from "@/api/exchange";
import coinApi from "@/api/coin";
import {
  initTableRow,
  followStrategyList,
  stateMap,
  dealWithData,
} from "./model.js";
const infoFormRef = ref(ElForm);

const coinList = ref([]);
function getSymbolList() {
  coinApi.getCoinPairList().then((res) => {
    console.log(res);
    const { code, data, message } = res;
    if (code === 200) {
      coinList.value = data || [];
    }
  });
}

const tableData = ref([]);
const tableRow = ref([...initTableRow]);
function getExchangeList() {
  exchangeApi.getExchangeConfigList().then((res) => {
    console.log(res);
    const { code, data, message } = res;
    if (code === 200) {
      tableData.value = dealWithData(data) || [];
    }
  });
}

const drawer = reactive({
  visible: false,
  title: "新增",
  direction: "rtl",
  action: "add",
});
let formValue = reactive({
  symbol: "",
  follow_type: "",
  // status: stateMap.STOPPED,
  configList: [{ id: "", name: "", symbol: "", weight: "" }],
});
function addNew() {
  drawer.visible = true;
  drawer.title = "新增";
  drawer.action = "add";
  formValue = reactive({
    symbol: "",
    follow_type: "",
    // status: stateMap.STOPPED,
    configList: [{ id: "", name: "", symbol: "", weight: "" }],
  });
}

function editItem(row) {
  drawer.visible = true;
  drawer.title = "编辑";
  drawer.action = "edit";
  formValue = reactive({ ...cloneDeep(row) });
}

function deleteItem(row) {
  console.log("deleteItem", row);
  ElMessageBox.confirm("此操作将永久删除该币对, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      exchangeApi.deleteExchangeConfig({ id: row.id }).then((res) => {
        console.log(res);
        const { code, data, message } = res;
        if (code === 200) {
          ElMessage({
            message: "删除成功～",
            type: "success",
          });
          getExchangeList();
        } else {
          ElMessage({
            message: `删除失败${message}`,
            type: "error",
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
}

function handleConfirm() {
  console.log("handleConfirm");
  infoFormRef.value.validate((valid) => {
    if (valid) {
      console.log("submit!", formValue);
      if (formValue.id) {
        // 编辑
        let options = {
          id: formValue.id,
          follow_type: formValue.follow_type,
          config: formValue.configList,
        };
        coinApi.updateCoinPair(options).then((res) => {
          console.log("edit", res);
          const { code, data, message } = res;
          if (code === 200) {
            ElMessage({
              message: "修改成功～",
              type: "success",
            });
            getExchangeList();
            handleClose();
          } else {
            ElMessage({
              message: `失败${message}`,
              type: "error",
            });
          }
        });
      } else {
        // 新增
        let options = {
          symbol: formValue.symbol,
          follow_type: formValue.follow_type,
          config: formValue.configList,
        };
        exchangeApi.addExchangeConfig(options).then((res) => {
          console.log("add", res);
          const { code, data, message } = res;
          if (code === 200) {
            ElMessage({
              message: "新增成功～",
              type: "success",
            });
            getExchangeList();
            handleClose();
          } else {
            ElMessage({
              message: `失败${message}`,
              type: "error",
            });
          }
        });
      }
    } else {
      console.log("error submit!!");
      return false;
    }
  });
}
function handleClose() {
  console.log("handleClose");
  drawer.visible = false;
}

function addConfig() {
  console.log("addConfig");
  formValue.configList.push({ id: "", name: "", symbol: "", weight: "" });
}
function deleteConfig(index) {
  console.log("deleteConfig", index);
  formValue.configList.splice(index, 1);
}
onMounted(() => {
  getExchangeList();
  getSymbolList();
});
</script>
<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <el-button type="primary" @click="addNew">
          <i-ep-plus />新增
        </el-button>
      </template>
      <el-table v-loading="flowLoading" :data="tableData" border>
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
            <template v-if="item.slot === 'config'">
              <el-table :data="scope.row[item.prop]" border>
                <el-table-column label="交易所" prop="name" />
                <el-table-column label="币种" prop="symbol" />
                <el-table-column label="权重" prop="weight" />
              </el-table>
            </template>
            <template v-if="item.slot === 'status'">
              <span>{{
                scope.row[item.prop] === 1
                  ? "正常"
                  : scope.row[item.prop] === 0
                  ? "停用"
                  : "未知"
              }}</span>
            </template>
            <template v-if="item.slot === 'strategy'">
              <span
                v-if="scope.row[item.prop] === followStrategyList[0].value"
                >{{ followStrategyList[0].label }}</span
              >
              <span v-if="scope.row[item.prop] === followStrategyList[1].value">
                {{ followStrategyList[1].label }}
              </span>
            </template>
            <template v-if="item.slot === 'action'">
              <el-button type="text" size="mini" @click="editItem(scope.row)">
                编辑
              </el-button>
              <el-button type="text" size="mini" @click="deleteItem(scope.row)">
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      :direction="drawer.direction"
      size="50%"
      :before-close="handleClose"
    >
      <el-form ref="infoFormRef" label-width="120px" :model="formValue">
        <el-form-item label="币对">
          <el-select
            v-model="formValue.symbol"
            placeholder="填写币种"
            filter
            :disabled="drawer.action === 'edit'"
          >
            <el-option
              v-for="item in coinList"
              :key="item.symbol"
              :value="item.symbol"
              :label="item.symbol"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跟单类型">
          <el-select v-model="formValue.follow_type" placeholder="选择跟单类型">
            <el-option
              v-for="item in followStrategyList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-switch
            v-model="formValue.status"
            :active-value="stateMap.RUNNING"
            :inactive-value="stateMap.STOPPED"
          />
        </el-form-item> -->
        <el-form-item
          v-for="(co, index) in formValue.configList"
          :label="'配置' + index"
          :key="co.name"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-input v-model="co.name" placeholder="填写交易所名称" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="co.symbol" placeholder="填写币种" />
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="co.weight"
                type="number"
                placeholder="填写权重"
              />
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" @click="addConfig">
                增加
              </el-button>
              <el-button
                :disabled="index === 0"
                size="mini"
                @click="deleteConfig(index)"
              >
                删除
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
