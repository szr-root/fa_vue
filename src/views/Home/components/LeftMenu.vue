<template>
	<!-- logo -->
	<div class="logo">
		<img src="@/assets/logo.jpeg" alt="">
	</div>
	<!-- 菜单 -->
	<el-menu :default-active="$route.path" router>
		<el-menu-item :index="item.path" v-for='item in MenuList' :key="item.path">
			<img :src="item.iconImg" width="30" style="margin-right: 23px;">
			<span>{{item.name}}</span>
		</el-menu-item>
	</el-menu>
	
</template>

<script setup>
	import { UserStore } from '@/stores/module/UserStore'
	const ustore = UserStore()
	const MenuList = [
		{
			name: '项目环境',
			path: '/project/env',
			iconImg: "/src/assets/icons/sun.png"
		},
		{
			name: '接口列表',
			path: '/project/interface',
			iconImg: "/src/assets/icons/hai.png"
		},
		{
			name: '其他',
			path: '/other',
			iconImg: "/src/assets/icons/jin.png"
		},
		{
			name: '其他2',
			path: '/other2',
			iconImg: "/src/assets/icons/earth.png"
		},
		{
			name: '其他3',
			path: '/other3',
			iconImg: "/src/assets/icons/huo.png"
		},
		{
			name: '其他4',
			path: '/other4',
			iconImg: "/src/assets/icons/mu.png"
		},
		{
			name: '其他5',
			path: '/other5',
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
	.el-menu{
		border-right: none;
	}
	
</style>