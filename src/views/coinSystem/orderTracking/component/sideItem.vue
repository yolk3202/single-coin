<script setup>
import statusConfig from './statusConfig';
defineOptions({
  name: 'StatusItem',
});
const map = statusConfig.sideMap
const props = defineProps({
  status: {
    type: Number,
    default: 0
  },
})
</script>
<template>
  <el-tag v-if="status === map.sell" type="success">{{map.sell}}</el-tag>
  <el-tag v-else-if="status === map.buy" type="danger">{{map.buy}}</el-tag>
  <el-tag v-else>unknown</el-tag>
</template>