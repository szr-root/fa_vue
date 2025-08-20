<template>
  <el-card title="任务列表">
    <el-button @click="clickCreate" icon="Plus" type="primary" style="margin-bottom: 10px">创建定时任务</el-button>
    <el-table :data="cronJobList" border style="width: 100%">
      <el-table-column prop="create_time" label="创建时间" width="150px"/>
      <el-table-column prop="name" label="定时任务名称"/>
      <el-table-column prop="task" label="执行任务"/>
      <el-table-column prop="env" label="执行环境"/>
      <el-table-column label="调度器类型">
        <template #default="scope">
          <span v-if="scope.row.run_type ==='date'"> 指定时间执行 </span>
          <span v-else-if="scope.row.run_type ==='Interval'">间隔时间执行</span>
          <span v-else>周期执行</span>
        </template>
      </el-table-column>


      <el-table-column prop="crontab" label="调度策略" width="240" show-overflow-tooltip>
        <template #default="scope">
            <span v-if="scope.row.run_type ==='date'">
              指定时间: {{ scope.row.date }}
            </span>
          <span v-else-if="scope.row.run_type ==='Interval'">
              间隔 {{ scope.row.interval }} 秒执行
            </span>
          <span v-else>
              Cron表达式:
              <span>{{ scope.row.crontab.minute + ' ' }}</span>
              <span>{{ scope.row.crontab.hour + ' ' }}</span>
              <span>{{ scope.row.crontab.day + ' ' }}</span>
              <span>{{ scope.row.crontab.month + ' ' }}</span>
              <span>{{ scope.row.crontab.day_of_week + ' ' }}</span>
            </span>
        </template>
      </el-table-column>

      <el-table-column prop="state" label="状态" width="85px">
        <template #default="scope">
          <el-switch
              v-model="scope.row.state"
              class="custom-switch"
              inline-prompt
              active-text="运行中"
              inactive-text="已停止"
              @change="updateCronStatus(scope.row.id)"
          />
        </template>
      </el-table-column>


      <el-table-column label="操作" width="200px">
        <template #default="scope">
          <el-button icon="Edit" type="info" plain @click="clickEdit(scope.row)">
            编辑
          </el-button>
          <el-button icon="Delete" type="danger" plain @click="deleteCronTask(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>


  <el-dialog v-model="isDlgShow" width="45%">
    <template #header>
      <div class="dialog-header" style="text-align: center">
        {{ dlgTitle }}
      </div>
    </template>
    <el-form :model="cronInfo">
      <el-form-item label="定时任务名称" label-width="100px">
        <el-input v-model="cronInfo.name" autocomplete="off"/>
      </el-form-item>

      <el-form-item label="执行测试环境" label-width="100px">
        <el-select v-if="dlgTitle==='创建定时任务'" v-model="cronInfo.env_id" autocomplete="off"
                   placeholder="选择执行环境">
          <el-option v-for="env in pstore.envList" :label="env.name" :key="env.id" :value="env.id"/>
        </el-select>
        <el-select v-else v-model="cronInfo.env" autocomplete="off" placeholder="选择执行环境"
                   :disabled="true"/>
      </el-form-item>

      <el-form-item label="执行的任务" label-width="100px">
        <el-select v-if="dlgTitle==='创建定时任务'" v-model="cronInfo.task_id" autocomplete="off"
                   placeholder="选择任务">
          <el-option v-for="task in pstore.taskList" :label="task.name" :key="task.id" :value="task.id"/>
        </el-select>
        <el-select v-else v-model="cronInfo.task" autocomplete="off" placeholder="选择任务" :disabled="true"/>


      </el-form-item>

      <el-form-item label="是否启用" label-width="100px">
        <el-switch v-model="cronInfo.state" class="custom-switch" active-text="启用" inactive-text="禁用"/>
      </el-form-item>

      <el-form-item label="调度类型" label-width="100px">
        <el-select v-model="cronInfo.run_type" placeholder="选择调度类型">
          <el-option label="指定时间执行" value="date"/>
          <el-option label="间隔时间执行" value="Interval"/>
          <el-option label="周期执行" value="crontab"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="cronInfo.run_type === 'date'" label="执行时间" label-width="100px">
        <el-date-picker
            v-model="cronInfo.date"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY/MM/DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="间隔时间" label-width="100px" v-if="cronInfo.run_type === 'Interval'">
        <el-input-number v-model="cronInfo.interval" :min="1" :max="1000000" label="间隔时间（秒）"/>
      </el-form-item>


      <el-form-item label="周期时间" label-width="100px" v-if="cronInfo.run_type === 'crontab'">
        <el-row :gutter="5">
          <el-col :span="5">
            <el-input v-model="cronInfo.crontab.minute" placeholder="分钟">
              <template #prepend>分钟</template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="cronInfo.crontab.hour" placeholder="时">
              <template #prepend>时</template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="cronInfo.crontab.day" placeholder="天">
              <template #prepend>天</template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="cronInfo.crontab.month" placeholder="月">
              <template #prepend>月</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="cronInfo.crontab.day_of_week" placeholder="星期">
              <template #prepend>星期</template>
            </el-input>
          </el-col>


        </el-row>
      </el-form-item>


    </el-form>

    <div class="dialog-footer">
      <el-button @click="isDlgShow = false">取 消</el-button>
      <el-button type="primary" v-if="dlgTitle==='创建定时任务'" @click="createCron">确 认</el-button>
      <el-button type="primary" v-else @click="updateCron">确 认</el-button>
    </div>

  </el-dialog>


</template>


<script setup>
import http from '@/api/index'
import {ref} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {ProjectStore} from '@/stores/module/ProStore'
import {UserStore} from '@/stores/module/UserStore.js'

const cronJobList = ref([])
const pstore = ProjectStore()
const ustore = UserStore()
const isDlgShow = ref(false)

async function getCronList() {
  const response = await http.task.getCronListApi(pstore.pro.id)
  if (response.status === 200) {
    cronJobList.value = response.data
  }
}

getCronList()

async function updateCronStatus(id) {
  const response = await http.task.updateCronApi(id)
  if (response.status === 200) {
    ElMessage({
      type: 'success',
      message: `状态修改成功`,
    })
    await getCronList()
  }
}


function deleteCronTask(id) {
  ElMessageBox.confirm('此操作将永久删除该定时任务, 是否继续?', '提示', {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    type: 'warning',
  })
      .then(async () => {
        const response = await http.task.deleteCronApi(id)
        if (response.status === 204) {
          ElMessage({
            type: 'success',
            message: `定时任务删除成功`,
          })
          await getCronList()
        } else {
          ElMessage({
            type: 'error',
            message: `删除失败。` + response.data.detail,
          })
        }
      })
}

//========== 定时任务添加 ==============
const dlgTitle = ref('创建定时任务')

const cronInfo = ref({
  name: '',
  task_id: null,
  env_id: null,
  run_type: null,
  date: '',
  interval: 3600,
  crontab: {
    minute: '30',
    hour: '*',
    day: '*',
    month: '*',
    day_of_week: '*',
  },
  state: true,
  project: pstore.pro.id,
  tester: ustore.userinfo.username
})

function clickCreate() {
  dlgTitle.value = "创建定时任务"
  cronInfo.value = {
    name: '',
    task_id: null,
    env_id: null,
    run_type: null,
    date: '',
    interval: 3600,
    crontab: {
      minute: '30',
      hour: '*',
      day: '*',
      month: '*',
      day_of_week: '*',
    },
    state: true,
    project_id: pstore.pro.id,
    tester: ustore.userinfo.username
  }
  isDlgShow.value = true
}

function clickEdit(cron) {
  console.log(cron)
  console.log({...cron})
  dlgTitle.value = "修改定时任务"
  cronInfo.value = {...cron}
  isDlgShow.value = true

}

async function createCron() {
  const params = {
    name: cronInfo.value.name,
    run_type: cronInfo.value.run_type,
    date: cronInfo.value.date,
    interval: cronInfo.value.interval,
    crontab: cronInfo.value.crontab,
    project: pstore.pro.id,
    task: cronInfo.value.task_id,
    env: cronInfo.value.env_id,
    state: cronInfo.value.state,
    tester: cronInfo.value.tester
  }
  const response = await http.task.createCronApi(params)
  if (response.status === 201) {
    ElMessage({
      type: 'success',
      message: `定时任务创建成功`,
    })
    await getCronList()
    isDlgShow.value = false
  }
}

async function updateCron() {
  const params = {
    name: cronInfo.value.name,
    run_type: cronInfo.value.run_type,
    date: cronInfo.value.date,
    interval: cronInfo.value.interval,
    crontab: cronInfo.value.crontab,
  }
  const response = await http.task.updateCronConfigApi(cronInfo.value.id, params)
  if (response.status === 200) {
    ElMessage({
      type: 'success',
      message: `定时任务修改成功`,
    })
    isDlgShow.value = false
    await getCronList()
  }
}


</script>

<style scoped>
.custom-switch :deep(.el-switch__core .is-active) {
  --el-switch-on-color: #13ce66;
}

.custom-switch :deep(.el-switch__core) {
  --el-switch-off-color: var(--el-switch-off-color);
}

/* 修改开关文字颜色 */
.custom-switch :deep(.el-switch__label span) {
  color: white;
}

</style>