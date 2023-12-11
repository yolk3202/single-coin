<script setup>
import { cloneDeep } from "lodash-es";
import {robotInfo, defaultConfig} from './model'
import robotSystemApi from '@/api/robotSystem';

const inactiveValue = 0;
const activeValue = 1;
let loading = ref(false);
let coinList = ref([]); // 币种列表
let accountList = ref([]);
let queryParams = reactive({
  symbol: "",
  // 账户
  account: "BTK01",
});
let pageType = ref('add'); // add, edit
let robotObj = reactive({
  ...robotInfo,
});

let robotConfig = reactive({
  ...defaultConfig
})

const configRules = reactive({
  layer_count: [{ required: true, message: '远盘层数不能为空', trigger: 'blur' }],
  maximum_price_deviation_ratio: [{ required: true, message: '价格最大偏离比例不能为空', trigger: 'blur' }],
  minimum_volume: [{ required: true, message: '最小量不能为空', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if(value <= 0){
        callback(new Error('最小量要大于0'));
      }
      if(value > 999999999) {
        callback(new Error('最小量最大为999999999'));
      } else {
        callback();
      }
    }, trigger: 'blur' }],
  maximum_volume: [{ required: true, message: '最大量不能为空', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if(value <= 0){
        callback(new Error('最大量要大于0'));
      }
      if(value > 999999999) {
        callback(new Error('最大量最大为999999999'));
      } else {
        callback();
      }
      // else if (value < robotConfig.minimum_volume) {
      //   callback(new Error('最大量必须大于最小量'));
      // }
    }, trigger: 'blur' }],
  maximum_cancellation_price_ratio: [{ required: true, message: '最大撤单价格比例不能为空', trigger: 'blur' }],
  update_frequency_ms: [{ required: true, message: '远盘更新频率不能为空', trigger: 'blur' }],
});
const queryFormRef = ref(ElForm); // 搜索表单
const configFormRef = ref(ElForm); // 配置表单

// 币种
function getCoinList() {
  robotSystemApi.getCoinTypeList().then((res) => {
    const { code, data, message } = res;
    coinList.value = data || [];
    data.includes("BTKUSDT") ? queryParams.symbol = "BTKUSDT" : queryParams.symbol = data[0];
    getRobotConfig()
  });
}

function getRobotConfig () {
  loading = true;
  robotSystemApi.getCurRobotConfig({
    symbol: queryParams.symbol,
    bot_type: robotObj.value,
  }).then(res => {
    console.log('机器人配置', res, robotInfo)
    const {code, data, message} = res;
    if(code === 200){
      if(data.id){
        robotObj = Object.assign(robotObj, data);
        robotConfig = Object.assign(robotConfig, data.config);
        pageType.value = 'edit';
      }else{
        robotObj = Object.assign(robotObj, cloneDeep(robotInfo));
        robotConfig = Object.assign(robotConfig, cloneDeep(defaultConfig));
        pageType.value = 'add';
      }
    }else{
      ElMessage.error({
        message: message || '获取机器人配置失败'
      })
    }
  }).finally(()=>{
    loading = false;
  })
}


function changeStatus(){
  const ro = robotObj
  robotSystemApi.updateCurRobotStatus({
    symbol: queryParams.symbol,
    bot_type: ro.value,
    status: ro.status,
  }).then(res => {
    console.log('切换后de状态', res)
    if(res.code !== 200) {
      ElMessage.error({
        message: `${ro.name}, ${res.message || '切换失败'}`
      })
      return;
    }
    ElMessage.success({
      message: `${ro.name}, ${ro.status?'开启成功':'关闭成功'}`
    })
  }).catch(err=>{
    ElMessage.error({
      message: `${ro.name}, ${err.message || '切换失败'}`
    })
  })
}

function changeSymbol(){
  getRobotConfig()
}

function cancelConfig(){
  getRobotConfig()
}

function submitConfig(){
  configFormRef.value.validate((valid) => {
    if (valid) {
      submit()
    } else {
      console.log("error submit!!");
      return false;
    }
  });
}


function submit(){
  robotSystemApi.addRobotConfig({
    symbol: queryParams.symbol,
    bot_type: robotObj.value,
    config: robotConfig
  }).then(res => {
    console.log('保存机器人配置', res)
    const {code, data, message} = res;
    if(code === 200){
      ElMessage.success({
        message: '保存成功'
      })
    }else{
      ElMessage.error({
        message: message || '保存失败'
      })
    }
  })
}

onMounted(()=>{
  getCoinList()
})

</script>
<template>
  <div class="app-container" v-loading="loading">
    <el-card shadow="never">
      <template #header>
        <div class="robot-header">
          <div class="robot-title">{{robotObj.name}}</div>
          <div class="robot-switch">
            <el-switch
              v-model="robotObj.status"
              size="large"
              :active-value=activeValue
              :inactive-value=inactiveValue
              active-text="开启状态"
              inactive-text="关闭状态"
              :disabled="pageType==='add'"
              @change="changeStatus"
            />
          </div>
        </div>
      </template>
      <div>
        <el-form ref="queryFormRef" :inline="true" :model="form">
          <el-form-item label="应用币种" prop="status">
            <el-select
              v-model="queryParams.symbol"
              placeholder="选择币种"
              @change="changeSymbol"
            >
              <el-option
                v-for="item in coinList"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="使用账户" prop="status">
            <el-select
              v-model="queryParams.account"
              placeholder="选择账户"
              @change="changeSymbol"
              disabled
            >
              <el-option
                v-for="item in accountList"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-card shadow="never">
          <template #header>
            <div class="robot-header">
              <div class="robot-title">{{robotObj.name}}配置</div>
            </div>
          </template>
          <div class="robot-config-form">
            <el-form
              ref="configFormRef"
              :model="robotConfig"
              :rules="configRules"
              label-width="auto"
              label-position="top"
            >
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="远盘层数" prop="layer_count" >
                  <el-input-number v-model="robotConfig.layer_count"  min="0" :max="999999999" controls-position="right"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="价格最大偏离比例" prop="maximum_price_deviation_ratio">
                  <el-input-number v-model="robotConfig.maximum_price_deviation_ratio" :precision="2" :step="0.01" min="0" :max="1" controls-position="right"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最小量" prop="minimum_volume" >
                  <el-input v-model="robotConfig.minimum_volume" type="number" step="0.01" min="0" max="999999999"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="最大量" prop="maximum_volume">
                  <el-input v-model="robotConfig.maximum_volume" type="number" step="0.01" min="0" max="999999999"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最大撤单价格比例" prop="maximum_cancellation_price_ratio">
                  <el-input-number v-model="robotConfig.maximum_cancellation_price_ratio" :precision="2" :step="0.01" min="0" :max="999999999" controls-position="right"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="远盘更新频率(ms)" prop="update_frequency_ms">
                  <el-input-number v-model="robotConfig.update_frequency_ms" :step="1" min="0" controls-position="right"/>
                </el-form-item>
              </el-col>
            </el-row>
            </el-form>
          </div>
          <div>
            <el-button  @click="cancelConfig">取消</el-button>
            <el-button type="primary" @click="submitConfig">{{pageType==='edit'?"修改机器人配置":"新增机器人"}}</el-button>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
</style>