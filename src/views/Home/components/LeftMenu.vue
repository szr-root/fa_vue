<template>
	<!-- logo -->
	<div class="logo">
		<img src="@/assets/logo.jpeg" alt="">
	</div>
	<!-- 菜单 -->
	<el-menu :default-active="$route.path" router>
		<el-menu-item :index="item.path" v-for='item in MenuList' :key="item.path">
			<img :src="item.iconImg" width="20" style="margin-right: 10px;">
			<span>{{item.name}}</span>
		</el-menu-item>
	</el-menu>
	
</template>

<script setup>
	import { UserStore } from '@/stores/UserStore'
	const ustore = UserStore()
	const MenuList = [
		{
			name: '项目环境',
			path: '',
			iconImg: "src/assets/icons/data.png"
		},
		{
			name: '接口列表',
			path: '/home',
			iconImg: "src/assets/icons/data.png"
		}
	]
</script>
	
<style lang="scss" scoped>
	.logo {
		height: 60px;
		text-align: center;
	
		img {
			height: 60px;
		}
	}
	.el-menu{
		border-right: none;
	}
	
</style>