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

  layer_count: [{ required: true, message: '近盘层数不能为空', trigger: 'blur' }],
  sell_order_price_spread: [{ required: true, message: '卖盘盘口价差', trigger: 'blur' }],
  buy_order_price_spread: [{ required: true, message: '买盘盘口价差', trigger: 'blur' }],
  sell_order_step_length: [{ required: true, message: '卖盘步长', trigger: 'blur' }],
  buy_order_step_length: [{ required: true, message: '买盘步长', trigger: 'blur' }],
  minimum_point_spread: [{ required: true, message: '最小点差', trigger: 'blur' }],
  minimum_volume: [{ required: true, message: '最小量', trigger: 'blur' }],
  maximum_volume: [{ required: true, message: '最大量', trigger: 'blur' }],
  update_frequency_ms: [{ required: true, message: '更新频率', trigger: 'blur' }],
  quote_expiration_time_ms: [{ required: true, message: '报价过期时间', trigger: 'blur' }],
});

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
  console.log('出发了改变', ro)
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
  submit()
}

function addConfig(){
  submit()
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
            <span>{{robotObj.name}}配置</span>
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
                <el-form-item label="近盘层数" prop="layer_count" >
                  <el-input-number v-model="robotConfig.layer_count"  min="0" :max="999999999" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="卖盘盘口价差" prop="sell_order_price_spread" >
                  <el-input-number v-model="robotConfig.sell_order_price_spread" :precision="4" :step="0.0001" min="0" :max="999999999" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="买盘盘口价差" prop="buy_order_price_spread" >
                  <el-input-number v-model="robotConfig.buy_order_price_spread" :precision="4" :step="0.0001" min="0" :max="999999999" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="卖盘步长" prop="sell_order_step_length">
                  <el-input-number v-model="robotConfig.sell_order_step_length" :precision="5" :step="0.00001" min="0" :max="999999999" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="买盘步长" prop="buy_order_step_length">
                  <el-input-number v-model="robotConfig.buy_order_step_length" :precision="5" :step="0.00001" min="0" :max="999999999" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最小点差" prop="minimum_point_spread">
                  <el-input-number v-model="robotConfig.minimum_point_spread"  min="0" :max="999999999" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="最小量" prop="minimum_volume" >
                  <el-input-number v-model="robotConfig.minimum_volume"  min="0" :max="999999999" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最大量" prop="maximum_volume" >
                  <el-input-number v-model="robotConfig.maximum_volume"  min="0" :max="999999999" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="更新频率 (ms)" prop="update_frequency_ms" >
                  <el-input-number v-model="robotConfig.update_frequency_ms" min="100" :max="99999999" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="报价过期时间 (ms)" prop="quote_expiration_time_ms" >
                  <el-input-number v-model="robotConfig.quote_expiration_time_ms"  min="100" :max="99999999" />
                </el-form-item>
              </el-col>
            </el-row>            
            </el-form>
          </div>
          <div>
            <el-button  @click="cancelConfig">取消</el-button>
            <el-button type="primary" v-if="pageType==='edit'" @click="submitConfig">修改机器人配置</el-button>
            <el-button type="primary" v-if="pageType==='add'" @click="addConfig">新增机器人</el-button>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
</style>