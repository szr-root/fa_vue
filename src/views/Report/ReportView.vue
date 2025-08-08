<template>
  <el-row v-if="state.report">
    <el-col :span="12">
      <el-scrollbar height="calc(100vh - 65px)">
        <el-card v-if="state.record" body-style="padding-top:0">
          <div class="report_title">
            <i>
              测试报告
            </i>
          </div>
          <el-descriptions :column="5" border direction="vertical">
            <el-descriptions-item label="执行时间">{{ formatDateTime(state.record.create_time) }}</el-descriptions-item>
            <el-descriptions-item label="执行任务">{{ state.record.task }}</el-descriptions-item>
            <el-descriptions-item label="执行环境">{{ state.record.env }}</el-descriptions-item>
            <el-descriptions-item label="通过率">{{ state.record.pass_rate + '%' }}</el-descriptions-item>
            <el-descriptions-item label="总耗时">{{ state.record.run_time }}</el-descriptions-item>

          </el-descriptions>
        </el-card>

        <el-card body-style="padding:5px">
          <el-row :gutter="5">
            <!--             用例信息图表-->
            <el-col :span="12">
              <div class="chartBox" id="chart1"></div>
            </el-col>
            <!--            通过率图表-->
            <el-col :span="12">
              <div class="chartBox" id="chart2"></div>
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <el-descriptions :column="4" border title="测试业务流统计" direction="vertical">
            <el-descriptions-item label="业务流总数">{{ state.report.results.length }}</el-descriptions-item>
            <el-descriptions-item label="通过业务流">{{ successFlow.length }}</el-descriptions-item>
            <el-descriptions-item label="失败业务流">{{ failFlow.length }}</el-descriptions-item>
            <el-descriptions-item label="错误业务流">{{ errorFlow.length }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card>
          <b style="line-height: 30px"> 未通过业务流 </b>
          <div>
            <el-button plain size="small" @click="state.FlowDatas = [su]" type="danger"
                       v-for="su in errorFlow">{{ su.name }}
            </el-button>
            <el-button plain size="small" @click="state.FlowDatas = [su]" type="warning"
                       v-for="su in failFlow">{{ su.name }}
            </el-button>
          </div>
        </el-card>

        <el-card>
          <b style="line-height: 30px"> 通过的业务流 </b>
          <div>
            <el-button plain size="small" @click="state.FlowDatas = [su]" type="success"
                       v-for="su in successFlow">{{ su.name }}
            </el-button>
          </div>
        </el-card>

      </el-scrollbar>
    </el-col>

    <!--    右侧-->
    <el-col :span="12">
      <div>
        <div style="margin: 5px;text-align: center">
          <el-button size="small" plain type="primary" @click="state.FlowDatas = {...state.report.results}">所有业务流
          </el-button>
          <el-button size="small" plain type="success" @click="state.FlowDatas = successFlow">成功业务流
          </el-button>
          <el-button size="small" plain type="warning" @click="state.FlowDatas = failFlow">失败业务流
          </el-button>
          <el-button size="small" plain type="danger" @click="state.FlowDatas = errorFlow">错误业务流
          </el-button>
        </div>

        <el-scrollbar height="calc(100vh - 117px)">
          <div class="right_box">
            <el-card v-for="(flow,index) in state.FlowDatas" :key="index">
              <div class="title" v-if="flow.status==='成功'">
                <div>
                  <el-icon color="green">
                    <SuccessFilled/>
                  </el-icon>
                </div>
                <div style="color:seagreen;font-weight: bold;margin-left: 5px;margin-bottom: 5px"> {{
                    '测试业务流: ' + flow.name + '【通过】'
                  }}
                </div>
              </div>
              <div class="title" v-else-if="flow.status==='失败'">
                <div>
                  <el-icon color='#e19118'>
                    <Failed/>
                  </el-icon>
                </div>

                <div style="color:#e6a23c;font-weight: bold;margin-left: 5px;margin-bottom: 5px"> {{
                    '测试业务流: ' + flow.name + '【失败】'
                  }}
                </div>
              </div>
              <div class="title" v-else>
                <div>
                  <el-icon color='#f56c6c'>
                    <CircleCloseFilled/>
                  </el-icon>
                </div>
                <div style="color:#f56c6c;font-weight: bold;margin-left: 5px;margin-bottom: 5px"> {{
                    '测试业务流: ' + flow.name + '【错误】'
                  }}
                </div>
              </div>

              <el-table :data="flow.cases" style="width: 100%" class="result" :show-header="false">
                <el-table-column type="expand">
                  <template #default="scope">
                    <Result :result='scope.row'></Result>
                  </template>
                </el-table-column>

                <el-table-column :show-overflow-tooltip="true" label="用例名称" prop="name"
                                 min-width="100px"></el-table-column>
                <el-table-column label="请求方法" prop="method"
                                 min-width="40px"></el-table-column>
                <el-table-column label="状态吗" prop="status_code"
                                 min-width="40px"></el-table-column>
                <el-table-column label="断言结果" prop="state"
                                 min-width="40px">
                  <template #default="scope">
                    <el-tag v-if="scope.row.status === '成功'" type="success">成功</el-tag>
                    <el-tag v-else-if="scope.row.status === '失败'" type="warning">失败</el-tag>
                    <el-tag v-else type="danger">错误</el-tag>
                  </template>
                </el-table-column>

              </el-table>


            </el-card>
          </div>
        </el-scrollbar>

      </div>
    </el-col>

  </el-row>
</template>

<script setup>
import {onMounted, onUpdated, reactive, computed} from 'vue'
import chart from '@/utils/chart.js'
import {useRoute} from 'vue-router'
import http from '@/api/index.js'
import Result from "@/components/Result.vue";
import {SuccessFilled, Failed, CircleCloseFilled} from '@element-plus/icons-vue'

const route = useRoute()
const state = reactive({
  record: {
    create_time: '',
    task: '',
    env: '',
    pass_rate: 0,
    run_time: ''
  },
  report: {
    results: [],
    all: 0,
    success: 0,
    fail: 0,
    error: 0
  },
  FlowDatas: null
})


async function getReportInfo(id) {
  const response = await http.task.getTaskReportApi(id)
  if (response.status === 200) {
    state.report = response.data.info;
    state.FlowDatas = {...state.report.results};
  }
}

async function getRecordInfo(id) {
  const response = await http.task.getRecordsInfoApi(id)
  if (response.status === 200) {
    state.record = response.data
  }
}


onMounted(() => {
  const rid = route.params.id
  getRecordInfo(rid)
  getReportInfo(rid)
})

const successFlow = computed(() => {
  return state.report.results.filter(item => item.status === '成功')
})

const failFlow = computed(() => {
  return state.report.results.filter(item => item.status === '失败')
})

const errorFlow = computed(() => {
  return state.report.results.filter(item => item.status === '错误')
})


function show_chart1() {
  const value = [state.report.all, state.report.success, state.report.fail, state.report.error]
  const label = ['用例总数', '通过数', '失败数', '错误数']
  const ele = document.querySelector('#chart1')
  chart.chart1(ele, value, label)
}

function show_chart2() {
  const datas = [{value: state.report.success, name: '通过'}, {value: state.report.fail, name: '失败'},
    {value: state.report.error, name: '错误'}];
  const ele = document.querySelector('#chart2')
  chart.chart2(ele, datas)
}

function formatDateTime(dateString) {
  if (!dateString) return '';

  // 创建 Date 对象
  const date = new Date(dateString);

  // 获取年月日时分秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 返回格式化后的字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


onUpdated(() => {
  if (document.querySelector('#chart1')) {
    show_chart1()
  }
  if (document.querySelector('#chart2')) {
    show_chart2()
  }
})


</script>

<style scoped>
.report_title {
  font: bold 24px/50px "微软雅黑";
  text-align: center;
  color: #17abe3;
  vertical-align: top;
}


.title {
  display: flex;
  text-align: center;
  align-items: center;
}


.chartBox {
  width: 300px;
  height: 200px;
}

:deep(.el-descriptions__header) {
  font: bold 24px "微软雅黑";
  text-align: center;
  justify-content: center;
}

</style>