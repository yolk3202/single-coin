<script setup>
import { reactive, ref, onMounted } from 'vue';
import robotModel from './model';
import robotSystemApi from '@/api/robotSystem';

let robots = reactive({...robotModel.robots})

let queryParams = reactive({
  symbol: "",
});
let coinList = ref([]); // 币种列表

function changeSymbol() {
  // 获取当前 机器人配置
  getRobotList();
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

// 币种
function getCoinList() {
  robotSystemApi.getCoinTypeList().then((res) => {
    const { code, data, message } = res;
    coinList.value = data || [];
    data.includes("BTKUSDT") ? queryParams.symbol = "BTKUSDT" : queryParams.symbol = data[0];
    getRobotList();
  });
}

function getRobotList() {
  const keys = Object.keys(robots);
  keys.forEach(item => robots[item].loading = true)
  const promise = keys.map(item => robotSystemApi.getCurRobotConfig({
      symbol: queryParams.symbol,
      bot_type: item,
    })
  );

  Promise.all(promise)
    .then(res => {
      console.log('res====>', res);
      res.forEach((item, index) => {
        console.log(item, index)
        if(item.code !== 200) {
          ElMessage.error({
            message: `${robots[keys[index]].name}, ${item.message || '获取机器人配置失败'}`
          })
          return;
        }
        robots[keys[index]].status = item.data.status?true:false;
        robots[keys[index]].create_time = item.data.create_time;
        robots[keys[index]].update_time = item.data.update_time;
      });
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      keys.forEach(item => robots[item].loading = false)
    })
}

onMounted(()=>{
  // 请求接口
  getCoinList()
})
</script>
<template>
   <div class="app-container">
      <div class="search-container">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item label="币种" prop="status">
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
      </div>
      <el-card shadow="never">
        <el-row :gutter="20">
          <el-col class="ro-item" :md="12" :sm="12" :xs="24" :lg="8" v-for="ro in robots" :key="ro.value">
            <el-card shadow="hover" >
              <template #header>
                <div class="card-header">
                  <span>{{ro.name}}</span>
                  <el-switch
                    v-model="ro.status"
                    size="large"
                    active-text="开启状态"
                    inactive-text="关闭状态"
                    :loading="ro.loading"
                    @change="changeStatus(ro)"
                  />
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
