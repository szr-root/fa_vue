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

// Import images directly so Vite can handle them properly
import sunIcon from '@/assets/icons/sun.png'
import haiIcon from '@/assets/icons/hai.png'
import jinIcon from '@/assets/icons/jin.png'
import earthIcon from '@/assets/icons/earth.png'
import huoIcon from '@/assets/icons/huo.png'
import muIcon from '@/assets/icons/mu.png'
import tuIcon from '@/assets/icons/tu.png'

const ustore = UserStore()
const MenuList = [
  {
    name: '测试环境',
    path: '/project/env',
    iconImg: sunIcon
  },
  {
    name: '接口列表',
    path: '/project/interface',
    iconImg: haiIcon
  },
  {
    name: '用例列表',
    path: '/project/cases',
    iconImg: jinIcon
  },
  {
    name: '业务流测试',
    path: '/project/testflow',
    iconImg: earthIcon
  },
  {
    name: '测试任务',
    path: '/project/testTask',
    iconImg: huoIcon
  },
  {
    name: '测试记录',
    path: '/project/records',
    iconImg: muIcon
  },
  {
    name: '定时任务',
    path: '/project/crontab',
    iconImg: tuIcon
  },
  {
    name: '测试工具',
    path: '/project/testtools',
    iconImg: tuIcon
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