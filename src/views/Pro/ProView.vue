<template>
	<div class="pro_page">
		<div class="pro_box">
			<div class="welcome">
				<span>欢迎使用自动化测试平台</span>
				<el-button icon="CirclePlus" size="small" @click='showDlg' style="color: black">添加项目</el-button>
			</div>
			<div class="pro_list">			
				<el-carousel type="card" height="400px" motion-blur  loop:false>
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
	
	<!-- 修改项目的弹框 -->
	<el-dialog v-model="isUpdateDlgShow" title="编辑项目">
		<el-form :model="fromUpdateData" label-width="80">
			<el-form-item label="项目名称">
				<el-input v-model="fromUpdateData.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="负责人">
				<el-select v-model="fromUpdateData.leader" placeholder="选择负责人" >
									<el-option v-for="item in users" :key="item.id" :value="item.nickname" :label="item.nickname"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="isUpdateDlgShow = false">取消</el-button>
				<el-button type="primary" @click="updatePro">确认</el-button>
			</span>
		</template>
	</el-dialog>
	
	

</div>
</template>



<script setup>
	import {ref,reactive} from 'vue'
	import {ElNotification,ElMessage,ElMessageBox} from 'element-plus'
	import http  from '@/api/index'
	import {ProjectStore} from '@/stores/module/ProStore'
	import { useRouter } from 'vue-router'
	

	const router = useRouter()
 
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
	// ProView.vue
// ===========实现项目修改的功能===================
	let isUpdateDlgShow = ref(false)
	let fromUpdateData = ref({
		name: "",
		leader: ""
	})
	// 点击编辑按钮时调用的方法
	function clickEdit(pro) {
		getUserList()
		isUpdateDlgShow.value = true
		fromUpdateData.value = { ...pro }
		// console.log("edit::",pro,{ ...pro })
	}
	// 发送请求修改项目信息
	async function updatePro() {
		let pro_id = fromUpdateData.value.id
		const response = await http.pro.editProApi(pro_id, fromUpdateData.value)
		if (response.status === 200) {
			ElNotification({
				title: '项目修改成功',
				type: 'success',
				duration: 3000
			})
			// 关闭窗口
			isUpdateDlgShow.value = false
			// 刷新页面上的数据
			getProList()
		}
	}
// ==============实现项目删除的功能=====================
function clickDelete(pro_id) {
	// 调用后端的接口进行删除
	ElMessageBox.confirm(
			'删除操作不可恢复，请确认是否要删除该项目?',
			'提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		)
		.then(async () => {
			// 调用接口进行删除
			const response = await http.pro.deleteProApi(pro_id)
			if (response.status === 204) {
				ElMessage({
					type: 'success',
					message: '已成功删除该项目',
				})
				// 刷新页面数据
				getProList()
			}
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '已取消删除操作',
			})
		})
}

function enterProject(pro){
	const proStore = ProjectStore()
		// 保存项目信息
		proStore.pro = pro
		router.push('home')
	
}



</script>

<style lang='scss' scoped>
	@use './pro.scss';
</style>

