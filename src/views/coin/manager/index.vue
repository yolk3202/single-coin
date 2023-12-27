<script setup>
import coinApi from '@/api/coin'
import {initTableRow, trackingStrategyList, stateMap} from './model.js'
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
  direction: 'rtl',
  action: 'add',
})
let formValue = reactive({
  symbol: '',
  account_id: '',
  tracking_strategy: 'DRAW_LINE',
  state: stateMap.STOPPED,
})
function addNew(){
  drawer.visible = true
  drawer.title = '新增币对'
  drawer.action = 'add'
  formValue = reactive({
    symbol: '',
    account_id: '',
    tracking_strategy: 'DRAW_LINE',
    state: stateMap.STOPPED,
  })
}

function editItem(row){
  drawer.visible = true
  drawer.title = '编辑币对'
  drawer.action = 'edit'
  formValue = reactive({...row})
}

function deleteItem(row){
  console.log('deleteItem', row)
  ElMessageBox.confirm('此操作将永久删除该币对, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    coinApi.deleteCoinPair({id:row.id}).then(res=>{
      console.log(res)
      const {code, data, message} = res
      if(code === 200){
        ElMessage({
          message: "删除成功～",
          type: "success",
        });
        getCoinPairList()
      }else{
        ElMessage({
          message: `删除失败${message}`,
          type: "error",
        });
      }
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });          
  });
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
          state: formValue.state
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

let coinList = ref([])
function getCoinTypeList(){
  coinApi.getCoinTypeList().then(res=>{
    console.log(res)
    const {code, data, message} = res
    if(code === 200){
      coinList.value = data
    }
  })
}

onMounted(()=>{
  getAccountList()
  getCoinPairList()
  getCoinTypeList()
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
              <span>{{scope.row[item.prop]=== stateMap.RUNNING?'正常': scope.row[item.prop]=== stateMap.STOPPED? '停用':'未知'}}</span>
            </template>
            <template v-if="item.slot === 'strategy'">
              <span v-if="scope.row[item.prop]=== 'DRAW_LINE'">画线({{scope.row[item.prop]}})</span>
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
      :before-close="handleClose">
      <el-form ref="infoFormRef" label-width="120px"  :model="formValue">
        <el-form-item label="币对">
          <el-select
            v-model="formValue.symbol"
            placeholder="填写币种"
            filter
            :disabled="drawer.action === 'edit'"
          >
            <el-option
              v-for="item in coinList"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号ID">
          <el-select
            v-model="formValue.account_id"
            placeholder="选择账号"
            :disabled="drawer.action === 'edit'"
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
            v-model="formValue.state"
            :active-value="stateMap.RUNNING"
            :inactive-value="stateMap.STOPPED"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>