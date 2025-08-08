<template>
<div class="card" style="margin-top: 10px">
  <el-divider content-position="left">执行记录</el-divider>
  <el-table :data="props.results" class="table-style" size="small" border>
    <el-table-column prop="create_time" label="执行时间" min-width="140" align="center">
      <template #default="scope">
        {{ scope.row.create_time }}
      </template>
    </el-table-column>
    <el-table-column prop="env_name" label="执行环境" min-width="110" align="center">
      <template #default="scope">
        {{ scope.row.env }}
      </template>
    </el-table-column>
    <el-table-column prop="all" label="总用例" min-width="50" align="center">
      <template #default="scope">
       <span v-if="scope.row.status !== '执行中'">{{scope.row.all}}</span>
      </template>
    </el-table-column>
    <el-table-column  label="通过数" min-width="50" align="center">
      <template #default="scope">
        <span v-if="scope.row.status !== '执行中'">{{scope.row.success}}</span>
      </template>
    </el-table-column>
    <el-table-column  label="通过率" min-width="80" align="center">
      <template #default="scope">
        <span v-if="scope.row.status !== '执行中'">{{scope.row.pass_rate + '%'}}</span>
      </template>
    </el-table-column>
    <el-table-column  label="总耗时" min-width="80" align="center">
      <template #default="scope">
        <span v-if="scope.row.status !== '执行中'">{{scope.row.run_time}}</span>
      </template>
    </el-table-column>
    <el-table-column  label="执行人" min-width="80" align="center">
      <template #default="scope">
        <span v-if="scope.row.status !== '执行中'">{{scope.row.tester}}</span>
      </template>
    </el-table-column>

    <el-table-column label="测试报告" min-width="100" align="center">
      <template #default="scope">
        <span v-if="scope.row.status === '执行中'" >
          <el-tag>{{scope.row.status}}...</el-tag>
        </span>
        <el-button v-else type="primary" icon="View" plain size="small"
                   @click="$router.push({name:'report',params:{id:scope.row.id}})">
          报告
        </el-button>
      </template>
    </el-table-column>>

  </el-table>
</div>
</template>

<script setup>
import {defineProps,watch} from 'vue'

const props = defineProps(['results'])

watch(()=>props.results,()=>{console.log('results:::',props.results)})
</script>


<style scoped lang="scss">

</style>