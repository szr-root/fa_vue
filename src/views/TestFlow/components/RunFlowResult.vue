<template>
  <el-descriptions  border :column="4">
    <el-descriptions-item label="总数">{{ props.results.all }}</el-descriptions-item>
    <el-descriptions-item label="通过" label-class-name="success">{{ props.results.success }}</el-descriptions-item>
    <el-descriptions-item label="失败" label-class-name="fail">{{ props.results.fail }}</el-descriptions-item>
    <el-descriptions-item label="错误" label-class-name="error">{{ props.results.error }}</el-descriptions-item>
  </el-descriptions>

  <el-table :data="props.results.cases" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <Result :result='props.row'></Result>
      </template>
    </el-table-column>

    <el-table-column label="用例名称" prop="name"></el-table-column>
    <el-table-column label="请求方法" prop="method"></el-table-column>
    <el-table-column label="响应状态吗" prop="status_code"></el-table-column>
    <el-table-column label="执行结果" prop="status"></el-table-column>

  </el-table>


</template>

<script setup>
import {defineProps} from 'vue'
import Result from "@/components/Result.vue";

const props = defineProps({
  results: {}
})

console.log(props.results)

</script>


<style scoped lang="scss">
:deep(.success) {
  background: var(--el-color-success-light-9) !important;
}
:deep(.fail) {
  background: var(--el-color-danger-light-9) !important;
}
:deep(.error) {
  background: var(--el-color-error-dark-2) !important;
}


</style>