<script setup>
import { reactive, ref, onMounted } from 'vue';
import robotModel from './model';
import robotSystemApi from '@/api/robotSystem';
import { getCoinPairList } from "@/api/coin";
const inactiveValue = 0;
const activeValue = 1;
let loading = ref(false);
let robots = reactive({...robotModel.robots})
let robotList = ref([]); // 机器人列表

let queryParams = reactive({
  symbol: "",
});
let coinList = ref([]); // 币种列表


function changeSymbol() {
  // 获取当前 机器人配置
  getRobotList();
}

function changeStatus(ro){
  ro.loading = true;
  robotSystemApi.updateCurRobotStatus({
    symbol: queryParams.symbol,
    bot_type: ro.bot_type,
    status: ro.status,
  }).then(res => {
    if(res.code !== 200) {
      ElMessage.error({
        message: `${robots[ro.bot_type].name}, ${res.message || '切换失败'}`
      })
      return;
    }
    ElMessage.success({
      message: `${robots[ro.bot_type].name}, ${ro.status?'开启成功':'关闭成功'}`
    })
  }).catch(err=>{
  }).finally(() => {
    ro.loading = false;
  })
}

// 币种
function getCoinList() {
  getCoinPairList().then((res) => {
    const { code, data, message } = res;
    if(code === 200){
      coinList.value = data || [];
      const hasSymbol = data.some((item) => {
        return item.symbol === "BTKUSDT";
      });
      if (hasSymbol) {
        queryParams.symbol = "BTKUSDT";
      } else {
        queryParams.symbol = data[0].symbol;
      }
    }
    getRobotList();
  });
}

function getRobotList() {
  loading = true;
  robotSystemApi.getRobotList({symbol: queryParams.symbol})
  .then(res=>{
    const {code, data, message} = res;
    if(code === 200) {
      robotList.value = data || [];
    }else{
      ElMessage.error({
        message: message || '获取机器人列表失败'
      })
    }
  })
  .finally(()=>{
    loading = false;
  })
}

onMounted(()=>{
  // 请求接口
  getCoinList()
})
</script>
<template>
   <div class="app-container" v-loading="loading">
      <div class="search-container">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="币种" prop="status">
            <el-select
              v-model="queryParams.symbol"
              placeholder="选择币种"
              filterable
              @change="changeSymbol"
            >
              <el-option
                v-for="item in coinList"
                :key="item.symbol"
                :value="item.symbol"
                :label="item.symbol"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-card shadow="never">
        <el-row :gutter="20" v-if="robotList.length">
          <el-col class="ro-item" :md="12" :sm="12" :xs="24" :lg="8" v-for="ro in robotList" :key="ro.value">
            <el-card shadow="hover" >
              <template #header>
                <div class="robot-header">
                  <div class="robot-title">{{robots[ro.bot_type].name}}</div>
                  <div class="robot-switch">
                    <el-switch
                      v-model="ro.status"
                      size="large"
                      :active-value=activeValue
                      :inactive-value=inactiveValue
                      active-text="开启状态"
                      inactive-text="关闭状态"
                      @change="changeStatus(ro)"
                    />
                  </div>
                </div>
              </template>
              <div>
                <div class="ro-info-line">当前币：{{queryParams.symbol}}</div>
                <div class="ro-info-line">创建时间：{{ro.create_time}}</div>
                <div class="ro-info-line">更新时间：{{ro.update_time}}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else>暂无机器人</div>
      </el-card>
   </div>
</template>
<style lang="scss" scoped>
.ro-item{
  margin-bottom:20px;
}
.ro-info-line{
  margin-bottom:10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
