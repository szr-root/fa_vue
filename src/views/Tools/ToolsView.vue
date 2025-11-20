<template>
  <div class="main_box">
    <div class="card left_box">
      <el-menu :default-active="$route.path" router>
        <el-menu-item :index="item.path" v-for='item in tools_list' :key="item.path">
<!--          <img :src="item.iconImg" width="30" style="margin-right: 23px;">-->
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="card right_box">
      <router-view></router-view>
    </div>

  </div>
</template>

<script setup>
const tools_list = [
  {
    name: '解密',
    icon: 'el-icon-s-data',
    path: '/project/testtools/decrypt_data'
  },
  {
    name: '数据可视化',
    icon: 'el-icon-s-data',
    path: '/tools/report'
  },
  {
    name: '数据统计',
    icon: 'el-icon-s-data',
    path: '/tools/statistics'
  },
  {
    name: '数据处理',
    icon: 'el-icon-s-data',
    path: '/tools/handle'
  }
]

</script>


<style scoped lang="scss">
.main_box {
  display: flex;
  height: calc(100% - 42px);

  .left_box {
    padding: 5px;
    width: 20%;
  }

  .right_box {
    padding: 5px;
    flex: 1;
  }

}

</style>