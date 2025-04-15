<el-col :span="9">
      <el-card style="padding: 0;">
        <el-upload class="upload-demo" :show-file-list="false"
                   :on-success="uploadSuccess" :on-error="uploadError" name="file" >
          <el-button type="primary" plain size="small">上传文件</el-button>
        </el-upload>
        <el-table :data="files" style="width: 100%" size="small" height="200px">
          <el-table-column label="已有文件">
            <template #default="scope">
              <el-tag type="success" @click="viewFile( scope.row.info[0] )">{{ scope.row.info[0] }}</el-tag>
            </template>

          </el-table-column>
          <el-table-column label="文件类型">
            <template #default="scope">
              <el-tag type="info">{{ scope.row.info[1] }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <iframe ref="mediaIframe" style="width: 100%; height: 300px;"></iframe>
        </div>

      </el-card>
    </el-col>