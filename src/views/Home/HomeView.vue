<template>
    <el-container>
       <el-aside :style="{width:proStore.isCollapse? '65px' : '200px'}">
		  <LeftMenu></LeftMenu>
	   </el-aside>
      <el-container>
        <el-header>
			<Header></Header>
		</el-header>
        <el-main>
			<router-view></router-view>
		</el-main>
        <el-footer>
			<Footer></Footer>
		</el-footer>
      </el-container>
    </el-container>
</template>

<script setup>
	import LeftMenu from './components/LeftMenu.vue'
	import Header from './components/Header.vue'
	import Footer from './components/Footer.vue'
	
	import {UserStore} from '@/stores/module/UserStore'
	import { ProjectStore } from '@/stores/module/ProStore'
	
	const proStore = ProjectStore()
	const ustore = UserStore()

</script>

<style lang="scss" scoped>
	
	.el-container {
		height: 100%;
	
		.el-aside {
			border-right: solid 1px #6a6a6a;
			// width: 200px;
		}
	
		.el-header {
			border-bottom: solid 1px #6a6a6a;
			padding: 0;
			height: 55px;
		}
	
		.el-footer {
			border-top: solid 1px #6a6a6a;
			height: 29px;
		}
		.el-main{
			padding: 0;
		}
	
	}

</style>