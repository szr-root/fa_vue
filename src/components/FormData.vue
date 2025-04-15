<template>
  <el-row :gutter="5">
    <el-col :span="15">
      <el-row v-for="(item, index) in params" :key="index" :gutter="5" style="margin-top: 5px;">
        <el-col :span="5">
          <el-input size="small" v-model="item[0]" placeholder="参数名" clearable/>
        </el-col>
        <el-col :span="5">
          <el-select @change="selectType($event, index)" v-model="paramsType[index]" placeholder="参数类型" size="small"
                     style="width: 100%;">
            <el-option label="Text" value="text"/>
            <el-option label="File" value="file"/>
          </el-select>
        </el-col>
        <el-col :span="10">
          <!-- 文字输入框 -->
          <el-input v-if="paramsType[index] === 'text'" v-model="item[1]" placeholder="参数值" size="small"
                    clearable/>
          <el-select v-else @change="selectFile($event, index)" v-model="item[1][0]" size="small"
                     placeholder="选择已有文件" style="width: 100%;">
            <el-option v-for="item in files" :label="item.info[0]" :value="item.info[0]"/>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button icon="Delete" @click="params.splice(index, 1)" size="small"
                     type="danger" plain></el-button>
        </el-col>
      </el-row>
      <el-button @click="params.push(['',''])" style="margin-top: 10px;" icon="Plus" size="small" type="primary"
                 plain></el-button>
    </el-col>
    <el-col :span="9">
      <el-card style="padding: 0;">
        <el-upload class="upload-demo" :show-file-list="false" :action="uploadApi" :on-success="uploadSuccess"
                   :on-error="uploadError" name="file">
          <el-button type="primary" plain size="small">上传文件</el-button>
        </el-upload>
        <el-table :data="files" style="width: 100%" size="small" height="200px">
          <el-table-column label="已有文件" show-overflow-tooltip>
            <template #default="scope">
              <el-tag type="success" @click="viewFile(scope.row.info)">{{ scope.row.info[0] }}</el-tag>
            </template>

          </el-table-column>
          <el-table-column label="文件类型">
            <template #default="scope">
              <el-tag type="info">{{ scope.row.info[1] }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div v-if="mediaIframe">
          <img v-if="fileType === 'image'" @click="showFullImg" :src="mediaIframe" style="width: 100%; height: 200px;"
               alt="预览">
          <!--          <video v-else :src="mediaIframe"  @click="showFullImg" style="width: 100%; height: 200px;"></video>-->
          <video
              v-else
              :src="mediaIframe"
              @click="showFullImg"
              controls
              preload="metadata"
              controlsList="nodownload"
              style="width: 100%; height: 200px;">
            您的浏览器不支持视频播放
          </video>
        </div>

        <!-- 添加Dialog组件,用于大屏展示 -->
        <el-dialog v-if="fileType==='image'" v-model="dialogVisible" title="图片预览" width="80%">
          <img :src="mediaIframe" style="width: 100%; height: auto;" alt="完整图片">
        </el-dialog>
        <el-dialog v-else v-model="dialogVisible" title="视频预览" :width="dialogWidth" ref="videoDialog">
          <video
              :src="mediaIframe"
              style="width: 100%; height:500px;"
              controls
              preload="auto"
              controlsList="nodownload"
              @loadedmetadata="setDialogWidth"
              autoplay
          >
            您的浏览器不支持视频播放
          </video>
        </el-dialog>


      </el-card>
    </el-col>
  </el-row>
</template>


<script setup>
import {ref, watch, onMounted} from 'vue';
import {ElMessage} from 'element-plus';
import http from '@/api/index';
import request from '@/api/request';


const uploadApi = request.defaults.baseURL + `/api/testFile/files/`


const params = ref([]); // ['name','value']
const files = ref([]);
const paramsType = ref([]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: [
      ['', '']
    ]
  }
});

const emit = defineEmits(['update:modelValue']);


const mediaIframe = ref(null);
const dialogVisible = ref(false);
const fileType = ref('image')


const viewFile = (info) => {
  mediaIframe.value = info[2];
  const type = info[1].toLowerCase().split('/')[0];
  console.log(type)
  if (type === 'image') {
    fileType.value = 'image'
  } else {
    fileType.value = 'video'
    // 如果是视频，可以尝试添加时间戳来避免缓存问题
    // mediaIframe.value = `${info[2]}?t=${new Date().getTime()}`;
  }

};

const dialogWidth = ref('80%'); // 默认宽度
const videoDialog = ref(null); // 对话框的 ref

const setDialogWidth = (event) => {
  const video = event.target;
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  const maxWidth = window.innerWidth * 0.8; // 最大宽度为视口宽度的80%
  const maxHeight = window.innerHeight * 0.8; // 最大高度为视口高度的80%

  let dialogWidthValue = (videoWidth / videoHeight) * maxHeight;
  if (dialogWidthValue > maxWidth) {
    dialogWidthValue = maxWidth;
  }

  dialogWidth.value = `${dialogWidthValue}px`;
};


const showFullImg = () => {
  dialogVisible.value = true; // 显示Dialog
};


const selectType = (val, index) => {
  if (val === 'file') {
    params.value[index][1] = ['', '', ''];
  } else {
    params.value[index][1] = '';
  }
};


const selectFile = (val, index) => {
  // 当前选中的文件
  const sFile = files.value.find(item => {
    return item.info[0] === val;
  });
  // 修改文件
  params.value[index][1] = [...sFile.info];
  console.log(params.value);
};

const uploadSuccess = (response) => {
  ElMessage({
    type: 'success',
    message: '文件上传成功!',
    duration: 2000
  });
  getAllFile();
};

const uploadError = (error) => {
  ElMessage({
    type: 'error',
    message: error,
    duration: 2000
  });
};

const getAllFile = async () => {
  // 获取文件列表
  const response = await http.pro.getFiles();
  if (response.status === 200) {
    files.value = response.data;
  }
};

const getParamsType = () => {
  // 获取参数类型
  paramsType.value = [];
  params.value.forEach(item => {
    if (typeof item[1] === 'string') {
      paramsType.value.push('text');
    } else {
      paramsType.value.push('file');
    }
  });
};

onMounted(() => {
  if (props.modelValue.length > 0) {
    params.value = props.modelValue;
  } else {
    params.value = [
      ['', '']
    ];
  }
  getAllFile();
  getParamsType();
});

watch(() => params.value.length, (val) => {
  getParamsType();
});

watch(() => params.value, (value) => {
  emit('update:modelValue', value);
}, {deep: true});

watch(() => props.modelValue, (value) => {
  params.value = value;
}, {deep: true});

</script>


<style scoped lang="scss">

.el-card {
  --el-card-padding: 10px;

  .el-button {
    margin-bottom: 5px;
  }
}


// 添加视频相关样式
video {
  object-fit: contain;
  background: #000; /* 添加黑色背景 */
  cursor: pointer;

  &::-webkit-media-controls-download-button {
    display: none; /* 隐藏 Chrome 下载按钮 */
  }

  &::-webkit-media-controls-enclosure {
    overflow: hidden;
  }
}

// 优化弹窗中的视频显示
.el-dialog {
  .el-dialog__body {
    padding: 10px;
    background: #000;

    video {
      max-height: 70vh;
      margin: 0 auto;
      display: block;
    }
  }
}

</style>