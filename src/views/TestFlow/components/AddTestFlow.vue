<template>
  <el-tabs :stretch="true">
    <el-tab-pane label="项目接口">
      <el-scrollbar height="calc(100vh - 200px)">
        <el-tree ref="tree1" :data="interfaces1" show-checkbox node-key="id" :props="{children:'cases'}"
                 highlight-current>
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div v-if="data.name" class="case_line">
                <img src="@/assets/icons/icon-api-a.png" :height="20" alt="">
                <b style="color: #00aaff;margin-left: 5px">{{ data.name }}</b>
              </div>

              <div v-if="data.title" class="case_line">
                <img src="@/assets/icons/case.png" alt="" :height="20">
                <span :title="data.title" class="truncate-text">{{ data.title }}</span>
              </div>

            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </el-tab-pane>

    <el-tab-pane label="第三方接口">
      <el-scrollbar height="calc(100vh - 200px)">
        <el-tree ref="tree2" :data="interfaces2" show-checkbox node-key="id" :props="{children:'cases'}"
                 highlight-current>
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <div v-if="data.name" class="case_line">
                <img src="@/assets/icons/icon-api-a.png" :height="20" alt="">
                <b style="color: #00aaff;margin-left: 5px">{{ data.name }}</b>
              </div>
              <div v-if="data.title" class="case_line">
                <img src="@/assets/icons/case.png" alt="" :height="20">
                <span :title="data.title" class="truncate-text">{{ data.title }}</span>
              </div>

            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </el-tab-pane>

  </el-tabs>

  <div class="add-btns">
    <el-tooltip class="item" effect="dark" content="将选择的用例加入到业务流中" placement="top-start">
      <el-button type="primary" size="small" plain @click="addToFlow">确认添加</el-button>
    </el-tooltip>
  </div>
</template>


<script setup>
import {ProjectStore} from '@/stores/module/ProStore'
import {storeToRefs} from 'pinia'
import http from '@/api/index';
import {ref} from "vue";
import {ElNotification} from "element-plus";

const proStore = ProjectStore()
const proStoreRef = storeToRefs(proStore)
const interfaces1 = proStoreRef.interfaces1
const interfaces2 = proStoreRef.interfaces2

const tree1 = ref({})
const tree2 = ref({})

function get_checked_nodes() {
  const checkedNodes1 = tree1.value.getCheckedNodes()
  const checkedNodes2 = tree2.value.getCheckedNodes()
  const Nodes = [...checkedNodes1, ...checkedNodes2]
  // console.log(Nodes)
  //过滤选中的接口
  const result = Nodes.filter(item => {
    return item.title;
  })
  return result
}

const props = defineProps(['cases', 'flow'])
const emit = defineEmits(['refreshCase'])

async function addToFlow() {
  const checkedCase = get_checked_nodes();
  
  // 检查已存在的用例ID，避免重复添加
  const existingCaseIds = props.cases.map(caseItem => caseItem.icase.id);
  const newCases = checkedCase.filter(item => !existingCaseIds.includes(item.id));
  
  if (newCases.length === 0) {
    ElNotification({
      type: 'warning',
      title: '提示',
      message: '选择的用例已存在于当前业务流中',
      duration: 2000
    });
    return;
  }
  
  let orders = props.cases.length;
  let successCount = 0;
  
  for (let i = 0; i < newCases.length; i++) {
    const item = newCases[i];
    orders += 1;
    const data = {
      icase: item.id,
      flow: props.flow.id,
      sort: orders
    }
    const response = await http.flow.addFlowCaseApi(data)
    if (response.status === 201) {
      successCount++;
      ElNotification({
        type: 'success',
        title: '添加成功',
        message: `用例-${item.title} 添加成功`,
        duration:2000
      })
    }else{
      ElNotification({
        type: 'error',
        title: '添加失败',
        message: `用例-${item.title} 添加失败`,
        duration:2000
      })
    }
  }
  
  // 如果有成功添加的用例，刷新列表
  if (successCount > 0) {
    emit('refreshCase')
  }
}
</script>


<style scoped lang="scss">
.case_line {
  display: flex;
  align-items: center;
}

.truncate-text {
  display: inline-block;
  max-width: 80%; /* 根据实际情况调整最大宽度 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>