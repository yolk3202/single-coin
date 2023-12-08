<script setup>
let props = defineProps({
  data: {
    type: Object,
    default: () => { }
  },
  detailInfo: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="log-detail-wrap" v-if="data ">
    <el-card shadow="never">
      <div class="detail-item" v-for="detail in detailInfo" :key="detail.prop">
        <div class="detail-item-label">{{ detail.label }}：</div>
        <div class="detail-item-value">
          <span v-if="detail.type==='text'">{{ data[detail.prop] }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.log-detail-wrap{
  .detail-item{
    display: flex;
    margin-bottom: 10px;
    .detail-item-label{
      width: 100px;
      text-align: right;
      margin-right: 10px;
      color: #999;
    }
    .detail-item-value{
      flex: 1;
      span{
        color: #333;
      }
    }
  }
}
</style>
