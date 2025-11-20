<template>
  <!-- logo -->
  <div class="logo">
    <img src="@/assets/logo.jpeg" alt="">
  </div>
  <!-- 菜单 -->
  <el-menu :default-active="$route.path" router>
    <el-menu-item :index="item.path" v-for='item in MenuList' :key="item.path">
      <img :src="item.iconImg" width="30" style="margin-right: 23px;">
      <span>{{ item.name }}</span>
    </el-menu-item>
  </el-menu>

</template>

<script setup>
import {UserStore} from '@/stores/module/UserStore'

const ustore = UserStore()
const MenuList = [
  {
    name: '测试环境',
    path: '/project/env',
    iconImg: "/src/assets/icons/sun.png"
  },
  {
    name: '接口列表',
    path: '/project/interface',
    iconImg: "/src/assets/icons/hai.png"
  },
  {
    name: '用例列表',
    path: '/project/cases',
    iconImg: "/src/assets/icons/jin.png"
  },
  {
    name: '业务流测试',
    path: '/project/testflow',
    iconImg: "/src/assets/icons/earth.png"
  },
  {
    name: '测试任务',
    path: '/project/testTask',
    iconImg: "/src/assets/icons/huo.png"
  },
  {
    name: '测试记录',
    path: '/project/records',
    iconImg: "/src/assets/icons/mu.png"
  },
  {
    name: '定时任务',
    path: '/project/crontab',
    iconImg: "/src/assets/icons/tu.png"
  },
  {
    name: '测试工具',
    path: '/project/testtools',
    iconImg: "/src/assets/icons/tu.png"
  },
]
</script>

<style lang="scss" scoped>
.logo {
  height: 60px;
  text-align: center;

  img {
    height: 60px;
    border-radius: 30px;
  }
}

.el-menu {
  border-right: none;
}

</style>