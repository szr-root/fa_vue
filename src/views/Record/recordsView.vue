<template>
  <div class="main">
    <!-- 渲染图标的元素 -->
    <div>
      <div style="margin-bottom: 10px;">
        <label>X轴选择: </label>
        <select @change="changeXAxis" v-model="selectedXAxis">
          <option value="create_time">时间</option>
          <option value="task">任务名称</option>
          <option value="env">测试环境</option>
        </select>
      </div>
      <div id="chat_pro_record" class="box1"></div>
    </div>

    <!-- 渲染表格的组件 -->
    <el-table :data="recordList" border style="width: 100%" size="small">
      <el-table-column label="执行时间" prop="create_time" min-width="180"/>
      <el-table-column prop="env" label="执行环境"/>
      <el-table-column prop="task" label="测试计划"/>
      <el-table-column prop="all" label="总用例"/>
      <el-table-column prop="success" label="通过数"/>
      <el-table-column prop="pass_rate" label="通过率"/>
      <el-table-column label="测试报告" width="180">
        <template #default="scope">
          <el-button @click="showReport(scope.row)" icon="View" type="primary" plain
                     size="small">查看报告
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ProjectStore } from '@/stores/module/ProStore'
import mychat from '@/utils/chart.js'
import http from '@/api/index'
import { ref, onMounted,onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// 存储项目的执行记录
let recordList = ref([])
let chartInstance = null;

const selectedXAxis = ref('create_time');

const proStore = ProjectStore()

// 获取项目的所有测试执行记录
const getRecords = async function () {
  const response = await http.task.getRecordsApi({
    project: proStore.pro.id
  })
  recordList.value = response.data
  showChat()
}

const showChat = function () {
  console.log("recordList.value", recordList.value)
  const dom = document.getElementById('chat_pro_record')

  // 销毁之前的图表实例
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 创建新的图表实例
  chartInstance = mychat.chart4(dom, recordList.value)
}

// X轴切换处理
function changeXAxis() {
  if (chartInstance && chartInstance.changeXAxis) {
    chartInstance.changeXAxis(selectedXAxis.value);
  }
}

function showReport(record) {
  router.push({
    name: "report",
    params: {
      id: record.id
    }
  })
}

onMounted(() => {
  getRecords()
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
})
</script>

<style scoped lang="scss">
.box1 {
  height: 260px;
  background: #282828;
  margin-bottom: 10px;
}

.main {
  padding: 10px;
}
</style>
