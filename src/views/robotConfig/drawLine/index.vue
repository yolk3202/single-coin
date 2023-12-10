<script setup>
import {robotInfo} from './model'
import robotSystemApi from '@/api/robotSystem';

let coinList = ref([]); // 币种列表
let queryParams = reactive({
  symbol: "",
});
let robotConfig = reactive({
  val:0,
})
// 币种
function getCoinList() {
  robotSystemApi.getCoinTypeList().then((res) => {
    const { code, data, message } = res;
    coinList.value = data || [];
    data.includes("BTKUSDT") ? queryParams.symbol = "BTKUSDT" : queryParams.symbol = data[0];
  });
}


function changeStatus(ro){
  // console.log( ro)
  ro.loading = true;
  robotSystemApi.updateCurRobotStatus({
    symbol: queryParams.symbol,
    bot_type: ro.value,
    status: ro.status?1:0,
  }).then(res => {
    console.log('切换后de状态', res)
    if(res.code !== 200) {
      ElMessage.error({
        message: `${ro.name}, ${res.message || '切换失败'}`
      })
      ro.status = !ro.status 
      return;
    }
    ElMessage.success({
      message: `${ro.name}, ${ro.status?'开启成功':'关闭成功'}`
    })
  }).catch(err=>{
    ro.status = !ro.status 
  }).finally(() => {
    ro.loading = false;
  })
}
function cancelConfig(){
  console.log('取消')
}
function submitConfig(){
  console.log('保存')
}

onMounted(()=>{
  getCoinList()
})
</script>
<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{robotInfo.name}}</span>
          <el-switch
            v-model="robotInfo.status"
            size="large"
            active-text="开启状态"
            inactive-text="关闭状态"
            :loading="robotInfo.loading"
            @change="changeStatus(robotInfo)"
          />
        </div>
      </template>
      <div>
        <el-form ref="queryFormRef"  :inline="true" :model="form">
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
        </el-form>
        <el-card shadow="never">
          <template #header>
            <span>{{robotInfo.name}}配置</span>
          </template>
          <div>
            <el-form
              ref="configFormRef"
              :model="robotConfig"
              label-width="auto"
              label-position="top"
            >
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="最小点差（画线条件）">
                  <el-input-number v-model="robotConfig.val" :precision="2" :step="0.1" :max="10" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="成交间隔（ms）">
                  <el-input v-model="robotConfig.val"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最小交易量">
                  <el-input v-model="robotConfig.val"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="最大交易量">
                  <el-input v-model="robotConfig.val"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="大额概率%">
                  <el-input v-model="robotConfig.val"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="大额乘数">
                  <el-input v-model="robotConfig.val"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            </el-form>
          </div>
          <div>
            <el-button  @click="cancelConfig">取消</el-button>
            <el-button type="primary" @click="submitConfig">保存</el-button>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
</style>