<template>
  <div class="main_box">

    <el-row>
      <el-col :span="4">
        <div class="left_box card">
          <!-- 顶部标题 -->
          <div class="title_box">
            <img src="@/assets/icons/data.png" width="25">
            <div class="name">测试环境</div>
            <el-button size="small" icon='CirclePlus' plain>添加</el-button>
          </div>

          <!-- 环境列表 -->
          <el-menu>
            <el-menu-item :index="item.id.toString()" v-for='item in pstore.envList'
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

          <el-affix offset="50" position="bottom">
            <div class="btns">
              <el-button type="primary" size="small">保存编辑</el-button>
              <el-button type="primary" size="small">复制环境</el-button>
              <el-button type="danger" size="small">删除环境</el-button>
            </div>
          </el-affix>

        </div>
      </el-col>
      <el-col :span="10">
        <div class="right_box card"></div>
      </el-col>
    </el-row>

  </div>

</template>

<script setup>
import {ProjectStore} from "@/stores/module/ProStore.js";
import {ref} from "vue";
import Editor from '/src/components/Editor.vue'

const pstore = ProjectStore()

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


}

</style>