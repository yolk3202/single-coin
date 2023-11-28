<script setup>
import statusConfig from './statusConfig';
defineOptions({
  name: 'StatusItem',
});
const map = statusConfig.statusMap
const props = defineProps({
  status: {
    type: Number,
    default: 0
  },
})
</script>
<template>
  <el-tag v-if="status === map.open" type="success">OPEN</el-tag>
  <el-tag v-else-if="status === map.closed" type="info">CLOSED</el-tag>
  <el-tag v-else-if="status === map.canceled" type="danger">CANCELED</el-tag>
  <el-tag v-else>unknown</el-tag>
</template>