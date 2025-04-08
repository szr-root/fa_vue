<template>
  <div class="main_box">

    <el-row>
      <el-col :span="4">
        <div class="left_box card">
          <!-- 顶部标题 -->
          <div class="title_box">
            <img src="@/assets/icons/data.png" width="25">
            <div class="name">测试环境</div>
            <el-button @click="addEnv" size="small" icon='CirclePlus' plain>添加</el-button>
          </div>

          <!-- 环境列表 -->
          <el-menu :default-active="EnvInfo.id+''">
            <el-menu-item @click='selectEnv(item)' :index="item.id.toString()" v-for='item in pstore.envList'
                          :key="item.id">
              <img src="@/assets/icons/data.png" width="20" style="margin-right: 10px;">
              <span>{{ item.name }}</span>
            </el-menu-item>
          </el-menu>

        </div>
      </el-col>
      <el-col :span="10">
        <div class="center_box card">
          <el-divider content-position="left">
            <span class="info_text"> 基本信息 </span>
          </el-divider>
          <el-input v-model="env_name" placeholder="环境名称">
            <template #prepend>环境名称</template>
          </el-input>
          <el-input v-model="env_host" placeholder="BaseURL" style="margin-top: 5px;">
            <template #prepend>BaseURL</template>
          </el-input>

          <el-divider content-position="left"><span class="info_text">请求头/数据库</span></el-divider>
          <el-tabs type="border-card">
            <el-tab-pane label="全局请求头">
              <Editor lang="json" v-model="env_headers"></Editor>
            </el-tab-pane>
            <el-tab-pane label="数据库配置">
              <Editor lang="json" v-model="env_db"></Editor>
            </el-tab-pane>
          </el-tabs>
          <el-divider content-position="left"><span class="info_text"> 全局变量</span></el-divider>
          <el-tabs type="border-card">
            <el-tab-pane label="全局变量">
              <Editor lang="json" v-model="env_global_variable"></Editor>
            </el-tab-pane>
            <el-tab-pane label="调试运行变量">
              <Editor lang="json" v-model="env_debug_global_variable"></Editor>
            </el-tab-pane>
          </el-tabs>

          <el-affix :offset="50" position="bottom">
            <div class="btns">
              <el-button @click="saveEnv" type="primary" size="small">保存编辑</el-button>
              <el-button @click='copyEnv' type="primary" size="small">复制环境</el-button>
              <el-button @click='clickDeleteEnv' type="danger" size="small">删除环境</el-button>
            </div>
          </el-affix>

        </div>
      </el-col>
      <el-col :span="10">
        <div class="right_box card">
          <el-divider content-position="left">全局工具函数</el-divider>
          <Editor lang="python" v-model="env_global_func" height='calc(100% - 50px)'></Editor>
        </div>
      </el-col>
    </el-row>

  </div>

</template>

<script setup>
import http from '@/api/index'
import {ProjectStore} from "@/stores/module/ProStore.js";
import {ref, onMounted} from "vue";
import Editor from '/src/components/Editor.vue'
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'


let envList = ref([])
const pstore = ProjectStore()


onMounted(async () => {
  await pstore.getEnvList()
  envList.value = pstore.envList
  // 组件上数据挂载完毕之后，设置一个默认选中的测试环境
  if (envList.value.length > 0) {
    selectEnv(envList.value[0])
  }
})


async function addEnv() {
  console.log(envList.value)
  const response = await http.pro.createEnvApi({
    project: pstore.pro.id,
    name: "new Env",
    host: "http://127.0.0.1"
  })
  if (response.status === 201) {
    // 给出提示
    ElNotification({
      title: '测试环境创建成功',
      type: 'success',
    })
    // 更新页面数据
    pstore.getEnvList()
    envList.value = pstore.envList
  }
}

// ==============页面数据==============
let env_name = ref('')
let env_host = ref('')
let env_headers = ref('{}')
let env_db = ref('[]')
let env_global_variable = ref('{}')
let env_debug_global_variable = ref('{}')
let env_global_func = ref('')

// 保存当前选择的测试环境
let EnvInfo = ref({})

function selectEnv(env) {
  // 保存当前选中的测试环境
  EnvInfo.value = env
  // 更新页面上编辑数据的值
  env_name.value = env.name
  env_host.value = env.host
  env_headers.value = JSON.stringify(env.headers, 0, 4) || "{}"
  env_db.value = JSON.stringify(env.db, 0, 4) || "[]"
  env_global_variable.value = JSON.stringify(env.global_variable, 0, 4) || "{}"
  env_debug_global_variable.value = JSON.stringify(env.debug_global_variable, 0, 4) || "{}"
  env_global_func.value = env.global_func
}

//删除环境
function clickDeleteEnv() {
  ElMessageBox.confirm(
      '此操作不可恢复，确认要删除该测试环境?',
      '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        const response = await http.pro.deleteEnvApi(EnvInfo.value.id)
        if (response.status === 204) {
          // 提示
          ElNotification({
            title: '删除成功',
            type: 'success',
          })
          // 更新页面数据
          pstore.getEnvList()
          envList.value = pstore.envList
          // 重新设置一个选中的测试环境
          if (envList.value.length > 0) {
            selectEnv(envList.value[0])
          }

        }
      })
}

//复制测试环境
async function copyEnv() {
  const params = EnvInfo.value
  params.name = params.name + 'Copy'
  const response = await http.pro.createEnvApi(params)
  if (response.status === 201) {
    // 给出提示
    ElNotification({
      title: '复制成功',
      type: 'success',
    })
    // 更新页面数据
    pstore.getEnvList()
    envList.value = pstore.envList
  }
}


// 保存环境
async function saveEnv() {
  const env_id = EnvInfo.value.id
  // 修改时传递的参数
  const params = {
    name: env_name.value,
    host: env_host.value,
    global_func: env_global_func.value,
    db: JSON.parse(env_db.value),
    headers: JSON.parse(env_headers.value),
    global_variable: JSON.parse(env_global_variable.value),
    debug_global_variable: JSON.parse(env_debug_global_variable.value),
  }
  const response = await http.pro.updateEnvApi(env_id, params)
  if (response.status === 200) {
    // 给出提示
    ElNotification({
      title: '保存成功',
      type: 'success',
    })
    // 更新页面数据
    pstore.getEnvList()
  }
}


</script>

<style lang="scss" scoped>
.main_box {
  height: 100%;
  width: 100%;

  //左侧
  .left_box {
    height: 100%;

    .title_box {
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: center;
      border-bottom: solid 1px #6a6a6a;

      .name {
        font-weight: bold;
        font-size: 18px;
        margin: 0 10px;
      }
    }

    .el-menu {
      border: none;

      .el-menu-item {
        height: 40px;
        line-height: 40px;
      }
    }
  }


  // 中间样式
  .center_box {
    //width: 500px;

    .btns {
      text-align: center;
    }

  }

  //右侧样式
  .right_box {
    height: 100%;
  }


}

</style>