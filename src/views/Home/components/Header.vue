<template>
	<div class="head_box">
		<div class="left_box">
			<el-icon size="28" @click="switchCollapse" style="margin: 0 5px;">
							<Expand v-if='proStore.isCollapse' />
							<Fold v-else />
			</el-icon>
			<!-- 选择框 -->
			<el-select v-model="env" placeholder="请选择测试环境">
				<el-option v-for='item in envList' :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</div>
		<div class="center_box">
			接口测试平台
		</div>
		<div class="right_box">
			<el-button plain icon="Switch" class='box2' @click="ChangePro"> 切换项目 </el-button>
		
			<el-dropdown>
				<el-button plain icon="User" > 
					{{uStore.userinfo.nickname}} 
				</el-button>
				<template #dropdown>
					<el-button plain icon="User" @click='LogOut'> 退出登录 </el-button>
				</template>			
			</el-dropdown>
			
		</div>
	</div>

</template>

<script setup>
	import {ref,reactive} from 'vue'
	import http from '@/api/index'
	import {ElNotification} from 'element-plus'
	import {ProjectStore} from '@/stores/module/ProStore'
	import { UserStore } from '@/stores/module/UserStore'
	import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'
	
	const uStore = UserStore()
	const router = useRouter()
	const proStore = ProjectStore()
	const proStoreRef = storeToRefs(proStore)
	proStore.getEnvList()
	
	const envList = proStoreRef.envList
	let env = proStoreRef.env
	
	function switchCollapse(){
			proStore.isCollapse = !proStore.isCollapse
		}
	function ChangePro(){
		router.push('project')
	}
	
	function LogOut(){
		// 跳转到登录页面，清空登录的用户信息和pinia的数据
		router.push({
			name: "login"
		})
		ElNotification({
			title: '已退出登录',
			type: 'success',
		})
		// 清除token
		uStore.token = ''
		// 修改登录的状态
		uStore.isAuthenticated = false
	}
</script>

<style lang='scss' scoped> 
	.head_box{
		
		height: 55px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.left_box{
			flex:1;
			display: flex;
			align-items: center;
			height:55px;
			margin-right: 5px;
		}
		.center_box{
			height: 50px;
			width: 850px;
			line-height: 50px;
			text-align: center;
			font-weight: bold;
			font-size: 22px;
			color: #00aaff;
			flex-shrink: 0;
			border-radius: 10px;
			background: linear-gradient(120deg, #F3BA48 0%, #FEDC96 100%);
			margin-right: 5px;
		}
		.right_box{
			display: flex;
			align-items: center;
			justify-content: right;
			padding-right: 20px;
			.box2{
				margin-right: 3px;
			}
	
		}
	}

</style>