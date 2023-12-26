<script setup>
import coinApi from '@/api/coin'
import {initTableRow, trackingStrategyList} from './model.js'
const infoFormRef = ref(ElForm)
const accountList = ref([])
function getAccountList(){
  coinApi.getAccountList().then(res=>{
    console.log(res)
    const {code, data, message} = res
    if(code === 200){
      accountList.value = data || [];
    }
  })
}

const tableData = ref([])
const tableRow = ref([...initTableRow])
function getCoinPairList(){
  coinApi.getCoinPairList().then(res=>{
    console.log(res)
    const {code, data, message} = res
    if(code === 200){
      tableData.value = data || [];
    }
  })
}

const drawer = reactive({
  visible: false,
  title: '新增币对',
  direction: 'rtl'
})
let formValue = reactive({
  symbol: '',
  account_id: '',
  tracking_strategy: 'DRAW_LINE',
})
function addNew(){
  drawer.visible = true
  drawer.title = '新增币对'
  formValue = reactive({
    symbol: '',
    account_id: '',
    tracking_strategy: 'DRAW_LINE',
  })
}

function editItem(row){
  drawer.visible = true
  drawer.title = '编辑币对'
  formValue = reactive({...row})
}

function handleConfirm(){
  console.log('handleConfirm')
  infoFormRef.value.validate((valid) => {
    if (valid) {
      console.log('submit!',formValue)
      if(formValue.id){
        // 编辑
        let options = {
          id: formValue.id,
          tracking_strategy: formValue.tracking_strategy,
          status: formValue.status
        }
        coinApi.updateCoinPair(options)
        .then(res=>{
          console.log('edit', res)
          const {code, data, message} = res
          if(code === 200){
            ElMessage({
              message: "修改成功～",
              type: "success",
            });
            getCoinPairList()
            handleClose()
          }else{
            ElMessage({
              message: `失败${message}`,
              type: "error",
            });
          }
        })
      }else{
        // 新增
        coinApi.addCoinPair(formValue)
        .then(res=>{
          console.log('add', res)
          const {code, data, message} = res
          if(code === 200){
            ElMessage({
              message: "新增成功～",
              type: "success",
            });
            getCoinPairList()
            handleClose()
          }else{
            ElMessage({
              message: `失败${message}`,
              type: "error",
            });
          }          
        
        })
      }
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
function handleClose(){
  console.log('handleClose')
  drawer.visible = false
}

onMounted(()=>{
  getAccountList()
  getCoinPairList()
})
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
        <el-table-column v-for="item in tableRow" :key="item.prop" :label="item.label" :align="item.align || 'center'"
          :prop="item.prop" :width="item.width" :min-width="item.minWidth">
          <template #default="scope">
            <template v-if="item.slot === 'status'">
              <span>{{scope.row.status=== 1?'正常': scope.row.status=== 0? '停用':'未知'}}</span>
            </template>
            <template v-if="item.slot === 'strategy'">
              <span v-if="scope.row[item.prop]=== 'DRAW_LINE'">画线({{scope.row[item.prop]}})</span>
            </template>
            <template v-if="item.slot === 'action'">
              <el-button type="text" size="mini" @click="editItem(scope.row)">
                编辑
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
      :before-close="handleClose">
      <el-form ref="infoFormRef" label-width="120px"  :model="formValue">
        <el-form-item label="币对">
          <el-input
            v-model="formValue.symbol"
            placeholder="填写币种"
          />
        </el-form-item>
        <el-form-item label="账号ID">
          <el-select
            v-model="formValue.account_id"
            placeholder="选择账号"
          >
            <el-option
              v-for="item in accountList"
              :key="item.id"
              :value="item.id"
              :label="item.uname"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="跟盘策略">
          <el-select
            v-model="formValue.tracking_strategy"
            placeholder="选择跟盘策略"
            disabled
          >
            <el-option
              v-for="item in trackingStrategyList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formValue.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="handleConfirm">确认</el-button>
          <el-button @click="handleClose">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>