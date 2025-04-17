<template>
  <el-tabs :model-value="$route.path" class="demo-tabs" @tab-click="handleClick" type="card" @tab-remove="removeTag">
    <div v-for="item in pstore.tags">
      <el-tab-pane :label="item.name" :name="item.path" v-if="item.path == $route.path"></el-tab-pane>
      <el-tab-pane :label="item.name" :name="item.path" v-else closable></el-tab-pane>
    </div>
  </el-tabs>

</template>

<script setup>
import {ProjectStore} from '@/stores/module/ProStore'
import {useRouter} from 'vue-router'

const pstore = ProjectStore()
const router = useRouter()

function handleClick(ele) {
  // console.log(ele)
  router.push(ele.props.name)
}

function removeTag(path) {
  pstore.delTags(path)
}

</script>

<style scoped lang="scss">

</style>