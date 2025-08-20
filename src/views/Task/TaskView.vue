<template>
  <div class="main_box">
    <div class="card left_box">
      <!--顶部标题-->
      <div class="title_box">
        <img src="@/assets/icons/repair.png" :width="25" alt="">
        <div class="name">测试任务</div>
        <el-button @click="AddTask" size="small" icon="CirclePlus" plain>添加</el-button>
      </div>
      <!--下方列表-->
      <el-menu :default-active="activeTask.id.toString()">
        <el-menu-item @click="selectTask(item)" :index="item.id.toString()" v-for="item in TaskList"
                      key="item.id">
          <img src="@/assets/icons/repair.png" :width="20" alt=""><span style="margin-right: 10px"></span>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="card right_box">
      <!--顶部展示-->
      <div class="card">
        <el-divider content-position="left"><b>基本信息</b></el-divider>
        <el-row :gutter="5" style="margin-bottom: 20px;padding: 0 20px;" v-if="activeTask">
          <el-col :span="16">
            <el-input v-model="activeTask.name" size="small">
              <template #prepend>
                任务名称
              </template>
              <template #append>
                <el-button @click="saveTask" plain size="small" type="primary" icon="CircleCheck">保存</el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="8" style="text-align: right;padding-right:10px;">
            <el-button @click="runTask" plain size="small" type="primary" icon="Promotion">运行</el-button>
            <el-button @click="deleteTask" plain size="small" type="danger" icon="Delete">删除</el-button>
          </el-col>
        </el-row>
      </div>


      <!--任务中的业务流列表展示 -->
      <div class="card" style="margin-top: 10px">
        <el-divider content-position="left">任务中包含的业务流</el-divider>
        <el-table :data="flowList" row-key="id" :show-header="false" class="no-border-table">
          <el-table-column>
            <template #default="scope">
            <span class="el-icon-s-help" style="color: #17abe3;font-weight: bold;font-size: 14px;">
              {{ '业务流' + (scope.$index + 1) + ': ' }}
            </span>
              <span style="font-weight: bold;font-size: 14px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column width="90px">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeFlow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="small" icon="Plus" plain type="primary" @click="clickAddFlow"
                   style="margin-left: 10px;margin-bottom: 10px">添加业务流
        </el-button>
      </div>

      <TaskResult :results="records"></TaskResult>

      <!--添加业务流弹窗-->
      <el-drawer direction="rtl" size="20%" :show-close="false" v-model="addFlowDlg" title="添加业务流">
        <template #header>添加测试流程</template>
        <div class="select_content">
          <el-table ref="addRef" @selection-change="selectFlows" size="small" :data="Flows()" tooltip-effect="dark"
                    style="width: 100%">
            <el-table-column type="selection" min-width="40"></el-table-column>
            <el-table-column prop="name" label="全选" min-width="120"></el-table-column>
          </el-table>
        </div>
        <div style="margin: 10px;text-align: center">
          <el-tooltip class="item" effect="dark" content="将选中流程添加到任务中" placement="top-start">
            <el-button type="success" size="small" @click="addFlowToTask">确认添加</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="清除选中" placement="top-start">
            <el-button type="warning" plain size="small" @click="addRef.clearSelection()">清除选中</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="关闭窗口" placement="top-start">
            <el-button plain type="danger" size="small" @click="addFlowDlg=false">取消</el-button>
          </el-tooltip>
        </div>
      </el-drawer>

    </div>


  </div>
</template>

<script setup>
import http from '@/api/index.js'
import {onMounted, reactive, ref} from "vue";
import {ProjectStore} from '@/stores/module/ProStore.js'
import {UserStore} from '@/stores/module/UserStore.js'
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import TaskResult from "@/views/Task/components/TaskResult.vue";


const proStore = ProjectStore()
const userStore = UserStore()

const TaskList = ref([])
const activeTask = reactive({
  id: '',
  name: '',
  flow: []
})

//创建任务
async function AddTask() {
  let params = {
    name: '新建任务',
    project: proStore.pro.id,
    flow: []
  }
  const response = await http.task.createTaskApi(params)
  if (response.status === 201) {
    ElNotification({
      title: '任务创建成功',
      type: 'success',
      duration: 2000
    })
    await getTaskList()
    await selectTask(response.data)
  }
}

//保存修改任务名
async function saveTask() {
  let params = {...activeTask}
  const response = await http.task.updateTaskApi(activeTask.id, params)
  if (response.status === 200) {
    ElNotification({
      title: '任务修改成功',
      type: 'success',
      duration: 2000
    })
    await getTaskList()
  }
}

//删除任务
async function deleteTask() {
  ElMessageBox.confirm('删除操作不可恢复！', '确定删除？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const response = await http.task.deleteTaskApi(activeTask.id)
    if (response.status === 204) {
      ElNotification({
        title: '删除成功',
        type: 'success',
        duration: 2000
      })
      await getTaskList()

      if (TaskList.value.length > 0) {
        console.log('>0')
        await selectTask(TaskList.value[0])
      }
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消删除',
      duration: 1000
    })
  })

}

// 获取所有任务列表
async function getTaskList() {
  const response = await http.task.getTaskListApi(proStore.pro.id)
  if (response.status === 200) {
    TaskList.value = response.data
    proStore.taskList = TaskList.value
  }
}

const flowList = ref([])

// 获取当前任务中的业务流
async function getTaskInfo() {
  const response = await http.task.getTaskInfoApi(activeTask.id)
  if (response.status === 200) {
    flowList.value = response.data.flow
  }
}

//选中任务
async function selectTask(item) {
  activeTask.id = item.id
  activeTask.name = item.name
  activeTask.flow = item.flow
  // 请求任务详情
  await getTaskInfo()
  //获取记录
  await getRecords()
}

onMounted(() => {
  getTaskList()
})

//向任务中增加业务流
const addFlowDlg = ref(false)
const flows = proStore.flows
const addRef = ref()
const addFlowList = ref([])

function Flows() {
  return flows.filter(item => {
    return !flowList.value.find(item2 => {
      return item2.id === item.id
    })
  })
}

//选中内容，id添加到addFlowList中
function selectFlows(val) {
  // console.log('val:::', val)
  val.forEach(item => {
    if (!addFlowList.value.includes(item.id)) {
      addFlowList.value.push(item.id);
    }
  })
  // 清空选中的情况
  if (val.length === 0) {
    addFlowList.value = []
  }
  // console.log(addFlowList.value)
}

// 添加业务流到任务中
async function addFlowToTask() {
  let params = {...activeTask}
  params.flow.push(...addFlowList.value)
  console.log(params)
  addFlowList.value = []
  const response = await http.task.updateTaskApi(params.id, params)
  if (response.status === 200) {
    ElNotification({
      title: '添加成功',
      type: 'success',
    })
    await getTaskInfo()
  }
}

async function clickAddFlow() {
  addFlowDlg.value = true
  addFlowList.value = []
}


// 从任务中移除业务流
async function removeFlow(flow_id) {
  console.log(flow_id)
  let params = {...activeTask}
  params.flow = params.flow.filter(item => item !== flow_id)
  // console.log(params)

  const response = await http.task.updateTaskApi(params.id, params)
  if (response.status === 200) {
    ElNotification({
      title: '移除成功',
      type: 'success',
    })
    await getTaskInfo()
  }
}

//运行任务
async function runTask() {
  if (proStore.env) {
    const params = {
      env: proStore.env,
      task: activeTask.id,
      tester: userStore.userinfo.username
    }
    console.log(params)
    ElMessage({
      message: '正在执行任务中，请稍后查看结果...',
      type: 'success',
      duration: 2000
    })
    const response = await http.run.runTaskApi(params)
    if (response.status !== 200) {
      ElNotification({
        title: '提示',
        message: response.data.message,
        duration: 2000
      })
    }

  } else {
    ElMessage({
      message: '请先选择运行环境',
      type: 'warning',
      duration: 2000
    })
  }
}

const records = ref([])

//获取运行记录
async function getRecords() {
  const response = await http.task.getRecordsApi({task: activeTask.id})
  if (response.status === 200) {
    records.value = response.data
    console.log(records.value)
  }
}

</script>


<style scoped lang="scss">
.main_box {
  height: calc(100% - 42px);
  display: flex;

  .left_box {
    width: 200px;

    .title_box {
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: center;
      border-bottom: solid 1px #00acc1;
    }

    .name {
      font-weight: bold;
      font-size: 18px;
      margin: 0 10px;
    }

    .el-menu {
      border: none;

      .el-menu-item {
        height: 50px;
        line-height: 50px;
      }
    }

  }

  .right_box {
    flex: 1;
    padding: 10px;

    .name_edit {
      display: flex;

      .btns {
        width: 200px;
        text-align: center;
      }
    }

    .no-border-table {
      border: none;
      width:100%;
      margin-bottom:10px;

      :deep(.el-table__row) {
        td {
          border: none;
        }
      }

      :deep(.el-table__header-wrapper) {
        th {
          border: none;
        }
      }

      :deep(.el-table__body-wrapper) {
        tr {
          border: none;
        }
      }
    }

  }
}
</style>