<template>
	<div class="pro_page">
		<div class="pro_box">
			<div class="welcome">
				<span>欢迎使用自动化测试平台</span>
				<el-button icon="CirclePlus" size="small" @click='showDlg'>添加项目</el-button>
			</div>
			<div class="pro_list">			
				<el-carousel :interval="4000" type="card" height="400px" motion-blur>
					<el-carousel-item v-for="(item,index) in proList" :key="index">
						<div class="pro">
							<div @click='enterProject(item)'>
								<!-- 图片 -->
								<img src="@/assets/procard.jpg">
								<!-- 名称 -->
								<div class="name">
									{{item.name}}
								</div>
							</div>
							<!-- 按钮 -->
							<div class="btn_box1">
								<el-button @click='clickEdit(item)' plain icon='Edit' type="primary" size="small"></el-button>
							</div>
							<div class="btn_box2">
								<el-button @click='clickDelete(item.id)' plain icon='Delete' type="danger" size="small"></el-button>
							</div>
						</div>
					</el-carousel-item>
				</el-carousel>
		</div>
		<div class="iod">
			我觉得该写点什么，但是又不知道写点什么。
		</div>
		<div class="iod">
			只是觉得这样看起来这里很空旷，随便写点东西占个位置
		</div>
	</div>
	
	<!-- 添加项目的弹框 -->
	<el-dialog v-model="isDlgShow" title="添加项目">
		<el-form :model="fromData" label-width="80">
			<el-form-item label="项目名称">
				<el-input v-model="fromData.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="负责人">
				<el-select v-model="fromData.leader" placeholder="选择负责人" >
					<el-option v-for="item in users" :key="item.id" :value="item.id" :label="item.nickname">
						
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="isDlgShow = false">取消</el-button>
				<el-button type="primary" @click="creatPro">确认</el-button>
			</span>
		</template>
	</el-dialog>

	

</div>
</template>



<script setup>
	import {ref,reactive} from 'vue'
	import {ElNotification} from 'element-plus'
	import http  from '@/api/index'
 
	let proList = ref([])
	async function getProList(){
		const resposne = await http.pro.getProListApi()
		if(resposne.status == 200){
			console.log(resposne.data)
			proList.value = resposne.data
		}
	}
	getProList()
	
	
	// ===================实现项目添加的功能=================
	let isDlgShow = ref(false)
	let users = ref([])
	let fromData = reactive({
		name: "",
		leader: ""
	})
	
	// 加载用户
	async function getUserList(){
		const response = await http.user.getUserListApi()
		users.value = response.data
		console.log(users.value)
	}
	
	// 显示添加窗口
	function showDlg() {
		getUserList()
		isDlgShow.value = true
	}
	// 发送请求添加项目
	async function creatPro() {
		const response = await http.pro.createProApi(fromData)
		if (response.status === 201) {
			// 弹出提示
			ElNotification({
				title: '项目创建成功',
				type: 'success',
			})
			// 关闭窗口
			isDlgShow.value = false
			// 刷新页面数据
			getProList()
		}
	}

</script>

<style lang='scss' scoped>
	@use './pro.scss';
</style>

