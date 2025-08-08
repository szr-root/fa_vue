<template>
  <div class="main_box">
    <div class="left_box card">
      <div class="title_box">
        <img src="@/assets/icons/liucheng.png" :width="25" alt="">
        <div class="name">测试业务流</div>
        <el-button type="primary" plain @click="clickAddFlow" size="small" icon="CirclePlus">添加</el-button>
      </div>

      <el-menu :default-active="activeFlow.id+''">
        <el-menu-item @click="selectFlow(item)" :index="item.id.toString()" v-for="item in flowList"
                      key="item.id">
          <img src="@/assets/icons/liucheng.png" :width="20" alt="">
          <span style="margin-left: 5px">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>

    </div>

    <div class="right_box card">
      <!--右侧顶部-->
      <el-card style="background: none;">
        <el-divider content-position="left">业务流信息</el-divider>
        <div class="name_edit">
          <el-input v-model="activeFlow.name" placeholder="请输入业务流名称">
            <template #prepend>
              业务流名称
            </template>
          </el-input>
          <div class="btns">
            <el-button type="primary" @click="saveFlow" icon="CopyDocument">保存</el-button>
            <el-button type="primary" @click="runFlow" icon="Promotion">运行</el-button>
            <el-button type="primary" @click="deleteFlow" icon="Delete">删除</el-button>
          </div>
        </div>
      </el-card>

      <!--右侧下方-->
      <el-card style="background: none;margin-top: 5px;">
        <el-divider content-position="left">业务流中用例步骤</el-divider>
        <draggable v-model="flowCaseList" item-key="id"
                   chosen-class="dragging"
                   class="item-list"
                   ghost-class="ghost"
                   handle=".step_name"
                   @sort="updateSort"
        >
          <template #item="{ element }">
            <div class="drag-item">
              <div class="step_name" style="display: flex; align-items: center;">
                <img src="@/assets/icons/case.png" :width="20" style="margin-right: 5px;" alt="">
                <span style="color: #00aaff;font-weight: bold;margin-right: 5px;">步骤{{ element.sort }}: </span>
                <span>{{ element.icase.title }}</span>
              </div>

              <div style="margin-left: auto;margin-right: 20px">
                <el-button type="primary" plain @click="clickEditCase(element.icase.id)" size="small"
                           icon="Edit"></el-button>
                <el-button type="danger" plain @click="deleteFlowCase(element.id)" size="small"
                           icon="Delete"></el-button>
              </div>

            </div>
          </template>
        </draggable>
        <el-button type="primary" plain @click="clickAddCase" size="small" icon="Plus" style="margin-top: 10px;">添加步骤
        </el-button>

      </el-card>

    </div>

  </div>

  <!--  新增测试步骤的弹窗-->
  <el-drawer v-model="addStepDlg" title="添加步骤" size="20%">
    <AddTestFlow :cases="flowCaseList" :flow="activeFlow" @refreshCase="getFlowCase(activeFlow.id)"></AddTestFlow>
  </el-drawer>

  <!--  编辑测试用例的弹窗-->
  <el-drawer v-model="editStepDlg" title="编辑用例" size="40%">
    <CaseEditor :case_id="editCaseid"></CaseEditor>
  </el-drawer>

  <!--  显示运行结果的组件-->
  <el-drawer v-model="resultDlg" title="运行结果" size="40%">
    <RunFlowResult :results="runResult"></RunFlowResult>
  </el-drawer>


</template>

<script setup>
import {ProjectStore} from '@/stores/module/ProStore'
import http from '@/api/index'
import {ElLoading, ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {onMounted, ref} from "vue";
import draggable from 'vuedraggable';
import AddTestFlow from "@/views/TestFlow/components/AddTestFlow.vue";
import CaseEditor from "@/components/CaseEditor.vue";
import RunFlowResult from "@/views/TestFlow/components/RunFlowResult.vue";


const pStore = ProjectStore()

onMounted(() => {
  getFlowList()
})

//选择的业务流
let activeFlow = ref({
  id: "",
  name: "",
})

const flowList = ref([])

// 业务流中用例数据
const flowCaseList = ref([])


// 创建测试业务流
async function clickAddFlow() {
  let params = {
    name: '新建业务流',
    project: pStore.pro.id
  }
  const response = await http.flow.createFlowApi(params)
  if (response.status === 201) {
    ElNotification({
      title: '业务流创建成功',
      type: 'success',
    })
    await getFlowList()
  }
}

//获取测试业务流
async function getFlowList() {
  const response = await http.flow.getFlowListApi(pStore.pro.id)
  if (response.status === 200) {
    flowList.value = response.data
    // 将数据保存到pstore中
    pStore.flows = response.data
  }
  // console.log(response.data)
}

getFlowList()

//选中业务流
function selectFlow(item) {
  activeFlow.value = item
  getFlowCase()
}

//获取业务流中的测试用例
async function getFlowCase() {
  const response = await http.flow.getFlowCaseListApi(activeFlow.value.id)
  if (response.status === 200) {
    flowCaseList.value = response.data
  }
}

//添加步骤的弹窗
const addStepDlg = ref(false)

function clickAddCase() {
  addStepDlg.value = true
}


// case顺序变动时触发
async function updateSort() {
  const newflowCaseList = flowCaseList.value.map((item, index) => {
    return {...item, sort: index + 1};
  });
  console.log(newflowCaseList)

  const updatedList = newflowCaseList.map((item) => ({
    id: item.id,
    sort: item.sort
  }));
  console.log(updatedList)
  const response = await http.flow.updateFlowCaseOrderApi(updatedList)
  if (response.status === 200) {
    ElNotification({
      title: '排序更新成功',
      type: 'success',
      duration: 2000
    })
    await getFlowCase()
  }
}

// 删除业务流中的测试用例
async function deleteFlowCase(id) {
  const response = await http.flow.deleteFlowCaseApi(id)
  if (response.status === 204) {
    ElNotification({
      title: '删除成功',
      type: 'success'
    })
    await getFlowCase()
  }
}

//删除业务流
async function deleteFlow() {
  ElMessageBox.confirm(
      '删除操作不可恢复，请确认是否要删除该业务流?',
      '警告', {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
  ).then(async () => {
    const response = await http.flow.deleteFlowApi(activeFlow.value.id)
    if (response.status === 204) {
      ElNotification({
        title: '删除成功',
        type: 'success'
      })
      // 刷新页面数据
      await getFlowList()
    }
  })
}


// 编辑测试用例
const editCaseid = ref(null)

const editStepDlg = ref(false)

async function clickEditCase(case_id) {
  // console.log(case_id)
  editCaseid.value = case_id
  editStepDlg.value = true
}


// 保存业务流
async function saveFlow() {
  // console.log({...activeFlow.value})
  const response = await http.flow.updateFlowApi(activeFlow.value.id, {...activeFlow.value})
  if (response.status === 200) {
    ElNotification({
      title: '保存成功',
      type: 'success'
    })
  }
}

const runResult = ref([])
const resultDlg = ref(false)

// 运行业务流
async function runFlow() {
  const loadingInstance = ElLoading.service({fullscreen: true, text: '正在运行中...'})
  if (pStore.env) {
    const params = {
      env: pStore.env,
      scene: activeFlow.value.id
    }
    console.log(params)
    const response = await http.run.runFlowApi(params)
    if (response.status === 200) {
      ElNotification({
        title: '业务流运行完成',
        type: 'success',
        duration: 2000
      })
      runResult.value = response.data
      resultDlg.value = true
    }
  }else{
    ElMessage.error('请选择执行的测试环境')
  }
  loadingInstance.close()
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
      //padding: 0 3px;
      align-items: center;
      justify-content: center;
      border-bottom: solid 1px #6a6a6a;

      .name {
        font-weight: bold;
        font-size: 15px;
        margin: 0 15px 0 5px;
      }
    }

    .el-menu {
      border: none;

      .el-menu-item {
        height: 45px;
        line-height: 45px;
      }
    }
  }

  .right_box {
    flex: 1;
    padding: 10px;

    .name_edit {
      display: flex;

      .btns {
        width: 400px;
        text-align: center;
      }
    }

    .dragging {
      background-color: #cccccc;
      border: 2px solid #F3BA48;
      border-radius: 5px;
      z-index: 1000; /* 提升拖拽元素的层级 */
    }

    .drag-item {
      margin-bottom: 5px;
      cursor: move;
      text-align: center;
      display: flex;
      align-items: center;
    }

    .item-list {
      padding: 10px;
      border-radius: 4px;
    }

    .ghost {
      background-color: #cccccc;
      border: 2px dashed #00acc1;
      border-radius: 5px;
    }


  }


}

</style>